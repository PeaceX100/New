const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const db = require("old-wio.db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('swarns')
    .setDescription('Get the warnings of yours or a mentioned person')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to check warnings for (optional)')
    ),
  async execute(interaction) {
    const user = interaction.options.getMember('user') || interaction.user;

    if (!interaction.member.permissions.has('BAN_MEMBERS')) {
      return interaction.reply({
        embeds: [
          new MessageEmbed({
            description: "You don't have Moderation perms to use this command",
            footer: {
              text: "BAN_MEMBERS"
            },
            color: "RANDOM"
          })
        ]
      });
    }

    let warnings = db.fetch(`warnings_${interaction.guild.id}_${user.id}`);

    if (warnings === null) {
      warnings = 0;
    }

    return interaction.reply({
      embeds: [
        new MessageEmbed({
          description: `${user} has **${warnings}** warning(s)`,
          color: "RANDOM"
        })
      ]
    });
  },
};
