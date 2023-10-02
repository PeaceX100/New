const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const rps = ['scissors', 'rock', 'paper'];
const res = [`Scissors ✂️`, `Rock 🗿`, `Paper 🗞️`];

module.exports = {
  data: new SlashCommandBuilder()
	.setName('rps')
	.setDescription('Play Rock, Paper, Scissors')
	.addStringOption(option =>
		option.setName('choice')
			.setDescription('Your choice')
			.setRequired(true)
			.addChoices(
				{ name: 'Rock', value: 'rock' },
				{ name: 'Paper', value: 'paper' },
				{ name: 'Scissors', value: 'scissors' },
			)),

  async execute(interaction) {
    const userChoice = interaction.options.getString('choice').toLowerCase();

    if (!rps.includes(userChoice)) {
      return interaction.reply('Please choose either rock, paper, or scissors');
    }

    const userChoiceIndex = rps.indexOf(userChoice);
    const botChoiceIndex = Math.floor(Math.random() * 3);

    let result;
    if (userChoiceIndex === botChoiceIndex) {
      result = "It's a draw, no one wins";
    } else if (
      (userChoiceIndex === 0 && botChoiceIndex === 2) ||
      (userChoiceIndex === 1 && botChoiceIndex === 0) ||
      (userChoiceIndex === 2 && botChoiceIndex === 1)
    ) {
      result = `${interaction.user.username} Wins!`;
    } else {
      result = `${interaction.client.user.username} Wins!`;
    }

    const embed = {
      title: `${interaction.user.username} vs ${interaction.client.user.username} Rock, Paper, Scissors`,
      fields: [
        { name: `${interaction.user.username}`, value: res[userChoiceIndex], inline: true },
        { name: `${interaction.client.user.username}`, value: res[botChoiceIndex], inline: true },
        { name: 'Results', value: result },
      ],
      footer: {
        text: `Challenged by ${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      },
      timestamp: new Date(),
      color: interaction.guild.members.me.displayHexColor,
    };

    await interaction.reply({ embeds: [embed] });
  },
};
