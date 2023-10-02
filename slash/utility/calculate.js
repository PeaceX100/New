const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const math = require('mathjs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('calculate')
    .setDescription("Shows Calculated Answers Of User's Query")
    .addStringOption(option =>
      option.setName('query')
        .setDescription('The mathematical query to calculate')
        .setRequired(true)
    ),

  async execute(interaction) {
    const query = interaction.options.getString('query');

    if (!query) {
      return interaction.reply('**Enter something to calculate**');
    }

    let result;
    try {
      result = math.evaluate(
        query
          .replace(/[x]/gi, '*')
          .replace(/[,]/g, '.')
          .replace(/[÷]/gi, '/')
      );
      // Ensure the result is a string
      result = result.toString();
    } catch (e) {
      return interaction.reply(
        '**Enter a valid calculation!**\n\n**List of Calculations** - \n1. **sqrt equation** - `sqrt(3^2 + 4^2) = 5`\n2. **Units to Units** - `2 inch to cm = 0.58`\n3. **Complex Expressions Like** - `cos(45 deg) = 0.7071067811865476`\n4. **Basic Maths Expressions** - `+, -, ^, /, decimals` = **2.5 - 2 = 0.5**'
      );
    }

    const resultEmbed = new MessageEmbed()
      .setColor('RANDOM')
      .setTitle('Calculator')
      .addFields(
        { name: 'Operation', value: query, inline: false },
        { name: 'Result', value: result, inline: false }
      );

    interaction.reply({ embeds: [resultEmbed] });
  },
};
