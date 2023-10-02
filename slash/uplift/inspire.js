const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('inspire')
    .setDescription('Get an inspirational quote'),

  async execute(interaction) {
    getQuote().then(quote => {
      const embed = new MessageEmbed({
        color: 'RANDOM',
        title: 'Inspirational Quote',
        description: quote,
        footer: {
          text: interaction.guild.name,
          iconURL: interaction.guild.iconURL(),
        },
        author: {
          name: interaction.client.user.username,
          iconURL: interaction.client.user.displayAvatarURL(),
        },
      });

      interaction.reply({ embeds: [embed] });
    });
  },
};

function getQuote() {
  return fetch('https://zenquotes.io/api/random')
    .then(res => res.json())
    .then(data => `${data[0]['q']} - ${data[0]['a']}`);
          }
        