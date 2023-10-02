const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Set the slowmode for the channel')
    .addStringOption(option =>
      option.setName('time')
        .setDescription('The time for slowmode (e.g., 5s, 10m, 1h)')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('The reason for setting slowmode')
    ),
  async execute(interaction) {
    const member = interaction.member;
    const time = interaction.options.getString('time');
    const reason = interaction.options.getString('reason') || 'no reason';
    const currentCooldown = interaction.channel.rateLimitPerUser;

    if (!member.permissions.has('MANAGE_CHANNELS')) {
      const noPermissionEmbed = new MessageEmbed({
        color: 'RED',
        description: "You don't have permission to use this command. (MANAGE_CHANNELS)"
      });
      return interaction.reply({ embeds: [noPermissionEmbed], ephemeral: true });
    }

    if (time === 'off') {
      if (currentCooldown === 0) {
        const alreadyDisabledEmbed = new MessageEmbed({
          color: 'YELLOW',
          description: "Slowmode is already disabled"
        });
        return interaction.reply({ embeds: [alreadyDisabledEmbed], ephemeral: true });
      }

      await interaction.channel.setRateLimitPerUser(0, reason);

      const disabledEmbed = new MessageEmbed({
        color: 'GREEN',
        description: "Slowmode Disabled"
      }).setFooter({
        text: `#${interaction.channel.name}`
      });

      return interaction.reply({ embeds: [disabledEmbed], ephemeral: false });
    }

    const parsedTime = ms(time) / 1000;

    if (isNaN(parsedTime)) {
      const invalidTimeEmbed = new MessageEmbed({
        color: 'RED',
        description: "Not a valid time, please try again!"
      });
      return interaction.reply({ embeds: [invalidTimeEmbed], ephemeral: true });
    }

    if (parsedTime >= 21600) {
      const highLimitEmbed = new MessageEmbed({
        color: 'RED',
        description: "That slowmode limit is too high, please enter anything lower than 6 hours."
      });
      return interaction.reply({ embeds: [highLimitEmbed], ephemeral: true });
    }

    if (currentCooldown === parsedTime) {
      const alreadySetEmbed = new MessageEmbed({
        color: 'YELLOW',
        description: `Slowmode is already set to ${time}`
      });
      return interaction.reply({ embeds: [alreadySetEmbed], ephemeral: true });
    }

    await interaction.channel.setRateLimitPerUser(parsedTime, reason);

    const enabledEmbed = new MessageEmbed({
      color: 'GREEN',
      description: `Slowmode Enabled\nSlowmode: ${time}\nReason: ${reason}`
    }).setFooter({
      text: `${interaction.guild.iconURL()}, #${interaction.channel.name}`
    });
      
    return interaction.reply({ embeds: [enabledEmbed], ephemeral: false });
  },
};
    