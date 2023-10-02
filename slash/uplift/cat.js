const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cat')
        .setDescription('Sends a random cat image/gif to up your mood!'),
    async execute(interaction) {

    try {
      const response = await fetch('https://api.thecatapi.com/v1/images/search');
      const data = await response.json();

      if (!data || data.length === 0 || !data[0].url) {
        return interaction.reply("Couldn't fetch a cat image at the moment. Please try again later.");
      }

      const imageUrl = data[0].url;

      const embed = new MessageEmbed({
        title: "🐈 Meow !!! 🐈",
        image: { url: imageUrl },
        footer: { text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) },
        timestamp: new Date(),
        color: "RANDOM",
      });

     await interaction.reply({ embeds: [embed] });
    } catch (error) {
      interaction.reply("An error occurred while fetching the cat image.");
    }
  },
};
0