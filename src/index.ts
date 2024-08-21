import mongoose from "mongoose";
import { config } from "dotenv";
import { BOT_CLIENT } from "./lib/botClient";
import { player } from "./lib/discordPlayer";
import { initCommandKit } from "./lib/commandKit";
import { YoutubeiExtractor } from "discord-player-youtubei";

config();

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log("Connected to MongoDB");

        initCommandKit();
        await player.extractors.register(YoutubeiExtractor, {});

        BOT_CLIENT.login(process.env.BOT_TOKEN);
    } catch (error) {
        console.log(`There was an error during init: ${error}`);
    }
})();
