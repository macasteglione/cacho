import { Client, IntentsBitField } from "discord.js";
import { CommandKit } from "commandkit";
import mongoose from "mongoose";
import { config } from "dotenv";
import { Player } from "discord-player";

config();

const BOT_CLIENT: Client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildEmojisAndStickers,
        IntentsBitField.Flags.GuildPresences,
        IntentsBitField.Flags.GuildVoiceStates,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.GuildMessageTyping,
        IntentsBitField.Flags.GuildModeration,
        IntentsBitField.Flags.DirectMessages,
        IntentsBitField.Flags.DirectMessageReactions,
        IntentsBitField.Flags.DirectMessageTyping,
        IntentsBitField.Flags.MessageContent,
    ],
});

const player: Player = new Player(BOT_CLIENT, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25,
    },
});

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log("Connected to MongoDB");

        new CommandKit({
            client: BOT_CLIENT,
            commandsPath: `${__dirname}/commands`,
            eventsPath: `${__dirname}/events`,
            skipBuiltInValidations: true,
            bulkRegister: true,
        });

        await player.extractors.loadDefault();

        BOT_CLIENT.login(process.env.TEST_BOT_TOKEN);
    } catch (error) {
        console.log(`There was an error during init: ${error}`);
    }
})();
