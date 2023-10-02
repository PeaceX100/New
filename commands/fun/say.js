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
  name: 'say',
  aliases: ['s','bs'],
  category: 'fun',
  description: 'Make the bot say something',
  async execute(client, msg, args) {
    const toSay = args.join(' ');
    const guildMember = await msg.guild.members.fetch(msg.author);
    
    if (!toSay) {
      return msg.channel.send(`You have to provide something, ${msg.author}!`);
    }

    // Check if the user has a higher role than the bot
    if (guildMember.roles.highest.comparePositionTo(msg.guild.members.me.roles.highest) > 0) {
      return msg.channel.send('You have a higher role than the bot, so no timeout for you! 🎉');
    }

    // Check if the message contains mentions
    if (toSay.includes('@everyone') || toSay.includes('@here')) {
      const userMention = `<@${msg.author.id}>`;
      const randomRoast = roasts[Math.floor(Math.random() * roasts.length)];
      const roastedMessage = 'You Tried' + userMention + `\n` + randomRoast + '\n\nEnjoy your 30 seconds of Peace. 🕊️';

      msg.channel.send(roastedMessage);

      // Time out the user for 30 seconds
      await guildMember.timeout(30000, 'They deserve it for pinging everyone');
      return;
    }

    msg.channel.send(toSay);
  },
};
      