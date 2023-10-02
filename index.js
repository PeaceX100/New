const Discord = require("discord.js");
const { Intents } = require("discord.js");
const keepAlive = require("./server");
const { prefix } = require("./config.json");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const client = new Discord.Client({ allowedMentions: {
  parse: ["users"]}, intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.commands = new Discord.Collection();
client.interactions = new Discord.Collection();
client.category = fs.readdirSync("./commands");

// Read functions from the "functions" directory
const functions = fs.readdirSync("./functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./slash");

(async () => {
  for (file of functions) {
    require(`./functions/${file}`)(client);
  }
})();

// Function to recursively read command files from a directory
async function readCommands(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.resolve(dir, file);
    const stat = fs.lstatSync(filePath);

    if (stat.isDirectory()) {
      readCommands(filePath); // Recurse into subdirectories
    } else if (file.endsWith('.js')) {
      const command = require(filePath);
      client.commands.set(command.name, command);
    }
  }
}

async function initializeCommands() {
  const commandsDir = './commands';
  await readCommands(commandsDir);
}

initializeCommands();

let ops = {
  queue2: client.queue2,
  queue: client.queue,
  queue3: client.queue3,
  games: client.games
};

client.once("ready", () => {
  client.user.setPresence({
    status: "idle",
    activities: [{
      name: `YOU || ${prefix}help || /help`,
      type: "WATCHING"
    }]
  });
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async msg => {
  if (msg.author.bot) return;
  if (!msg.content.startsWith(prefix)) return;

  const args = msg.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  let command;
  for (const [, cmd] of client.commands) {
    if (cmd.name === commandName || (cmd.aliases && cmd.aliases.includes(commandName))) {
      command = cmd;
      break;
    }
  }

  if (!command) return;

  try {
    await command.execute(client, msg, args, ops);
  } catch (error) {
    console.error(error);
    msg.reply("There was an issue executing that command");
  }
});

keepAlive();
mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log('Connected to MongoDB');
  client.handleCommands(commandFolders, './slash');
  console.log('Command Handler Ready');
  client.handleEvents(eventFiles, './events');
  console.log('Event Handler Ready');
  client.login(process.env.TOKEN);
});
