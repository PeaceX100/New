const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nuke')
    .setDescription('Nuke a channel'),

  async execute(interaction) {
    const member = interaction.member;
    const channel = interaction.channel;
    const guild = interaction.guild;

    if (!member.permissions.has('MANAGE_CHANNELS')) {
      return interaction.reply({ content: "You don't have the necessary permissions to use this command.", ephemeral: true });
    }

    if (!channel.permissionsFor(member).has('MANAGE_CHANNELS')) {
      return interaction.reply({ content: "You don't have the necessary permissions to use this command.", ephemeral: true });
    }
    const executorTag = interaction.user.username;
    const nukeEmbed = new MessageEmbed({
      description: `**Channel has been nuked By ${executorTag}**`,
      image: {
        url: 'https://media.giphy.com/media/HhTXt43pk1I1W/giphy.gif',
      },
      footer: {
        text: guild.name,
        iconURL: guild.iconURL(),
      },
      color: 'RANDOM',
    });
    // Clone the channel
    channel.clone().then((newChannel) => {
      newChannel.setParent(channel.parent);
      newChannel.setPosition(channel.position);
      newChannel.send({ embeds: [nukeEmbed] });
      channel.delete();
    });
  },
};
