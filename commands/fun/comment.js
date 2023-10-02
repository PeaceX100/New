const { MessageAttachment } = require('discord.js');
const canvacord = require('canvacord');
const emotes = require("../../emotes.json");

module.exports = {
    name: 'comment',
    aliases: ['com','cmt','cm'],
    category: 'images',
    description: 'Shows your text as a YouTube Comment',
    usage: 'comment [Your Comment]',
    async execute(client, msg, args) {
        const comment = args.join(' ');

        if (!comment) {
            const errorEmbed = new MessageEmbed()
                .setDescription(`${emotes.error} Provide something to Comment!`)
                .setColor("RED");
            return msg.channel.send({ embeds: [errorEmbed] });
        }

        try {
            const yt = await canvacord.Canvas.youtube({
                avatar: msg.author.displayAvatarURL({ format: "png" }),
                username: msg.author.username,
                content: comment
            });

            msg.channel.send({ files: [yt] });
        } catch (err) {
            const errorEmbed = new MessageEmbed()
                .setTitle(`${emotes.error} Something went wrong.\n${emotes.error} Note: It won't work if the User contains unwanted characters in their Username.`)
                .setColor("RED");

            msg.channel.send({ embeds: [errorEmbed] });
        }
    },
};
