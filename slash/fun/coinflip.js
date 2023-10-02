const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('Flip a coin.'),
  async execute(interaction) {
    const side = Math.random() > 0.5 ? 'Heads' : 'Tails';
    const result = side; // Set result based on the coin flip side

    const embed = {
      color: 'GREEN',
      title: 'Coin Flip',
      description: `**${interaction.user.username} Flipped ${result}**!`,
      footer: {
        text: `Flipped by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      },
      timestamp: new Date(),
    };

    await interaction.reply({ embeds: [embed] });
  },
};
        