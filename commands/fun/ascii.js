const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const figlet = require('figlet');

module.exports = {
    name: "ascii",
    aliases: ['as','asc'],
    category: 'fun',
    description: "Create an ASCII art from text",
    execute(client, msg, args) {
        if (!args[0]) return msg.channel.send('Please provide some text');

        const text = args.join(" ");
      
        figlet.text(text, function (err, data) {
            if (err) {
                console.log('Something went wrong');
                console.dir(err);
            } else {
                if (data.length > 2000) {
                    message.channel.send('Please provide text shorter than 2000 characters');
                } else {
                    const asciiEmbed = new MessageEmbed({
                        title: "ASCII Art",
                        description: '```' + data + '```',
                        color: "RANDOM"
                    });

                    msg.channel.send({ embeds: [asciiEmbed] });
                }
            }
        });
    },
};
