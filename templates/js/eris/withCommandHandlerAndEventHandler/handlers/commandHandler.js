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
    
            client.registerCommand(command.name, command.execute);
    
            if (Array.isArray(command.aliases)) {
                for (const alias of command.aliases) {
                    client.registerCommandAlias(alias, command.name)
                }
            }
    }
}
