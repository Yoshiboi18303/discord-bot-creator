module.exports = {
    name: "error",
    execute: async (err) => {
        console.error(err); // Or use your preferred logger
    }
}
