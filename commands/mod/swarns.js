const { MessageEmbed } = require('discord.js');
const db = require("old-wio.db");

module.exports = {
  name: 'swarns',
  aliases: ['warnings', 'shwarns', 'showwarns'],
  description: 'Get the warnings of yours or a mentioned person',
  category: 'mod',
  execute(client, msg, args) {
    if (!msg.member.permissions.has('BAN_MEMBERS')) {
      return msg.reply({
        embeds: [
          new MessageEmbed({
            description: "You don't have Moderation perms to use this command",
            footer: {
              text: "BAN_MEMBERS"
            },
            color: "RANDOM"
          })
        ]
      });
    }

    const user = msg.mentions.members.first() || msg.author;

    let warnings = db.fetch(`warnings_${msg.guild.id}_${user.id}`);

    if (warnings === null) {
      warnings = 0;
    }

    msg.reply({
      embeds: [
        new MessageEmbed({
          description: `${user} has **${warnings}** warning(s)`,
          color: "RANDOM"
        })
      ]
    });
  },
};