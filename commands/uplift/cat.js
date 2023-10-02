const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
const { prefix } = require('../../config.json');

module.exports = {
  name: "cat",
  description: "Sends a random cat image/gif to up your mood!",
  category: "uplift",
  aliases: ["kitten", "kitty", "meow"],
  usage: `${prefix}cat`,

  async execute(client, msg, args) {
    try {
      const response = await fetch('https://api.thecatapi.com/v1/images/search');
      const data = await response.json();

      if (!data || data.length === 0 || !data[0].url) {
        return msg.reply("Couldn't fetch a cat image at the moment. Please try again later.");
      }

      const imageUrl = data[0].url;

      const embed = new MessageEmbed({
        title: "🐈 Meow !!! 🐈",
        image: { url: imageUrl },
        footer: { text: `Requested by ${msg.member.displayName}`, iconURL: msg.author.displayAvatarURL({ dynamic: true }) },
        timestamp: new Date(),
        color: "RANDOM",
      });

      msg.channel.send({ embeds: [embed] });
    } catch (error) {
      msg.reply("An error occurred while fetching the cat image.");
    }
  }
};
        
