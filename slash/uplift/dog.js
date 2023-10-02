const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dog')
        .setDescription('Sends a random dog pic'),
    async execute(interaction) {
       try {
         const res = await fetch('https://dog.ceo/api/breeds/image/random');
        const img = (await res.json()).message;

        const embed = {
            title: '🐕 Dog 🐕',
            image: { url: img },
            footer: {
                text: `Requested by ${interaction.user.tag}`,
                icon_url: interaction.user.displayAvatarURL({ dynamic: true }),
            },
            timestamp: new Date(),
            color: 'RANDOM',
        };

        await interaction.reply({ embeds: [embed] });
       } catch (error) {
      interaction.reply("An error occurred while fetching the dog image.");
       }
    },
};
