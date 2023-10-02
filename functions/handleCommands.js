const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId } = require('../config.json');
const fs = require('fs');
const pathModule = require('path');

module.exports = (client) => {
  client.handleCommands = async (commandFolders, path) => {
    client.commandArray = [];

    const foldersPath = pathModule.join(__dirname, '../slash');
    const slashCommandFolders = fs.readdirSync(foldersPath);

    for (const folder of slashCommandFolders) {
      // Grab all the command files from the commands directory you created earlier
      const commandsPath = pathModule.join(foldersPath, folder);
      const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

      // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
      for (const file of commandFiles) {
        const filePath = pathModule.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
          client.interactions.set(command.data.name, command);
          client.commandArray.push(command.data.toJSON());
        }
      }
    }

    // Construct and prepare an instance of the REST module
    const rest = new REST().setToken(process.env.TOKEN);

    // Deploy all commands at once
    try {
      console.log(`Started refreshing ${client.commandArray.length} application (/) commands.`);

      // Deploy all commands with a single API request
      const data = await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: client.commandArray }
      );

      console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
      console.error(error);
    }
  };
};
