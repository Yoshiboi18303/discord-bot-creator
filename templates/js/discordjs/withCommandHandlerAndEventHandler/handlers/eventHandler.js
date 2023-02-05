const fs = require("fs");
const path = require("path");

module.exports = (client) => {
    for (const file of fs
        .readdirSync(path.join(__dirname, "..", "events"))
        .filter((file) => file.endsWith(".js"))) {
            const event = require(`../events/${file}`);

            if (!event.name)
                throw new Error(
                    `Please provide a name for the event "events/${file}"`
                );

            if (event.once)
                client.on(event.name, (...args) => event.execute(client, ...args));
            else
                client.once(event.name, (...args) => event.execute(client, ...args));
    }
};
