const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('binary')
    .setDescription('Converts text into binary code')
    .addStringOption(option =>
		option.setName('text')
			.setDescription('Converts the provided text into binary')),

  async execute(interaction) {
    const text = interaction.options.getString('text');

    if (!text) {
      return interaction.reply('Please provide text to convert into binary.');
    }

    const binaryData = text
      .split('')
      .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
      .join(' ');

    const embed = {
      title: 'Binary Code',
      description: `Binary Conversion: \`${binaryData}\``,
      footer: {
        text: 'Requested by ' + interaction.user.tag,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      },
      color: 'RANDOM',
    };

    await interaction.reply({ embeds: [embed] });
  },
};
                                                           