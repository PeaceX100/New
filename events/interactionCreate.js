const Suggestion = require('../models/Suggestion');

module.exports = {
  name: "interactionCreate",
  once: false,
  async execute(interaction, client) {
    if (interaction.isCommand()) {
      const command = interaction.client.interactions.get(interaction.commandName);
    if (!interaction.isButton() || !interaction.customId) return;
      if (!command) return;

      try {
        await command.execute(interaction, client);
      const [type, suggestionId, action] = interaction.customId.split('.');

    if (!type || !suggestionId || !action) return;
    if (type !== 'suggestion') return;

      await interaction.deferReply({ ephemeral: true });

  const targetSuggestion = await Suggestion.findOne({ suggestionId });
  const targetMessage = await interaction.channel.messages.fetch(targetSuggestion.messageId);
  const targetMessageEmbed = targetMessage.embeds[0];

if (action === 'approve') {
   if (!interaction.memberPermissions.has('Administrator')) {
     await interaction.editReply('You do not have the permission to approve suggestions')
     return;
   }

  targetSuggestion.status('approved');

  targetMessageEmbed.data.color = 0x84e660
  targetMessageEmbed.fields[1].value = '✅ Approved';

  await targetSuggestion.save();

  interaction.editReply('Suggestion approved!');

  targetMessage.edit({
    embeds: [targetMessageEmbed],
    components: [targetMessage.components[0]],
  });

  return;
}

if (action === 'reject') {
   if (!interaction.memberPermissions.has('Administrator')) {
     await interaction.editReply('You do not have the permission to reject suggestions')
     return;
   }

  targetSuggestion.status('rejected');

  targetMessageEmbed.data.color = 0xff6161
  targetMessageEmbed.fields[1].value = '❌ Rejected';

  await targetSuggestion.save();

  interaction.editReply('Suggestion rejected!');

  targetMessage.edit({
    embeds: [targetMessageEmbed],
    components: [targetMessage.components[0]],
  });

  return;
}

      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: "There was an error while executing this command.",
          ephemeral: true,
        });
      }
    }
  },
};
