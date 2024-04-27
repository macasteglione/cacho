const { Client, IntentsBitField } = require("discord.js");
const eventHandler = require("./handlers/eventHandler");
require("dotenv").config();

const BOT_CLIENT = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

eventHandler(BOT_CLIENT);

BOT_CLIENT.login(process.env.BOT_TOKEN);
