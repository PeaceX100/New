const { MessageEmbed } = require('discord.js');
const rps = ['scissors', 'rock', 'paper'];
const res = [`Scissors ✂️`, `Rock 🗿`, `Paper 🗞️`];

module.exports = {
    name: "rps",
    aliases: ['rock','paper','scissors'],
    category: 'fun',
    description: "Plays rock paper scissor with the doggo !!",
    usage: "rps (rock/paper/scissors)",
    execute(client, msg, args) {
        let userChoice;
        if (args.length) userChoice = args[0].toLowerCase();
        if (!rps.includes(userChoice))
            return msg.channel.send('Please enter rock, paper, or scissors');
        userChoice = rps.indexOf(userChoice);

        const botChoice = Math.floor(Math.random() * 3);
        let result;

        if (userChoice === botChoice) result = 'It\'s a draw, no one wins';
        else if ((userChoice === 0 && botChoice === 2) || (userChoice === 1 && botChoice === 0) || (userChoice === 2 && botChoice === 1))
            result = `**${msg.member.displayName}** Wins!`;
        else result = `**${client.user.username}** Wins!`;

        const embed = new MessageEmbed({
            title: `${msg.member.displayName} vs ${client.user.username} **RPS**`,
            fields: [
                { name: `${msg.member.displayName}`, value: res[userChoice], inline: true },
                { name: `${client.user.username}`, value: res[botChoice], inline: true },
                { name: 'Results', value: result }
            ],
            footer: {
                text: `Challenged by ${msg.member.displayName}`,
                iconURL: msg.author.displayAvatarURL({ dynamic: true })
            },
            timestamp: new Date(),
            color: msg.guild.members.me.displayHexColor
        });

        msg.channel.send({ embeds: [embed] });
    },
};
          