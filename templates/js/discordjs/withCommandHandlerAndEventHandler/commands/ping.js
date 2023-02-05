const { Client, Message } = require("discord.js");

module.exports = {
    name: "ping",
    description: "Sends \"Pong!\"",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {Array<String>} args
     */
    execute: async (client, message, args) => {
        await message.reply("Pong!");
    },
};
