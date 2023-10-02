const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'coinflip',
    aliases: ['cf','flip','ht'],
    category: 'fun',
    description: 'Flips a coin.',
    execute(client, msg) {
        const side = Math.random() > 0.5 ? 'Heads' : 'Tails';
        const result = side; // Set result based on the coin flip side
        
        const embed = new MessageEmbed({
            color: 'GREEN',
            title: 'Coin Flip',
            description: `**${msg.member.displayName} Flipped ${result}**!`,
            footer: {
                text: `Flipped by ${msg.author.tag}`,
                iconURL: msg.author.displayAvatarURL()
            },
            timestamp: new Date()
        });

        msg.channel.send({ embeds: [embed] });
    },
};
                              