const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coconutmall')
        .setDescription('Totally Coconut mall someone!')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user you want to Coconut Mall.')
                .setRequired(true)),
    async execute(interaction) {
        const mentionedUser = interaction.options.getMember('user').user;

        // Check if mentionedUser is a bot or the author themselves
        if (mentionedUser.bot || mentionedUser.id === interaction.user.id) {
            await interaction.reply(`You can't coconut mall yourself or a bot <@${interaction.user.id}>!`);
            return;
        }

        const embed = new MessageEmbed({
            title: '**You just got 🥥🌴 Coconut Malled! 🌴🥥**',
            image: { url: 'https://media.tenor.com/ea9gIvewA2oAAAAC/coconut-coconut-malled.gif' },
            footer: {
                text: `**🥥 Coconut Malled by ${interaction.user.tag} 🥥**`,
                iconURL: mentionedUser.displayAvatarURL(),
            },
            timestamp: new Date(),
        });

        await interaction.reply(`${mentionedUser},`);
        await interaction.followUp({ embeds: [embed] });
    },
};
