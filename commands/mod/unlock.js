const { MessageEmbed } = require('discord.js');

module.exports = {
  name: "unlock",
  category: 'mod',
  aliases: ['unl','ul'],
  description: "Unlocks the channel by restoring send messages and add reactions permissions for all roles.",
  async execute(client, msg, args) {
    // Check if the user has the required permission
    if (!msg.member.permissions.has("MANAGE_CHANNELS")) {
      const unlockPermErr = new MessageEmbed({
        title: "**User Permission Error!**",
        description: "**Sorry, you don't have permissions to use this! ❌**"
      });
      return msg.channel.send({ embeds: [unlockPermErr] });
    }

    // Get the channel to unlock
    const channel = msg.channel;

    // Loop through each role and allow send messages and add reactions permissions
    try {
      msg.guild.roles.cache.forEach(role => {
        channel.permissionOverwrites.edit(role, {
          SEND_MESSAGES: true,
          ADD_REACTIONS: true
        });
      });
    } catch (e) {
      console.log(e);
      return msg.channel.send('An error occurred while trying to unlock the channel.');
    }

    return msg.channel.send('Channel unlocked! 🔓');
  }
};
                  