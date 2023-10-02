const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "inspire",
    aliases: ["insp","i"],
    category: 'uplift',
    description: "Gives Inspirational Quotes",
    execute(client, msg, args) {
        getQuote().then(quote => {
            const embed = new MessageEmbed({
                color: "RANDOM",
                title: "Inspirational Quote",
                description: quote,
                footer: {
                    text: msg.guild.name,
                    iconURL: msg.guild.iconURL()
                },
                author: {
                    name: client.user.username,
                    iconURL: client.user.displayAvatarURL()
                }
            });

            msg.channel.send({ embeds: [embed] });
        });
    },
};

function getQuote() {
    return fetch("https://zenquotes.io/api/random")
        .then(res => res.json())
        .then(data => `${data[0]["q"]} - ${data[0]["a"]}`);
}
