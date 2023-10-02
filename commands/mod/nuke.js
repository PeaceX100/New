const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'nuke',
  category: 'mod',
  aliases: ['blast','bl','nk'],
  description: 'Nuke a channel',
  execute(client, msg, args) {
    if (!msg.guild.members.me.permissions.has('MANAGE_CHANNELS')) {
      return msg.channel.send("I don't have the necessary permissions.");
    }

    if (!msg.member.permissions.has('MANAGE_CHANNELS')) {
      return msg.channel.send("You don't have permission to use this command.");
    }

    const nukeEmbed = new MessageEmbed({
      description: `**Channel has been nuked By ${msg.author.username}**`,
      image: {
        url: 'https://media.giphy.com/media/HhTXt43pk1I1W/giphy.gif',
      },
      footer: {
        text: msg.guild.name,
        iconURL: msg.guild.iconURL(),
      },
      color: 'RANDOM',
    });

    msg.channel
      .clone()
      .then((newChannel) => {
        newChannel.setParent(msg.channel.parent);
        newChannel.setPosition(msg.channel.position);
        msg.channel.delete().then(() => {
          newChannel.send({ embeds: [nukeEmbed] });
        });
      });
  },
};
