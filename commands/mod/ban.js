const { MessageEmbed } = require('discord.js');
const db = require('old-wio.db');
const { ownerID } = require('../../owner.json');

module.exports = {
  name: 'ban',
  category: 'mod',
  aliases: ['b', 'banish'],
  description: 'Bans the user',
  usage: '[name | nickname | mention | ID] <reason> (optional)',
  async execute(client, msg, args) {
    try {
      if (!msg.member.permissions.has('BAN_MEMBERS') && !ownerID.includes(msg.author.id))
        return msg.channel.send("**You Don't Have Permissions To Ban Users! - [BAN_MEMBERS]**");
      if (!msg.guild.members.me.permissions.has('BAN_MEMBERS'))
        return msg.channel.send("**I Don't Have Permissions To Ban Users! - [BAN_MEMBERS]**");
      if (!args[0]) return msg.channel.send('**Please Provide A User To Ban!**');

      let banMember =
        msg.mentions.members.first() ||
        msg.guild.members.cache.get(args[0]) ||
        msg.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) ||
        msg.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase());
      if (!banMember) return msg.channel.send('**User Is Not In The Guild**');
      if (banMember === msg.member) return msg.channel.send('**You Cannot Ban Yourself**');

      var reason = args.slice(1).join(' ');

      if (!banMember.bannable) return msg.channel.send('**Can\'t Kick That User**');
      try {
        // Check if the user has a DM channel
        let dmChannel = banMember.user.dmChannel;
        if (!dmChannel) {
          dmChannel = await banMember.user.createDM();
        }

        const sembed = new MessageEmbed({
          color: 'RED',
          title: 'You have been banned',
          description: `You have been banned from ${msg.guild.name} for the following reason: ${reason || "No Reason"}`,
        });

        await dmChannel.send({ embeds: [sembed] });
        msg.guild.members.ban(banMember, { reason });
      } catch {
        msg.guild.members.ban(banMember, { reason });
      }
      if (reason) {
        var sembed = new MessageEmbed({
          color: 'GREEN',
          description: `**${banMember.user.username}** has been banned for ${reason}`,
        });
        msg.channel.send({ embeds: [sembed] });
      } else {
        var sembed2 = new MessageEmbed({
          color: 'GREEN',
          description: `**${banMember.user.username}** has been banned`,
        });
        msg.channel.send({ embeds: [sembed2] });
      }
      let channel = db.fetch(`modlog_${msg.guild.id}`);
      if (channel == null) return;

      if (channel) {
        const embed = new MessageEmbed({
          author: { name: `${msg.guild.name} Modlogs`, iconURL: msg.guild.iconURL() },
          color: '#ff0000',
          thumbnail: { url: banMember.user.displayAvatarURL({ dynamic: true }) },
          footer: { text: msg.guild.name, iconURL: msg.guild.iconURL() },
          fields: [
            { name: '**Moderation**', value: 'ban' },
            { name: '**Banned**', value: banMember.user.username },
            { name: '**ID**', value: `${banMember.id}` },
            { name: '**Banned By**', value: msg.author.username },
            { name: '**Reason**', value: `${reason || '**No Reason**'}` },
            { name: '**Date**', value: msg.createdAt.toLocaleString() },
          ],
          timestamp: new Date(),
        });

        var sChannel = msg.guild.channels.cache.get(channel);
        if (sChannel) {
          sChannel.send({ embeds: [embed] });
        }
      }
    } catch (e) {
      return msg.channel.send(`**${e.message}**`);
    }
  },
};
