const Eris = require("eris");
const client = new Eris("Bot TOKEN", { // Replace TOKEN with the token from your app on the Discord Developer Portal.
    intents: ["guildMessages"],
});

const PREFIX = "!"; // Replace the string content with whatever prefix you want

client.on("ready", () => {
    console.log("The client is ready!");
});

client.on("error", (err) => {
    console.error(err); // Or use your preferred logger
});

client.on("messageCreate", (message) => {
    if (!message.content.startsWith(PREFIX)) return;

    // Split the string into all arguments (e.g "!ping test" becomes ["ping", "test"]).
    const args = message.content.slice(PREFIX.length).trim().split(/ +/g);

    // Gets and removes the first item from the array.
    // Example: ["ping", "test"] becomes ["test"] and "ping" gets saved as the command
    const command = args.shift();

    if (command === "ping") {
        client.sendMessage(message.channel.id, "Pong!");
    }
});

client.connect(); // Start the connection to Discord.
