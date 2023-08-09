const { Client, Collection } = require("discord.js");
const { readdirSync } = require("fs");
const { join } = require("path");
const config = require('../../config')

const client = new Client({
  intents: ["Guilds", "GuildMessages", "MessageContent", "GuildMembers"],
});

const guildDB = require("../models/guildDB")

client.commands = new Collection();
client.developers = config.Developers;
client.guildDB = guildDB;

const commandFolders = readdirSync(join(__dirname, "../commands"));
for (const folder of commandFolders) {
  const commandFiles = readdirSync(
    join(__dirname, "../commands", folder)
  ).filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const command = require(join(__dirname, "../commands", folder, file));
    client.commands.set(command.name, command);
    if (command.aliases && Array.isArray(command.aliases)) {
      for (const alias of command.aliases) {
        client.commands.set(alias, command);
      }
    }
  }
}

const eventFiles = readdirSync(join(__dirname, "../events")).filter((file) =>
  file.endsWith(".js")
);
for (const file of eventFiles) {
  const event = require(join(__dirname, "../events", file));
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

module.exports = client;
