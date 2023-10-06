const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('config-suggestions')
    .setDescription('Configure suggestions channel'),

  async execute(interaction) {
  if (!interaction.memnerPermissions.has('Administrator')) {
    interaction.reply(`You don't have the required permissions to run this command`)
    return;
  }
  },

};
