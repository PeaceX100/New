const { MessageEmbed } = require('discord.js');
const { prefix } = require('../../config.json');

module.exports = {
    name: 'coconutmall',
    aliases: ['ccmall', 'cmall'],
    category: 'fun',
    description: 'Totally Coconut mall someone!',
    usage: `${prefix}coconutmall [USER]`,
    execute(client, msg, args) {
        // Check if a user was mentioned
        const mentionedUser = msg.mentions.users.first();

        // Check if mentionedUser is a bot or the author themselves
        if (!mentionedUser || mentionedUser.bot || mentionedUser.id === msg.author.id) {
            msg.channel.send(`You can't coconut mall yourself,a bot or mention no one <@${msg.author.id}>!`);
            return;
        }

        // Create the embed
        const embed = new MessageEmbed({
            title: '**You just got 🥥🌴 Coconut Malled! 🌴🥥**',
            image: { url: 'https://media.tenor.com/ea9gIvewA2oAAAAC/coconut-coconut-malled.gif' },
            footer: {
                text: `🥥 Coconut Malled by ${msg.author.tag} 🥥`,
                iconURL: mentionedUser.displayAvatarURL(),
            },
            timestamp: new Date(),
        });

        // Send a message mentioning the user followed by the embed (if a valid user is mentioned)
        msg.channel.send(`${mentionedUser},`);
        msg.channel.send({ embeds: [embed] });
    },
};
