const { MessageEmbed } = require('discord.js');

module.exports = {
  name: '8ball',
  aliases: ['8b', 'magicball', 'mb'],
  category: 'fun',
  description: 'There is a big chance I insult you!',
  execute(client, msg, args) {
    const question = args.join(' ');

    if (!question) {
      return msg.channel.send('You did not specify your question!');
    }

    const responses = [
      'It is certain.',
      'It is decidedly so.',
      'Without a doubt.',
      'Yes - definitely.',
      'You may rely on it.',
      'As I see it, yes.',
      'Most likely.',
      'Outlook good.',
      'Yes.',
      'Signs point to yes.',
      'Reply hazy, try again.',
      'Ask again later.',
      'Better not tell you now.',
      'Cannot predict now.',
      'Concentrate and ask again.',
      "Don't count on it.",
      'My reply is no.',
      'My sources say no.',
      'Outlook not so good.',
      'Very doubtful.'
    ];

    const response = responses[Math.floor(Math.random() * responses.length)];

    const embed = new MessageEmbed()
      .setTitle('🎱 **Magic 8-Ball!**')
      .setDescription(`**Your Question:** ${question}\n**My Reply:** ${response}`)
      .setColor('RANDOM');

    msg.channel.send({ embeds: [embed] });
  },
};
      