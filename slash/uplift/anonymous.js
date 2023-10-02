const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const db = require('old-wio.db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('anonymous')
    .setDescription('Send an anonymous message')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('The message to send anonymously')
        .setRequired(true)
    ),
  async execute(interaction) {
    const message = interaction.options.getString('message');
    const anonymousChannelID = db.fetch(`anonymous_${interaction.guild.id}`);

    if (!anonymousChannelID) {
      return interaction.reply({ content: 'The anonymous channel has not been set up. Please ask an administrator to set it up using /setup.', ephemeral: true });
    }

    const anonymousChannel = interaction.guild.channels.cache.get(anonymousChannelID);

    if (!anonymousChannel) {
      return interaction.reply({ content: 'The anonymous channel could not be found. Please ask an administrator to reconfigure the anonymous channel using /setup.', ephemeral: true });
    }

    const embed = new MessageEmbed({
      title: 'Anonymous needs help',
      description: `**${message}**`,
      timestamp: new Date(),
      color: 'RANDOM',
    });

    anonymousChannel.send({ embeds: [embed] });

    await interaction.reply({ content: 'Your anonymous message has been sent.', ephemeral: true });
  },
};
      