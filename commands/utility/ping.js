const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'ping',
    aliases: ['p'],
    category: 'utility',
    description: 'Shows ping of the bot',
    async execute(client, msg, args) {
        const start = Date.now();

        try {
            const m = await msg.channel.send({ embeds: [{ description: '🔍 I think my ping is high...', color: 'RANDOM' }] });

            const end = Date.now();

            const embed = new MessageEmbed({
                author: {
                    name: 'Pong!',
                    iconURL: msg.author.avatarURL({ dynamic: true })
                },
                fields: [
                    { name: 'API Latency', value: `${Math.round(client.ws.ping)}ms`, inline: true },
                    { name: 'Message Latency', value: `${end - start}ms`, inline: true }
                ],
                color: 'RANDOM'
            });

            await m.edit({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            msg.channel.send('An error occurred while processing the command.');
        }
    },
};
          