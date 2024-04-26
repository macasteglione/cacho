const DISCORD_JS = require("discord.js");

const CLIENT = new DISCORD_JS.Client({
    intents: 13952,
});

CLIENT.on("ready", async (client) => {
    console.log("Ready!");
});

CLIENT.login(
    "OTQ2OTUwNDAzMzI3NjY4MjU1.G9jNJY.DXgNlWrlXP4lWA2TIQ-MmKn7xMwVn4jT1JP1bA"
);