const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const db = require('old-wio.db');
const { adminRId } = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban a user from the guild')
    .addStringOption(option =>
      option.setName('user')
        .setDescription('The user to unban (ID)')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('The reason for the unban (optional)')
    ),
  async execute(interaction) {
    try {
      const userId = interaction.options.getString('user');
      const reason = interaction.options.getString('reason') || 'No reason provided';

      if (!interaction.member.permissions.has('BAN_MEMBERS')) {
        return interaction.reply({ content: "**You Don't Have The Permissions To Unban Someone! - [BAN_MEMBERS]**", ephemeral: true });
      }

      const bannedMembers = await interaction.guild.bans.fetch();
      const bannedMember = bannedMembers.find(ban => ban.user.id === userId);

      if (!bannedMember) {
        return interaction.reply({ content: "**Please Provide a Valid User ID or the User Is Not Banned!**", ephemeral: true });
      }

      if (!interaction.guild.members.me.permissions.has('BAN_MEMBERS')) {
        return interaction.reply({ content: "**I Don't Have Permissions To Unban Someone! - [BAN_MEMBERS]**", ephemeral: true });
      }

      await interaction.guild.members.unban(bannedMember.user.id, reason);

      const embed = new MessageEmbed({
        color: "GREEN",
        description: `**${bannedMember.user.tag} has been unbanned for ${reason}**`,
      });

      interaction.reply({ embeds: [embed], ephemeral: true });

      const channel = db.fetch(`modlog_${interaction.guild.id}`);
      if (channel) {
        const modlogEmbed = new MessageEmbed({
          color: "#ff0000",
          thumbnail: { url: bannedMember.user.displayAvatarURL({ dynamic: true }) },
          author: { name: `${interaction.guild.name} Modlogs`, iconURL: interaction.guild.iconURL() },
          fields: [
            { name: "**Moderation**", value: "unban" },
            { name: "**Unbanned**", value: `${bannedMember.user.username}` },
            { name: "**ID**", value: `${bannedMember.user.id}` },
            { name: "**Moderator**", value: interaction.user.username },
            { name: "**Reason**", value: `${reason}` || "**No Reason**" },
            { name: "**Date**", value: new Date().toLocaleString() },
          ],
          footer: { text: interaction.guild.name, iconURL: interaction.guild.iconURL() },
          timestamp: new Date(),
        });

        const modlogChannel = interaction.guild.channels.cache.get(channel);
        if (modlogChannel) {
          modlogChannel.send({ embeds: [modlogEmbed] });
        }
      }
    } catch (error) {
      console.error(error);
      return interaction.reply({ content: `**${error.message}**`, ephemeral: true });
    }
  },
  permissions: [
    {
      id: adminRId,
      type: 'ROLE',
      permission: true,
    },
  ],
};
