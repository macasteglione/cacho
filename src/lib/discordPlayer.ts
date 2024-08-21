import { Player } from "discord-player";
import { BOT_CLIENT } from "./botClient";

export const player = new Player(BOT_CLIENT, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25,
    },
});
