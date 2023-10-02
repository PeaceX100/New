const { MessageEmbed } = require('discord.js');
const animals = require('random-animals-api');
const { prefix } = require('../../config.json');

module.exports = {
    name: 'animals',
    aliases: ['a','ani'],
    category: 'uplift',
    description: `If you don't like cats and dogs which who doesn't use this command to get random images of some other animals`,
    usage: `${prefix}animals bunny/duck/fox/lizard/shiba`,
    execute(client, msg, args) {
        // Define the available animal types
        const availableAnimalTypes = ['bunny', 'duck', 'fox', 'lizard', 'shiba'];
        
        // Check if an animal type was specified
        const requestedAnimalType = args[0];

        if (!requestedAnimalType) {
            msg.reply('Please specify an animal type (e.g., bunny, duck, fox, lizard, shiba).');
            return;
        }

        // Check if the specified animal type is valid
        if (!availableAnimalTypes.includes(requestedAnimalType)) {
            msg.reply('Invalid animal type. Please choose from: ' + availableAnimalTypes.join(', '));
            return;
        }

        // Fetch a random image of the specified animal type
        animals[requestedAnimalType]()
            .then(url => {
                const embed = new MessageEmbed({
                    title: `Here's a ${requestedAnimalType}!`,
                    image: { url },
                    color: 'RANDOM',
                    footer: {
                        text: `Requested by ${msg.author.tag}`,
                        iconURL: msg.author.displayAvatarURL(),
                    },
                    timestamp: new Date(),
                });

                msg.channel.send({ embeds: [embed] });
            })
            .catch(error => {
                console.error(error);
                msg.reply('An error occurred while fetching the animal image.');
            });
    },
};
                      