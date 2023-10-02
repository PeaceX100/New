const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { adminRId } = require('../../config.json');
const db = require('old-wio.db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bans a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to ban')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('The reason for the ban')),
  
  async execute(interaction) {
    try {
      // Check if the user has the "Ban Members" permission or is the owner
      if (!interaction.member.permissions.has('BAN_MEMBERS') && interaction.user.id !== interaction.guild.ownerId) {
        return interaction.reply({ content: ":x: | **You don't have permission to use this command.**", ephemeral: true });
      }

      const user = interaction.options.getUser('user');
      const reason = interaction.options.getString('reason') || 'No reason provided';
      const member = interaction.member;
      const guild = interaction.guild;
      const author = interaction.user;

      const banMember = guild.members.cache.get(user.id);

      if (!banMember) return interaction.reply({ content: '**User Is Not In The Guild**', ephemeral: true });
      if (banMember.id === member.id) return interaction.reply({ content: '**You Cannot Ban Yourself**', ephemeral: true });

      if (!banMember.bannable) {
        return interaction.reply({ content: '**Can\'t Ban That User**', ephemeral: true });
      }
      
      // Check if the user has a DM channel
      let dmChannel = user.dmChannel;
      if (!dmChannel) {
        dmChannel = await user.createDM();
      }

      const sembed = new MessageEmbed({
        color: 'RED',
        title: 'You have been banned',
        description: `You have been banned from ${guild.name} for the following reason: ${reason}`,
      });

      try {
        await dmChannel.send({ embeds: [sembed] });
      } catch (error) {
        console.error(`Failed to send DM to ${user.tag}:`, error);
      }

      await guild.members.ban(user, { reason });

      // Respond to the interaction
      const embed = new MessageEmbed({
        color: 'RED',
        title: 'User Banned',
        description: `**${user.tag}** has been banned from the server.`,
        fields: [
          { name: 'Reason', value: reason || 'No reason provided' },
        ],
        footer: {
          text: `Banned by ${author.tag}`,
          iconURL: author.displayAvatarURL(),
        },
      });

      interaction.reply({ embeds: [embed], ephemeral: true });

      // Send the modlog embed
      const modlogEmbed = new MessageEmbed({
        author: { name: `${guild.name} Modlogs`, iconURL: guild.iconURL() },
        color: '#ff0000',
        thumbnail: { url: user.displayAvatarURL({ dynamic: true }) },
        footer: { text: guild.name, iconURL: guild.iconURL() },
        fields: [
          { name: '**Moderation**', value: 'ban' },
          { name: '**Banned**', value: user.tag },
          { name: '**ID**', value: user.id},
          { name: '**Banned By**', value: author.tag },
          { name: '**Reason**', value: reason },
          { name: '**Date**', value: new Date().toLocaleString() },
        ],
        timestamp: new Date(),
      });

      const channel = db.fetch(`modlog_${guild.id}`);
      if (channel) {
        const modlogChannel = guild.channels.cache.get(channel);
        if (modlogChannel) {
          modlogChannel.send({ embeds: [modlogEmbed] });
        }
      }
    } catch (e) {
      console.error(e);
      return interaction.reply({ content: `**${e.message}**`, ephemeral: true });
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
