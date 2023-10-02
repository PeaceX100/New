const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');
const db = require('old-wio.db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Set up or remove the modlog or anonymous channels')
    .addSubcommand(subcommand =>
      subcommand
        .setName('set')
        .setDescription('Set up a channel')
        .addStringOption(option =>
          option
            .setName('type')
            .setDescription('Select the type (modlog or anonymous)')
            .setRequired(true)
            .addChoices(
              { name: 'Modlog', value: 'modlog' },
              { name: 'Anonymous', value: 'anonymous' },
            )
        )
        .addChannelOption(option =>
          option
            .setName('channel')
            .setDescription('Select the channel')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('Remove a channel')
        .addStringOption(option =>
          option
            .setName('type')
            .setDescription('Select the type (modlog or anonymous)')
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    const isAdmin = interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR);
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'set') {
      const channel = interaction.options.getChannel('channel');
      const type = interaction.options.getString('type');

      if (!channel) {
        return interaction.reply({ content: 'Please select a valid channel.', ephemeral: true });
      }

      if (!isAdmin) {
        return interaction.reply({ content: 'Only administrators can use this command.', ephemeral: true });
      }

      if (channel.type === 'GUILD_TEXT') {
        if (type === 'modlog') {
          db.set(`modlog_${interaction.guild.id}`, channel.id);
          const embed = new MessageEmbed({
            color: 'GREEN',
            title: 'Modlog Channel Setup',
            description: `Modlog channel set to ${channel}`,
            footer: {
              text: interaction.guild.name,
              iconURL: interaction.guild.iconURL(),
            },
          });
          return interaction.reply({ embeds: [embed] });
        } else if (type === 'anonymous') {
          db.set(`anonymous_${interaction.guild.id}`, channel.id);
          const embed = new MessageEmbed({
            color: 'GREEN',
            title: 'Anonymous Channel Setup',
            description: `Anonymous channel set to ${channel}`,
            footer: {
              text: interaction.guild.name,
              iconURL: interaction.guild.iconURL(),
            },
          });
          return interaction.reply({ embeds: [embed] });
        } else {
          return interaction.reply({ content: 'Invalid type. Please specify either "Modlog" or "Anonymous".', ephemeral: true });
        }
      } else {
        return interaction.reply({ content: 'Please select a valid text channel.', ephemeral: true });
      }
    } else if (subcommand === 'remove') {
      const type = interaction.options.getString('type');

      if (!isAdmin) {
        return interaction.reply({ content: 'Only administrators can use this command.', ephemeral: true });
      }

      if (type === 'modlog') {
        db.delete(`modlog_${interaction.guild.id}`);
        return interaction.reply('Modlog channel removed.');
      } else if (type === 'anonymous') {
        db.delete(`anonymous_${interaction.guild.id}`);
        return interaction.reply('Anonymous channel removed.');
      } else {
        return interaction.reply({ content: 'Invalid type. Please specify either "Modlog" or "Anonymous".', ephemeral: true });
      }
    }
  },
};
                   