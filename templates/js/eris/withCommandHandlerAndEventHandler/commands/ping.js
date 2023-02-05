module.exports = {
    name: "ping",
    aliases: ["p"],
    execute: async (message, args) => { // There's also a prefix argument
        // This is different from discord.js, you have to RETURN a response string
        return "Pong!";
    }
}
