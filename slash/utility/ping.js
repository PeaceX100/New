const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("🏓 Check My Ping 🏓"),

  async execute(interaction) {
    const start = Date.now();

    try {
      await interaction.deferReply({ ephemeral: false });

      const end = Date.now();

      const pingEmbed = {
        title: "Pong!",
        fields: [
          {
            name: "API Latency",
            value: `${Math.round(interaction.client.ws.ping)}ms`,
            inline: true,
          },
          {
            name: "Message Latency",
            value: `${end - start}ms`,
            inline: true,
          },
        ],
        color: "RANDOM",
      };

      await interaction.editReply({ embeds: [pingEmbed] });
    } catch (error) {
      console.error(error);
      await interaction.followUp("An error occurred while processing the command.");
    }
  },
};
            