const Discord = require('discord.js');
const fetch = require('node-fetch');
const { prefix } = require('../../config.json');

module.exports = {
  name: "dog",
  aliases: ["doggy", "doggo", "puppy","dg"],
  category: "uplift",
  description: "Sends a random dog pic to up your mood!",
  usage: `${prefix}dog`,

  async execute(client, msg, args) {
    try {
      const res = await fetch('https://dog.ceo/api/breeds/image/random');
    const img = (await res.json()).message;

    if (!img) {
      return msg.reply("Couldn't fetch a dog image at the moment. Please try again later.");
    }

    const embed = new Discord.MessageEmbed({
      title: "🐕 Dog 🐕",
      image: { url: img },
      footer: { text: `Requested by ${msg.member.displayName}`, iconURL: msg.author.displayAvatarURL({ dynamic: true }) },
      timestamp: new Date(),
      color: "RANDOM",
    });

    msg.channel.send({ embeds: [embed] })
    } catch (error) {
      msg.reply("An error occurred while fetching the dog image.");
  }
 }
};