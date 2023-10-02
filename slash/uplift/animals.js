const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const animals = require('random-animals-api');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('animals')
    .setDescription('Get a random animal image.')
    .addStringOption(option =>
      option.setName('animal')
        .setDescription('Select an animal')
        .setRequired(true)
        .addChoices(
          { name: 'Bunny', value: 'bunny' },
          { name: 'Duck', value: 'duck' },
          { name: 'Lizard', value: 'lizard' },
          { name: 'Fox', value: 'fox' },
          { name: 'Shiba', value: 'shiba' },
        )),
  async execute(interaction) {
    const selectedAnimal = interaction.options.getString('animal');

    try {
      const url = await animals[selectedAnimal]();

      if (!url) {
        return interaction.reply(`Couldn't fetch a ${selectedAnimal} image at the moment. Please try again later.`);
      }

      const embed = new MessageEmbed({
        title: `Here's a ${selectedAnimal}!`,
        image: { url },
        color: "RANDOM",
      });

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      interaction.reply(`An error occurred while fetching the ${selectedAnimal} image.`);
    }
  },
};
