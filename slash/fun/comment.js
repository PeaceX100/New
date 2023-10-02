const { SlashCommandBuilder } = require('@discordjs/builders');
const canvacord = require('canvacord');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('comment')
    .setDescription('Shows your text as a YouTube Comment')
    .addStringOption(option =>
      option.setName('text')
        .setDescription('The text you want to display as a YouTube comment')
        .setRequired(true)
    ),
  async execute(interaction) {
    const text = interaction.options.getString('text');

    if (!text) {
      return interaction.reply('Please provide something to comment!');
    }

    try {
      const yt = await canvacord.Canvas.youtube({
        avatar: interaction.user.displayAvatarURL({ format: 'png' }),
        username: interaction.user.username,
        content: text,
      });

      interaction.reply({ files: [yt] });
    } catch (error) {
      console.error(error);
      return interaction.reply('Something went wrong while creating the YouTube comment.');
    }
  },
};
