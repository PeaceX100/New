const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'uptime',
  aliases: ['up', 'upt'],
  category: 'utility',
  description: 'Shows the uptime of the bot',

  execute(client, msg, args) {
    const uptime = client.uptime;
    const days = Math.floor(uptime / 86400000);
    const hours = Math.floor(uptime / 3600000) % 24;
    const minutes = Math.floor(uptime / 60000) % 60;
    const seconds = Math.floor(uptime / 1000) % 60;

    const embed = new MessageEmbed()
      .setTitle('Uptime')
      .setColor('RANDOM')
      .setDescription(`I am online for **${days}** days, **${hours}** hours, **${minutes}** minutes, **${seconds}** seconds`)
      .setThumbnail(client.user.displayAvatarURL())
      .setFooter({
        text: msg.guild.name,
        iconURL: msg.guild.iconURL(),
      })
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.displayAvatarURL(),
      });

    msg.channel.send({ embeds: [embed] });
  },
};