const { ownerID } = require('../../owner.json') 

module.exports = {
      name: "dm",
      category: 'mod',
      description: "DM a user in the guild",
      aliases: ['directmessage','pm'],
        
    async execute(client, msg, args) {
        
        if(!msg.channel.permissionsFor(msg.member).has("MANAGE_MESSAGES") && !ownerID.includes(msg.author.id)) return;


      let user =
        msg.mentions.members.first() ||
        msg.guild.members.cache.get(args[0]);
      if (!user)
        return msg.channel.send(
          `You did not mention a user, or you gave an invalid id`
        );
      if (!args.slice(1).join(" "))
        return msg.channel.send("You did not specify your message");
      user.user
        .send(args.slice(1).join(" "))
        .catch(() => msg.channel.send("That user could not be DMed!"))
        .then(() => msg.channel.send(`**Sent a message to ${user.user.tag}**`));
    },
};