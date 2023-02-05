const Discord = require("discord.js");
const client = new Discord.Client({
    intents: new Discord.IntentsBitField(33283),
});
const fs = require("fs");

const PREFIX = "!"; // Replace the string content with whatever prefix you want

client.commands = new Discord.Collection();

client.on("ready", () => {
    console.log("The client is ready!");
});

for (const file of fs
    .readdirSync("./commands")
    .filter((f) => f.endsWith(".js"))) {
    const command = require(`./commands/${file}`);

    if (!command.name)
        throw new Error(
            `Please provide a name for the command "commands/${file}"`
        );

    client.commands.set(command.name, command);
}

client.on("messageCreate", async (message) => {
    if (
        message.author.bot ||
        !message.guild ||
        !message.content.startsWith(PREFIX)
    )
        return;

    // Split the string into all arguments (e.g "!ping test" becomes ["ping", "test"]).
    const args = message.content.slice(PREFIX.length).trim().split(/ +/g);

    // Gets and removes the first item from the array.
    // Example: ["ping", "test"] becomes ["test"] and "ping" gets saved as the command
    const command = args.shift();

    // Tries to find the command in the client.commands collection
    const cmd = client.commands.get(command);

    if (!cmd) return;

    await cmd.execute(client, message, args);
});

client.login("TOKEN"); // Replace TOKEN with the token from your app on the Discord Developer Portal.
