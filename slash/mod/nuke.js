const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nuke')
    .setDescription('Nuke a channel'),
  async execute(interaction) {
    if (!interaction.guild.members.cache.get(interaction.client.user.id).permissions.has('MANAGE_CHANNELS')) {
      return interaction.reply("I don't have the necessary permissions.");
    }

    if (!interaction.member.permissions.has('MANAGE_CHANNELS')) {
      return interaction.reply("You don't have permission to use this command.");
    }

    const nukeEmbed = new MessageEmbed({
      description: `**Channel has been nuked By ${interaction.user.username}**`,
      image: {
        url: 'https://media.giphy.com/media/HhTXt43pk1I1W/giphy.gif',
      },
      footer: {
        text: interaction.guild.name,
        iconURL: interaction.guild.iconURL(),
      },
      color: 'RANDOM',
    });

    interaction.channel
      .clone()
      .then((newChannel) => {
        newChannel.setParent(interaction.channel.parent);
        newChannel.setPosition(interaction.channel.position);
        interaction.channel.delete().then(() => {
          newChannel.send({ embeds: [nukeEmbed] });
        });
      });
  },
};
            