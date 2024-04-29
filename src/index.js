const { Client, IntentsBitField } = require("discord.js");
const MONGOOSE = require("mongoose");
const eventHandler = require("./handlers/eventHandler");
require("dotenv").config();

const BOT_CLIENT = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildPresences,
    ],
});

(async () => {
    try {
        await MONGOOSE.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        eventHandler(BOT_CLIENT);

        BOT_CLIENT.login(process.env.BOT_TOKEN);
    } catch (error) {
        console.log(`There was an error during init: ${error}`);
    }
})();
