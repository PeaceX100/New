const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

// Create an array of roasts
const roasts = [
  "Ah, the brave summoner of chaos! You've just earned your 'Master of Notifications' badge for today! 🎖️🚀", 
  "Calling all astronauts, we've got a 'Houston, we have a problem' moment with our 'everyone' ping enthusiast! 🌌🚀", 
  "Someone's trying to start a virtual flash mob with 'everyone'! Remember, dancing shoes are required on this channel. 💃🕺", 
  "When you ping 'everyone,' it's like yelling in a library - everyone turns to glare, and the librarian is not pleased! 📚🤫", 
  "A round of applause for our notification maestro, trying to conduct the grand symphony of pings! 🎵👏", 
  "Next time you try to ping 'everyone,' don't forget to bring enough pizza for the whole server! 🍕😄", 
  "In the kingdom of pings, you're the royal herald! But beware, the spam dragon lurks nearby. 🐉👑", 
  "Congratulations! You've unlocked the 'Ping Enthusiast' achievement. Collect them all for maximum chaos! 🏆🔊", 
  "Breaking news: 'Everyone' summoner attempts world record for most eye rolls in a single ping! 🌍🙄", 
  "Channel Olympics: The 'everyone' ping event is not for the faint of heart. Keep practicing those reflexes! 🏅🏹", 
  "Oh, I see we have an aspiring conductor in the house, attempting to organize a symphony of chaos with an 'everyone' mention! 🎶🪣 Just remember, next time you want to summon the masses, use the 'force' wisely, young maestro! 😉🪄🎵"
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Make the bot say something')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('The message you want the bot to say')
        .setRequired(true)
    ),
  async execute(interaction) {
    const message = interaction.options.getString('message');
    const guildMember = await interaction.guild.members.fetch(interaction.user);

    if (!message) {
      return interaction.reply('You have to provide something!');
    }

    // Check if the message contains mentions
    if (message.includes('@everyone') || message.includes('@here')) {
      const userMention = `<@${interaction.user.id}>`;
      const randomRoast = roasts[Math.floor(Math.random() * roasts.length)];

      // Check if the user has a higher role than the bot
      if (guildMember.roles.highest.comparePositionTo(interaction.guild.members.me.roles.highest) > 0) {
        // User has a higher role, don't apply a timeout
        interaction.reply( 'You Tried' + userMention + `\n` + randomRoast + '\n\nYou have a higher role than the bot, so no timeout for you! 🎉');
      } else {
        // User doesn't have a higher role, apply a timeout
        interaction.reply(userMention + `\n` + randomRoast + '\n\nEnjoy your 30 seconds of Peace. 🕊️');
        // Time out the user for 30 seconds
        await guildMember.timeout(30000, 'They deserve it for pinging everyone');
      }

      return;
    }

    interaction.reply(message);
  },
};
    