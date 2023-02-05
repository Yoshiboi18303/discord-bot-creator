const Discord = require("discord.js");
const client = new Discord.Client({
    intents: new Discord.IntentsBitField(33283),
});
const fs = require("fs");

client.commands = new Discord.Collection();

for (const handler of fs
    .readdirSync("./handlers")
    .filter((file) => file.endsWith(".js"))) {
    require(`./handlers/${handler}`)(client);
}

client.login("TOKEN"); // Replace TOKEN with the token from your app on the Discord Developer Portal.
