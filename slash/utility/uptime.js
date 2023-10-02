const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('uptime')
    .setDescription('Shows Uptime of bot'),

  async execute(interaction) {
    const client = interaction.client;
    const uptime = client.uptime;
    const days = Math.floor(uptime / 86400000);
    const hours = Math.floor(uptime / 3600000) % 24;
    const minutes = Math.floor(uptime / 60000) % 60;
    const seconds = Math.floor(uptime / 1000) % 60;

    const embed = new MessageEmbed()
      .setTitle('Uptime')
      .setColor('RANDOM')
      .setDescription(
        `I am Online for **${days}** days, **${hours}** hours, **${minutes}** minutes, **${seconds}** seconds`
      )
      .setThumbnail(client.user.displayAvatarURL())
      .setFooter({
        text: interaction.guild.name,
        iconURL: interaction.guild.iconURL(),
      })
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.displayAvatarURL(),
      });

    await interaction.reply({ embeds: [embed] });
  },
};
      