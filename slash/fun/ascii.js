const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const figlet = require('figlet');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ascii')
    .setDescription('Create ASCII art from text')
    .addStringOption(option =>
      option.setName('text')
        .setDescription('The text you want to convert to ASCII art')
        .setRequired(true)
    ),
  async execute(interaction) {
    const text = interaction.options.getString('text');

    figlet.text(text, function (err, data) {
      if (err) {
        console.error('Something went wrong');
        console.dir(err);
        interaction.reply('Something went wrong while generating ASCII art.');
      } else {
        if (data.length > 2000) {
          interaction.reply('Please provide text shorter than 2000 characters.');
        } else {
          const asciiEmbed = new MessageEmbed()
            .setTitle('ASCII Art')
            .setDescription('```' + data + '```')
            .setColor('RANDOM');

          interaction.reply({ embeds: [asciiEmbed] });
        }
      }
    });
  },
};
        