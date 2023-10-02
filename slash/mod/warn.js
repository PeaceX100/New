const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const db = require("old-wio.db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn members')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to warn')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('The reason for the warning')
    ),
  async execute(interaction) {
    const member = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason') || 'No Reason Provided';

    if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
      const noPermissionEmbed = new MessageEmbed()
        .setColor('RED')
        .setDescription("You don't have permission to use this command. (MANAGE_CHANNELS)");
      return interaction.reply({ embeds: [noPermissionEmbed], ephemeral: true });
    }

    let warnings = await db.fetch(`warnings_${interaction.guild.id}_${member.id}`);

    if (warnings === 3) {
      const limitReachedEmbed = new MessageEmbed()
        .setColor('YELLOW')
        .setDescription(`${member} already reached their limit with 3 warnings`);
      return interaction.reply({ embeds: [limitReachedEmbed], ephemeral: true });
    }

    if (warnings === null) {
      db.set(`warnings_${interaction.guild.id}_${member.id}`, 1);

      member.send(`You have been warned by ${interaction.user.username} for this reason: ${reason}`)
        .catch(error => interaction.followUp(`Sorry ${interaction.user}, I couldn't warn because of: ${error}`));

      // Check if modlog channel exists
      let channel = db.fetch(`modlog_${interaction.guild.id}`);
      if (channel) {
        const warnEmbed = new MessageEmbed({
          color: "RANDOM",
          title: "**__Warn Report__**",
          description: `**<@${member.user.id}> has been warned by <@${interaction.user.id}>**`,
          fields: [
            { name: "**Reason:**", value: `\`${reason}\`` },
            { name: "**Action:**", value: `\`Warn\`` },
            { name: "**Moderator:**", value: `${interaction.user}` }
          ]
        });

        const modlogChannel = interaction.guild.channels.cache.get(channel);
        if (modlogChannel) {
          modlogChannel.send({ embeds: [warnEmbed] });
        }
      }

      const warnSuccessEmbed = new MessageEmbed()
        .setDescription(`**${member.user.tag} has been warned by ${interaction.user.tag}**`)
        .setColor("GREEN");

      interaction.reply({ embeds: [warnSuccessEmbed], ephemeral: true });
    } else if (warnings !== null) {
      db.add(`warnings_${interaction.guild.id}_${member.id}`, 1);

      member.send(`You have been warned by ${interaction.user.username} for this reason: ${reason}`)
        .catch(error => interaction.followUp(`Sorry ${interaction.user}, I couldn't warn because of: ${error}`));

      // Check if modlog channel exists
      let channel = db.fetch(`modlog_${interaction.guild.id}`);
      if (channel) {
        const warnEmbed = new MessageEmbed({
          title: "**__Warn Report__**",
          description: `**<@${member.user.id}> has been warned by <@${interaction.user.id}>**`,
          fields: [
            { name: "**Reason:**", value: `\`${reason}\`` },
            { name: "**Action:**", value: `\`Warn\`` },
            { name: "**Moderator:**", value: `${interaction.user}` }
          ],
          color: "RANDOM"
        });

        const modlogChannel = interaction.guild.channels.cache.get(channel);
        if (modlogChannel) {
          modlogChannel.send({ embeds: [warnEmbed] });
        }
      }

      const warnReplyEmbed = new MessageEmbed()
        .setDescription(`**${member.user.tag} has been warned by ${interaction.user.tag}**`)
        .setColor("GREEN");

      interaction.reply({ embeds: [warnReplyEmbed], ephemeral: true });
    }
  },
};
      