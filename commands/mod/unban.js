const { MessageEmbed } = require("discord.js");
const db = require('old-wio.db');

module.exports = {
    name: "unban",
    category: 'mod',
    description: "Unban a user from the guild!",
    usage: "[ID] <reason> (optional)",
    aliases: ["ub", "unbanish"],
    async execute(client, msg, args) {

        if (!msg.member.permissions.has("BAN_MEMBERS")) return msg.channel.send("**You Don't Have The Permissions To Unban Someone! - [BAN_MEMBERS]**");

        if (!args[0]) return msg.channel.send("**Please Enter A User ID!**");

        let reason = args.slice(1).join(" ");

        if (!msg.guild.members.me.permissions.has("BAN_MEMBERS")) return msg.channel.send("**I Don't Have Permissions To Unban Someone! - [BAN_MEMBERS]**");
        try {
            if (reason) {
                msg.guild.members.unban(args[0], reason);
                var sembed = new MessageEmbed({
                    color: "GREEN",
                    description: `**User with ID ${args[0]} has been unbanned for ${reason}**`,
                });
                msg.channel.send({ embeds: [sembed] });
            } else {
                msg.guild.members.unban(args[0], reason);
                var sembed2 = new MessageEmbed({
                    color: "GREEN",
                    description: `**User with ID ${args[0]} has been unbanned**`,
                });
                msg.channel.send({ embeds: [sembed2] });
            }
        } catch {
            
        }

        let channel = db.fetch(`modlog_${msg.guild.id}`);
        if (!channel) return;

        const embed = new MessageEmbed({
            color: "#ff0000",
            author: { name: `${msg.guild.name} Modlogs`, iconURL: msg.guild.iconURL() },
            fields: [
                { name: "**Moderation**", value: "unban" },
                { name: "**Unbanned User ID**", value: args[0] },
                { name: "**Moderator**", value: msg.author.username },
                { name: "**Reason**", value: `${reason}` || "**No Reason**" },
                { name: "**Date**", value: msg.createdAt.toLocaleString() },
            ],
            footer: { text: msg.guild.name, iconURL: msg.guild.iconURL() },
            timestamp: new Date(),
        });

        var sChannel = msg.guild.channels.cache.get(channel);
        if (sChannel) {
            sChannel.send({ embeds: [embed] });
        }
    },
};
