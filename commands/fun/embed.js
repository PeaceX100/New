const { MessageEmbed } = require('discord.js');
const { prefix } = require('../../config.json');

module.exports = {
  name: 'embed',
  aliases: ['emb', 'em', 'fancy'],
  category: 'fun',
  description: 'Create an embed with a title and description',
  usage: `${prefix}embed <title> <description>`,
  execute(client, msg, args) {
    if (args.length < 2) {
      return msg.reply(`Usage: ${prefix}embed <title> <description>`);
    }

    const title = args.shift();
    const description = args.join(' ');

    if (!title || !description) {
      return msg.reply(`Usage: ${prefix}embed <title> <description>`);
    }

    const embed = new MessageEmbed()
      .setTitle(title)
      .setDescription(description)
      .setColor('RANDOM');

    msg.reply({ embeds: [embed] });
  },
};
      