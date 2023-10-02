const { MessageEmbed } = require('discord.js');

module.exports = {
  name: "purge",
  aliases: ["delm","mp"],
  category: "mod",
  description: "Deletes messages from a channel",
  usage: "purge [amount of messages]",
  execute: async (client, msg, args) => {
    // Check if the author has the MANAGE_MESSAGES permission
    if (!msg.member.permissions.has("MANAGE_MESSAGES")) {
      return msg.channel.send("You don't have sufficient permissions to manage messages.");
    }

    // Check if a valid number of messages to delete is provided
    if (isNaN(args[0])) {
      return msg.channel.send('Please provide a valid number of messages to delete.');
    }

    const numToDelete = parseInt(args[0]);

    // Check the range of the number of messages to delete
    if (numToDelete <= 0 || numToDelete > 100) {
      return msg.channel.send("Please provide a number between 1 and 100.");
    }

    try {
      // Bulk delete messages
      const deletedMessages = await msg.channel.bulkDelete(numToDelete);

      // Send a success message and delete it after 5 seconds
      const successEmbed = new MessageEmbed()
        .setColor("GREEN")
        .setDescription(`Successfully deleted ${deletedMessages.size} messages.`);

      const successMsg = await msg.channel.send({ embeds: [successEmbed] });
      setTimeout(() => successMsg.delete(), 5000);
    } catch (error) {
      console.error(error);
      msg.channel.send("You can't bulk delete messages older then 14 days or and error occurred");
    }
  }
};
      