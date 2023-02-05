const Discord = require("discord.js");
const client = new Discord.Client({
    intents: new Discord.IntentsBitField(33283),
});

const PREFIX = "!"; // Replace the string content with whatever prefix you want

client.on("ready", () => {
    console.log("The client is ready!");
});

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

    if (command === "ping") {
        await message.reply("Pong!");
    }
});

client.login("TOKEN"); // Replace TOKEN with the token from your app on the Discord Developer Portal.
