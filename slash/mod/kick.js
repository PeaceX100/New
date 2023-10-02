const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { adminRId } = require('../../config.json');
const db = require('old-wio.db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kicks a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to kick')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('The reason for the kick')),

  async execute(interaction) {
    try {
      // Check if the user has the "Kick Members" permission
      if (!interaction.member.permissions.has('KICK_MEMBERS')) {
        return interaction.reply({ content: ":x: | **You don't have permission to use this command.**", ephemeral: true });
      }

      const user = interaction.options.getUser('user');
      const reason = interaction.options.getString('reason') || 'No reason provided';
      const member = interaction.member;
      const guild = interaction.guild;
      const author = interaction.user;

      const kickMember = guild.members.cache.get(user.id);

      if (!kickMember) return interaction.reply({ content: '**User Is Not In The Guild**', ephemeral: true });
      if (kickMember.id === member.id) return interaction.reply({ content: '**You Cannot Kick Yourself**', ephemeral: true });

      if (kickMember.roles.highest.position >= member.roles.highest.position && author.id !== guild.ownerId) {
        return interaction.reply({ content: ":x: | **You can't kick this member due to your role being lower than that member's role.**", ephemeral: true });
      }


      if (kickMember.kickable) {
        // Check if the user has a DM channel
        let dmChannel = user.dmChannel;
        if (!dmChannel) {
          dmChannel = await user.createDM();
        }

        const sembed2 = new MessageEmbed({
          color: 'RED',
          description: `**You Have Been Kicked From ${guild.name} for - ${reason || 'No Reason!'}**`,
          footer: { text: guild.name, iconURL: guild.iconURL() },
        });

        try {
          await dmChannel.send({ embeds: [sembed2] });
        } catch (error) {
          console.error(`Failed to send DM to ${user.tag}:`, error);
        }

        await kickMember.kick(reason);

        // Respond to the interaction
        const embed = new MessageEmbed({
          color: 'RED',
          title: 'User Kicked',
          description: `**${kickMember.user.tag}** has been kicked from the server.`,
          fields: [
            { name: 'Reason', value: reason || 'No reason provided' },
          ],
          footer: {
            text: `Kicked by ${author.tag}`,
            iconURL: author.displayAvatarURL(),
          },
        });

        interaction.reply({ embeds: [embed], ephemeral: true });

        // Send the modlog embed
        const modlogEmbed = new MessageEmbed({
          author: { name: `${guild.name} Modlogs`, iconURL: guild.iconURL() },
          color: '#ff0000',
          thumbnail: { url: kickMember.user.displayAvatarURL({ dynamic: true }) },
          footer: { text: guild.name, iconURL: guild.iconURL() },
          fields: [
            { name: '**Moderation**', value: 'kick' },
            { name: '**User Kicked**', value: kickMember.user.tag },
            { name: '**Kicked By**', value: author.tag },
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
      } else {
        return interaction.reply({ content: ":x: | **I can't kick this user, make sure that the user's role is lower than my role.**", ephemeral: true });
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
