const { MessageEmbed } = require('discord.js');
const db = require('old-wio.db');
const { prefix } = require('../../config.json');

module.exports = {
  name: 'setup',
  category: 'admin',
  aliases: ['set', 'su'],
  description: 'Set up modlog or anonymous channel',
  usage: `${prefix}setup modlog/anonymous [channel]`,
  execute(client, msg, args) {
    if (!msg.member.permissions.has('ADMINISTRATOR')) {
      return msg.channel.send("You don't have the required permissions to set up channels.");
    }

    const type = args[0]; // "modlog" or "anonymous"
    const channel = msg.mentions.channels.first();

    if (!type || !channel) {
      return msg.channel.send('Please provide both a type (modlog/anonymous) and mention a valid channel.');
    }

    if (type === 'modlog') {
      // Store the modlog channel ID in the database
      db.set(`modlog_${msg.guild.id}`, channel.id);

      const embed = new MessageEmbed()
        .setTitle('Modlog Channel Setup')
        .setDescription(`Modlog channel set to ${channel}.`)
        .setColor('RANDOM');

      return msg.channel.send({ embeds: [embed] });
    } else if (type === 'anonymous') {
      // Store the anonymous channel ID in the database
      db.set(`anonymous_${msg.guild.id}`, channel.id);

      const embed = new MessageEmbed()
        .setTitle('Anonymous Channel Setup')
        .setDescription(`Anonymous channel set to ${channel}.`)
        .setColor('RANDOM');

      return msg.channel.send({ embeds: [embed] });
    } else {
      return msg.channel.send('Invalid type. Please specify either "modlog" or "anonymous".');
    }
  },
};
        