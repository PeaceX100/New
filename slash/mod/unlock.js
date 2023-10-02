const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('Unlocks the channel by restoring send messages and add reactions permissions for all roles.'),

  async execute(interaction) {
    // Check if the user has the required permission
    if (!interaction.member.permissions.has("MANAGE_CHANNELS")) {
      const unlockPermErr = new MessageEmbed({
        title: "**User Permission Error!**",
        description: "**Sorry, you don't have permissions to use this! ❌**"
      });
      return interaction.reply({ embeds: [unlockPermErr], ephemeral: true });
    }

    // Get the channel to unlock
    const channel = interaction.channel;

    // Loop through each role and allow send messages and add reactions permissions
    try {
      interaction.guild.roles.cache.forEach(role => {
        channel.permissionOverwrites.edit(role, {
          SEND_MESSAGES: true,
          ADD_REACTIONS: true
        });
      });
    } catch (e) {
      console.log(e);
      return interaction.reply({ content: 'An error occurred while trying to unlock the channel.', ephemeral: true });
    }

    return interaction.reply('Channel unlocked! 🔓');
  },
};
