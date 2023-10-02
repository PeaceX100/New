const { MessageEmbed } = require('discord.js');
const db = require("old-wio.db");

module.exports = {
  name: "warn",
  description: "Warn members",
  aliases: ['wrn','advice','adv'],
  category: 'mod',
  usage: "warn <mention member/member id> [reason]",
  aliases: [],
  async execute(client, msg, args) {
    const warnPermErr = new MessageEmbed()
      .setTitle("**User Permission Error!**")
      .setDescription("**Sorry, you don't have permissions to use this! ❌**");

    if (!msg.channel.permissionsFor(msg.member).has('MANAGE_MESSAGES')) {
      return msg.channel.send(warnPermErr);
    }

    const member = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]);
    if (!member) {
      return msg.reply("Please mention a valid member of this server");
    }

    let reason = args.slice(1).join(' ');
    if (!reason) {
      reason = "(No Reason Provided)";
    }

    let warnings = await db.fetch(`warnings_${msg.guild.id}_${member.id}`);

    if (warnings === 3) {
      return msg.channel.send(`${member} already reached their limit with 3 warnings`);
    }

    if (warnings === null) {
      db.set(`warnings_${msg.guild.id}_${member.id}`, 1);

      member.send(`You have been warned by ${msg.author.username} for this reason: ${reason}`)
        .catch(error => msg.channel.send(`Sorry ${msg.author}, I couldn't warn because of: ${error}`));

      // Check if modlog channel exists
      let channel = db.fetch(`modlog_${msg.guild.id}`);
      if (channel) {
        const warnEmbed = new MessageEmbed({
          title: "**__Warn Report__**",
          description: `**<@${member.user.id}> has been warned by <@${msg.author.id}>**`,
          fields: [
            { name: "**Reason:**", value: `\`${reason}\`` },
            { name: "**Action:**", value: `\`Warn\`` },
            { name: "**Moderator:**", value: `${msg.author}` }
          ]
        });

        const modlogChannel = msg.guild.channels.cache.get(channel);
        if (modlogChannel) {
          modlogChannel.send({ embeds: [warnEmbed] });
        }
      }

      const warnSuccessEmbed = new MessageEmbed()
        .setDescription(`**${member.user.tag} has been warned by ${msg.author.tag}**`)
        .setColor("GREEN");

      msg.channel.send({ embeds: [warnSuccessEmbed] }).then(msg => msg.delete({ timeout: 5000 }));
    } else if (warnings !== null) {
      db.add(`warnings_${msg.guild.id}_${member.id}`, 1);

      member.send(`You have been warned by ${msg.author.username} for this reason: ${reason}`)
        .catch(error => msg.channel.send(`Sorry ${msg.author}, I couldn't warn because of: ${error}`));

      // Check if modlog channel exists
      let channel = db.fetch(`modlog_${msg.guild.id}`);
      if (channel) {
        const warnEmbed = new MessageEmbed({
          title: "**__Warn Report__**",
          description: `**<@${member.user.id}> has been warned by <@${msg.author.id}>**`,
          fields: [
            { name: "**Reason:**", value: `\`${reason}\`` },
            { name: "**Action:**", value: `\`Warn\`` },
            { name: "**Moderator:**", value: `${msg.author}` }
          ],
          color: "RANDOM"
        });

        const modlogChannel = msg.guild.channels.cache.get(channel);
        if (modlogChannel) {
          modlogChannel.send({ embeds: [warnEmbed] });
        }
      }

      const ddEmbed = new MessageEmbed()
        .setDescription(`**${member.user.tag} has been warned by ${msg.author.tag}**`)
        .setColor("GREEN");

      msg.channel.send({ embeds: [ddEmbed] }).then(msg => msg.delete({ timeout: 5000 }));
    }
  }
};