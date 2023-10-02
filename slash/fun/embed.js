const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Util } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Create an embed')
    .addStringOption(option =>
      option.setName('title')
        .setDescription('Title of the embed')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('description')
        .setDescription('Description of the embed')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('color')
        .setDescription('Hex color code for the embed (optional)')
    ),
  async execute(interaction) {
    const title = interaction.options.getString('title');
    const description = interaction.options.getString('description');
    const color = interaction.options.getString('color') || getRandomHexColor();

    const embed = new MessageEmbed()
      .setTitle(title)
      .setDescription(description)
      .setColor(color);

    interaction.reply({ embeds: [embed] });
  },
};

function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16).toUpperCase()}`;
}
