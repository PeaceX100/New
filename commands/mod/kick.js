const { MessageEmbed } = require('discord.js');
const db = require('old-wio.db');

module.exports = {
  name: 'kick',
  description: 'Kicks the user',
  aliases: ['ki','r','remove'],
  category: 'mod',
  usage: '[name | nickname | mention | ID] <reason> (optional)',
  accessableby: 'Administrator',
  async execute(client, msg, args) {
    try {
      if (!msg.member.permissions.has('KICK_MEMBERS'))
        return msg.channel.send('**You Do Not Have Permissions To Kick Members! - [KICK_MEMBERS]**');
      if (!msg.guild.members.me.permissions.has('KICK_MEMBERS'))
        return msg.channel.send('**I Do Not Have Permissions To Kick Members! - [KICK_MEMBERS]**');

      if (!args[0]) return msg.channel.send('**Enter A User To Kick!**');

      let reason = args.slice(1).join(' ');

      const kickMember =
        msg.mentions.members.first() ||
        msg.guild.members.cache.get(args[0]) ||
        msg.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) ||
        msg.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase());
      if (!kickMember) return msg.channel.send('**User Is Not In The Guild!**');

      if (kickMember.id === msg.member.id)
        return msg.channel.send('**You Cannot Kick Yourself!**');

      if (kickMember.roles.highest.position >= msg.member.roles.highest.position && msg.author.id !== msg.guild.owner.id) {
        return msg.channel.send(":x: | **You can't kick this member due to your role being lower than that member role.**");
      }

      if (kickMember.kickable) {
        const sembed2 = new MessageEmbed({
          color: 'RED',
          description: `**You Have Been Kicked From ${msg.guild.name} for - ${reason || 'No Reason!'}**`,
          footer: { text: msg.guild.name, iconURL: msg.guild.iconURL() },
        });

        // Attempt to send a DM to the user
        try {
          await kickMember.send({ embeds: [sembed2] });
        } catch (error) {
          console.error(`Failed to send DM to ${kickMember.user.tag}:`, error);
          msg.channel.send(`**Failed to send DM to ${kickMember.user.tag}. They may have DMs disabled or have blocked the bot.**`);
        }

        // Kick the user
        await kickMember.kick();
      } else {
        return msg.channel.send(":x: | **I can't kick this user, make sure that the user's role is lower than my role.**");
      }

      if (reason) {
        const sembed = new MessageEmbed({
          color: 'GREEN',
          description: `**${kickMember.user.username}** has been kicked for ${reason}`,
        });
        msg.channel.send({ embeds: [sembed] });
      } else {
        const sembed2 = new MessageEmbed({
          color: 'GREEN',
          description: `**${kickMember.user.username}** has been kicked`,
        });
        msg.channel.send({ embeds: [sembed2] });
      }

      let channel = db.fetch(`modlog_${msg.guild.id}`);
      if (channel) {
        const embed = new MessageEmbed({
          author: { name: `${msg.guild.name} Modlogs`, iconURL: msg.guild.iconURL() },
          color: '#ff0000',
          thumbnail: { url: kickMember.user.displayAvatarURL({ dynamic: true }) },
          footer: { text: msg.guild.name, iconURL: msg.guild.iconURL() },
          fields: [
            { name: '**Moderation**', value: 'kick' },
            { name: '**User Kicked**', value: kickMember.user.username },
            { name: '**Kicked By**', value: msg.author.username },
            { name: '**Reason**', value: `${reason || '**No Reason**'}` },
            { name: '**Date**', value: msg.createdAt.toLocaleString() },
          ],
          timestamp: new Date(),
        });

        const sChannel = msg.guild.channels.cache.get(channel);
        if (sChannel) {
          sChannel.send({ embeds: [embed] });
        }
      }
    } catch (e) {
      return msg.channel.send(`**${e.message}**`);
    }
  },
};
