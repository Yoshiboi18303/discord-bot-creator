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

for (const handler of fs
    .readdirSync("./handlers")
    .filter((file) => file.endsWith(".js"))) {
        require(`./handlers/${handler}`)(client);
}

client.connect(); // Start the connection to Discord.
