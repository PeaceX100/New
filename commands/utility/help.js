const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports = {
  name: 'help',
  aliases: ['h', 'hlp'],
  category: 'utility',
  description: 'Shows all available bot commands',
  execute(client, msg) {
    const row = new MessageActionRow(),
      options = client.category.map((v) => {
        return {
          label: `${v.replace(v.charAt(0), v.charAt(0).toUpperCase())}`,
          value: v,
        };
      });

    let used = false;

    row.addComponents({
      type: 'SELECT_MENU',
      customId: 'select',
      placeholder: 'Choose a Category',
      options,
    });

    msg
      .reply({
        embeds: [
          {
            title: `**${client.user.username}'s Help 📋 Menu**`,
            description: `**Hello, ${msg.author.username}! I'm Efficient, Multi-purpose Bot for Enhanced Relations AKA ${client.user.username}, your trusty bot sidekick. 🤖\n\nI'm here to make your Discord server a place of fun and order. Here's what I can do for you:\n\n🔨 **Moderation & Admin Commands:** Keeping the peace and maintaining order is a breeze with these commands! ✋🚔\n\n👢 **Kick, Ban & Warn Members:** Maintain order with the ability to remove troublemakers and issue warnings. ⚖️🚫\n\n🔒 **Lock & Unlock Channels:** Control who can access your channels. 🚪🔐\n\n🎮 **Games:** Let's play! I've got fun games to keep everyone entertained. 🎲🎮\n\n😂 **Fun Commands:** We all need a good laugh! Explore my fun commands to add humor to your server. 😄🎉\n\n💬 **Uplifting Commands:** Lift spirits and spread positivity with uplifting commands. 🌟\n\n🛠️ **Utility:** Need some help with tasks? I've got utility commands to assist you. 🧰💼\n\nJoin me on this adventure, and together, we'll create an amazing Discord experience! ✨**`,
            color: 'RANDOM',
          },
        ],
        components: [row],
      })
      .then((sentMsg) => {
        const filter = (interaction) =>
          interaction.customId === 'select' && interaction.user.id === msg.author.id;

        const collector = sentMsg.createMessageComponentCollector({
          filter,
          time: 60000, // Increased to 60 seconds timeout
        });

        collector.on('collect', async (interaction) => {
          used = true;
          const cat = interaction.values[0];
          const commandsInCategory = client.commands.filter((v) => v.category === cat);
          const commandNames = commandsInCategory.map(
            (v) => `**${v.name.charAt(0).toUpperCase()}${v.name.slice(1)}**`
          );
          const commandList = commandNames.join(', ');

          row.components[0].options = client.commands
            .filter((v) => v.category === cat)
            .map((c) => {
              let v = c.name;
              return {
                label: v.replace(v.charAt(0), v.charAt(0).toUpperCase()),
                value: v,
              };
            });
          row.components[0].placeholder = 'Choose a Command';

          sentMsg.edit({
            embeds: [
              {
                title: `**${cat
                    ? cat.replace(cat.charAt(0), cat.charAt(0).toUpperCase())
                    : `**${client.user.username}`
                  }'s Commands 📄 List**`,
                description: commandList,
                color: 'RANDOM',
              },
            ],
            components: [row],
          });

          const filter2 = (interaction2) =>
            interaction2.customId === 'select' && interaction2.user.id === msg.author.id;

          const collector2 = sentMsg.createMessageComponentCollector({
            filter: filter2,
            time: 60000, // Increased to 60 seconds timeout
          });

          collector2.on('collect', (interaction2) => {
            const cmd = client.commands.get(interaction2.values[0]);
            fields = cmd.options?.map((v) => {
              return {
                name: v.name,
                value: v.description,
              };
            });

            let desc = `**Category: ${cmd.category.charAt(0).toUpperCase() + cmd.category.slice(1)
              }\nDescription: ${cmd.description}\nAliases: ${cmd.aliases}`;

            if (cmd.usage) {
              desc += `\nUsage: ${cmd.usage}**`;
            } else {
              desc += "\nUsage: You can figure it out or use slash commands instead.**";
            }

            sentMsg.edit({
              embeds: [
                {
                  title: `**${cmd.name.charAt(0).toUpperCase() + cmd.name.slice(1)}'s Detail**`,
                  description: desc,
                  fields,
                  color: 'RANDOM',
                },
              ],
              components: [],
            });

            collector2.stop();
          });

          collector2.on('end', (reason) => {
            if (reason === 'time') {
              sentMsg.edit({
                components: [],
              });
            }
          });

          collector.stop();
        });

        collector.on('end', (reason) => {
          if (reason === 'time' && !used) {
            sentMsg.edit({
              components: [],
            });
          }
        });
      });
  },
};
