const { MessageEmbed } = require('discord.js');
const db = require('old-wio.db');
const { prefix } = require('../../config.json');

module.exports = {
  name: 'anonymous',
  category: 'uplift',
  aliases: ['anony','hidden','confess'],
  description: 'Send an anonymous message to the configured channel',
  usage: `${prefix}anonymous [message]`,
  execute(client, msg, args) {
    const message = args.join(' ');
    const anonymousChannelID = db.fetch(`anonymous_${msg.guild.id}`);

    if (!message) {
      return msg.channel.send('Please provide a message to send anonymously.');
    }

    if (!anonymousChannelID) {
      return msg.channel.send('The anonymous channel has not been set up. Please ask an administrator to set it up.');
    }

    const anonymousChannel = msg.guild.channels.cache.get(anonymousChannelID);

    if (!anonymousChannel) {
      return msg.channel.send('The anonymous channel could not be found. Please ask an administrator to reconfigure the anonymous channel.');
    }

    const embed = new MessageEmbed({
      title: 'Anonymous needs help',
      description: `**${message}**`,
      timestamp: new Date(),
      color: 'RANDOM',
    });

    anonymousChannel.send({ embeds: [embed] });
  },
};
        