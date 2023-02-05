const Eris = require("eris");
const client = new Eris.CommandClient("Bot TOKEN", { // Replace TOKEN with the token from your app on the Discord Developer Portal.
    intents: ["guildMessages"],
}, {
    description: "A bot made by someone",
    owner: "Someone",
    prefix: "!", // Replace the string content with whatever prefix you want
    caseInsensitive: true // Comment this line if you want the command names to be case-sensitive
});
const fs = require("fs");

for (const file of fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"))) {
        const command = require(`./commands/${file}`);

        if (!command.name)
            throw new Error(
                `Please provide a name for the command "commands/${file}"`
            );

        client.registerCommand(command.name, command.execute);

        if (Array.isArray(command.aliases)) {
            for (const alias of command.aliases) {
                client.registerCommandAlias(alias, command.name)
            }
        }
}

client.on("ready", () => {
    console.log("The client is ready!");
});

client.on("error", (err) => {
    console.error(err); // Or use your preferred logger
});

client.connect(); // Start the connection to Discord.
