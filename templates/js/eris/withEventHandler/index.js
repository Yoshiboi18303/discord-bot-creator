const Eris = require("eris");
const client = new Eris("Bot TOKEN", {
    // Replace TOKEN with the token from your app on the Discord Developer Portal.
    intents: ["guildMessages"],
});
const fs = require("fs");

for (const file of fs
    .readdirSync("./events")
    .filter((file) => file.endsWith(".js"))) {
        const event = require(`../events/${file}`);

        if (!event.name)
            throw new Error(`Please provide a name for the event "events/${file}"`);

        if (event.once)
            client.on(event.name, (...args) => event.execute(client, ...args));
        else
            client.once(event.name, (...args) => event.execute(client, ...args));
}

client.connect(); // Start the connection to Discord.
