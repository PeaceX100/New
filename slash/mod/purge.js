const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Deletes messages from a channel')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('The number of messages to delete')
        .setRequired(true)
    ),
  async execute(interaction) {
    // Check if the user has the MANAGE_MESSAGES permission
    if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
      return interaction.reply('You do not have sufficient permissions to manage messages.');
    }

    const amount = interaction.options.getInteger('amount');

    // Check the range of the number of messages to delete
    if (amount <= 0 || amount > 100) {
      return interaction.reply('Please provide a number between 1 and 100.');
    }

    try {
      // Defer the reply first
      await interaction.deferReply({ ephemeral: true });

      // Bulk delete messages with filtering (true)
      const deletedMessages = await interaction.channel.bulkDelete(amount, true);

      // Send a success message after the purge
      const successEmbed = new MessageEmbed()
        .setColor('GREEN')
        .setDescription(`Successfully deleted ${deletedMessages.size} messages.`);

      await interaction.followUp({ embeds: [successEmbed] });

    } catch (error) {
      console.error(error);
      return interaction.followUp('You cannot bulk delete messages older than 14 days or an error occurred.');
    }
  },
};
      