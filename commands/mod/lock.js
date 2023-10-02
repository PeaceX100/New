const { MessageEmbed } = require('discord.js');

module.exports = {
  name: "lock",
  category: 'mod',
  aliases: ['l','lk'],
  description: "Locks the channel by revoking send messages and add reactions permissions for all roles.",
  async execute(client, msg, args) {
    // Check if the user has the required permission
    if (!msg.member.permissions.has("MANAGE_CHANNELS")) {
      const lockPermErr = new MessageEmbed({
        title: "**User Permission Error!**",
        description: "**Sorry, you don't have permissions to use this! ❌**"
      });
      return msg.channel.send({ embeds: [lockPermErr] });
    }

    // Get the channel to lock
    const channel = msg.channel;

    // Loop through each role and deny send messages and add reactions permissions
    try {
      msg.guild.roles.cache.forEach(role => {
        channel.permissionOverwrites.edit(role, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false
        });
      });
    } catch (e) {
      console.log(e);
      return msg.channel.send('An error occurred while trying to lock the channel.');
    }

    return msg.channel.send('Channel locked! 🔒');
  }
};
