const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Start a simple poll in the server')
    .addStringOption(option =>
      option.setName('question')
        .setDescription('The question for the poll')
        .setRequired(true)
    ),
  async execute(interaction) {
    if (!interaction.member.permissions.has('MANAGE_GUILD')) {
      return interaction.reply({ content: 'You do not have sufficient permissions! (MANAGE_GUILD)', ephemeral: true });
    }

    const question = interaction.options.getString('question');

    const embed = new MessageEmbed({
      color: 'GREEN',
      title: `Poll For ${interaction.guild.name} Server`,
      footer: {
        text: interaction.member.displayName,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      },
      description: question,
    });

    try {
      const sentMsg = await interaction.reply({ embeds: [embed], fetchReply:true });

      await sentMsg.react('✅');
      await sentMsg.react('❌');
    } catch (error) {
      console.error(error);
      return interaction.reply({ content: 'An error occurred while sending the poll message.', ephemeral: true });
    }
  },
};
