const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Locks the channel by revoking send messages and add reactions permissions for all roles.'),

  async execute(interaction) {
    // Check if the user has the required permission
    if (!interaction.member.permissions.has("MANAGE_CHANNELS")) {
      const lockPermErr = new MessageEmbed({
        title: "**User Permission Error!**",
        description: "**Sorry, you don't have permissions to use this! ❌**"
      });
      return interaction.reply({ embeds: [lockPermErr], ephemeral: true });
    }

    // Get the channel to lock
    const channel = interaction.channel;

    // Loop through each role and deny send messages and add reactions permissions
    try {
      interaction.guild.roles.cache.forEach(role => {
        channel.permissionOverwrites.edit(role, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false
        });
      });
    } catch (e) {
      console.log(e);
      return interaction.reply({ content: 'An error occurred while trying to lock the channel.', ephemeral: true });
    }

    return interaction.reply('Channel locked! 🔒');
  },
};
