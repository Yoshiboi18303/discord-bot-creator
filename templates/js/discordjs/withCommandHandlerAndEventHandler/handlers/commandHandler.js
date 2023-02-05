const fs = require("fs");
const path = require("path");

module.exports = (client) => {
    for (const file of fs
        .readdirSync(path.join(__dirname, "..", "commands"))
        .filter((file) => file.endsWith(".js"))) {
        const command = require(`../commands/${file}`);

        if (!command.name)
            throw new Error(
                `Please provide a name for the command "commands/${file}"`
            );

        client.commands.set(command.name, command);
    }
};
