const { MessageEmbed } = require('discord.js');

module.exports = {
  name: "poll",
  aliases: ["opinion","op"],
  category: "utility",
  description: "Start a simple poll in the server",
  execute: async (client, msg, args) => {
    if (!msg.member.permissions.has('MANAGE_GUILD'))
      return msg.channel.send("**You Do Not Have Sufficient Permissions! - [MANAGE_GUILD]**");

    if (!args[0])
      return msg.channel.send("**Please Enter A Query!**");

    const embed = new MessageEmbed({
      color: "GREEN",
      title: `Poll For ${msg.guild.name} Server`,
      footer: {
        text: msg.member.displayName,
        iconURL: msg.author.displayAvatarURL({ dynamic: true }),
      },
      description: args.join(' '),
    });

    const sentMsg = await msg.channel.send({ embeds: [embed] });

    await sentMsg.react('✅');
    await sentMsg.react('❌');

    msg.delete({ timeout: 1000 });
  }
};
      