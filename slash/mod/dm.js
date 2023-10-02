const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dm')
    .setDescription('DM a user in the guild')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to send a DM to')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('message')
        .setDescription('The message to send')
        .setRequired(true)
    ),
  async execute(interaction) {
    // Defer the initial reply to give your bot more time to process
    await interaction.deferReply();

    const user = interaction.options.getMember('user');
    const message = interaction.options.getString('message');

    if (!user || !message) {
      return interaction.editReply('Please provide a valid user and message.');
    }

    if (!interaction.member.permissions.has('MANAGE_MESSAGES') && interaction.user.id !== user.id) {
      return interaction.editReply('You do not have permission to use this command.');
    }

    user.send(message)
      .then(() => interaction.editReply(`Sent a message to ${user.user.tag}`))
      .catch(() => interaction.editReply('Unable to send a message to that user.'));
  },
};