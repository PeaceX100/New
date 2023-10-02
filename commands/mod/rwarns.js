const { MessageEmbed } = require('discord.js');
const db = require("old-wio.db");

module.exports = {
  name: "rwarns",
  aliases: ["resetwarns"],
  category: "mod",
  usage: "rwarns <@user>",
  description: "Reset warnings of mentioned person",
  async execute(client, msg, args) {
    if (!msg.member.permissions.has("ADMINISTRATOR")) {
      const noPermissionEmbed = new MessageEmbed()
        .setColor('RED')
        .setDescription("You should have admin perms to use this command");
      return msg.channel.send({ embeds: [noPermissionEmbed] });
    }

    const user = msg.mentions.members.first();

    if (!user) {
      const noUserMentionEmbed = new MessageEmbed()
        .setColor('RED')
        .setDescription("Please mention the person whose warnings you want to reset");
      return msg.channel.send({ embeds: [noUserMentionEmbed] });
    }

    if (msg.mentions.users.first().bot) {
      const botEmbed = new MessageEmbed()
        .setColor('YELLOW')
        .setDescription("Bots are not allowed to have warnings");
      return msg.channel.send({ embeds: [botEmbed] });
    }

    if (msg.author.id === user.id) {
      const selfResetEmbed = new MessageEmbed()
        .setColor('YELLOW')
        .setDescription("You are not allowed to reset your own warnings");
      return msg.channel.send({ embeds: [selfResetEmbed] });
    }

    let warnings = await db.fetch(`warnings_${msg.guild.id}_${user.id}`);

    if (warnings === null) {
      const noWarningsEmbed = new MessageEmbed()
        .setColor('GREEN')
        .setDescription(`${msg.mentions.users.first().username} does not have any warnings`);
      return msg.channel.send({ embeds: [noWarningsEmbed] });
    }

    await db.delete(`warnings_${msg.guild.id}_${user.id}`);
    user.send(`Your all warning were resetted by ${msg.author.username} from ${msg.guild.name}`);

    const resetSuccessEmbed = new MessageEmbed()
      .setColor('GREEN')
      .setDescription(`Resetted all warnings of ${msg.mentions.users.first().username}`);
    return msg.channel.send({ embeds: [resetSuccessEmbed] });
  },
};
