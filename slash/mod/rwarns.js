const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const db = require("old-wio.db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rwarns')
    .setDescription('Reset warnings of mentioned person')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user whose warnings to reset')
        .setRequired(true)
    ),
  async execute(interaction) {
    const member = interaction.options.getMember('user');

    if (!interaction.member.permissions.has("ADMINISTRATOR")) {
      const noPermissionEmbed = new MessageEmbed()
        .setColor('RED')
        .setDescription("You should have admin perms to use this command");
      return interaction.reply({ embeds: [noPermissionEmbed], ephemeral: true });
    }

    if (member.user.bot) {
      const botEmbed = new MessageEmbed()
        .setColor('YELLOW')
        .setDescription("Bots are not allowed to have warnings");
      return interaction.reply({ embeds: [botEmbed], ephemeral: true });
    }

    if (interaction.user.id === member.user.id) {
      const selfResetEmbed = new MessageEmbed()
        .setColor('YELLOW')
        .setDescription("You are not allowed to reset your own warnings");
      return interaction.reply({ embeds: [selfResetEmbed], ephemeral: true });
    }

    let warnings = await db.fetch(`warnings_${interaction.guild.id}_${member.id}`);

    if (warnings === null) {
      const noWarningsEmbed = new MessageEmbed()
        .setColor('GREEN')
        .setDescription(`${member.user.username} does not have any warnings`);
      return interaction.reply({ embeds: [noWarningsEmbed], ephemeral: true });
    }

    await db.delete(`warnings_${interaction.guild.id}_${member.id}`);
    member.send(`Your all warning were resetted by ${interaction.user.username} from ${interaction.guild.name}`);

    const resetSuccessEmbed = new MessageEmbed()
      .setColor('GREEN')
      .setDescription(`Resetted all warnings of ${member.user.username}`);
    return interaction.reply({ embeds: [resetSuccessEmbed], ephemeral: false });
  },
};
