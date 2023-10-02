const { MessageEmbed } = require('discord.js');
const math = require('mathjs');

module.exports = {
  name: 'calculate',
  aliases: ['calc', 'calculator'],
  category: 'utility',
  description: "Shows Calculated Answers Of User's Query",
  usage: 'calc [query](mathematical)',

  async execute(client, msg, args) {
    if (!args[0]) {
      return msg.channel.send('**Enter something to calculate**');
    }

    let result;
    try {
      result = math.evaluate(
        args
          .join(' ')
          .replace(/[x]/gi, '*')
          .replace(/[,]/g, '.')
          .replace(/[÷]/gi, '/')
      );
      // Ensure the result is a string
      result = result.toString();
    } catch (e) {
      return msg.channel.send(
        '**Enter a valid calculation!**\n\n**List of Calculations** - \n1. **sqrt equation** - `sqrt(3^2 + 4^2) = 5`\n2. **Units to Units** - `2 inch to cm = 0.58`\n3. **Complex Expressions Like** - `cos(45 deg) = 0.7071067811865476`\n4. **Basic Maths Expressions** - `+, -, ^, /, decimals` = **2.5 - 2 = 0.5**'
      );
    }

    const resultEmbed = new MessageEmbed()
      .setColor('RANDOM')
      .setTitle('Calculator')
      .addFields(
        { name: 'Operation', value: args.join(' '), inline: false },
        { name: 'Result', value: result, inline: false }
      );

    msg.channel.send({ embeds: [resultEmbed] });
  },
};
