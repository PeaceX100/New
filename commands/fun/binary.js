module.exports = {
  name: 'binary',
  aliases: ['bi', '01'],
  category: 'fun',
  description: 'Converts text into binary code',
  usage: '<text>',
  execute(client, msg, args) {
    if (args.length === 0) {
      return msg.channel.send('Please provide text to convert into binary.');
    }

    const text = args.join(' ');
    const binaryData = text
      .split('')
      .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
      .join(' ');

    const embed = {
      title: 'Binary Conversion',
      description: `Binary Code: \`${binaryData}\``,
      footer: {
        text: 'Requested by ' + msg.author.tag,
        iconURL: msg.author.displayAvatarURL({ dynamic: true }),
      },
      color: 'RANDOM',
    };

    msg.channel.send({ embeds: [embed] });
  },
};
      