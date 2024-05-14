import { Schema, model } from "mongoose";

const guildInfo = new Schema({
    guildId: {
        type: String,
        require: true,
    },
    language: {
        type: String,
        default: "en_US",
    },
    levelEnabled: {
        type: Boolean,
        default: true,
    },
});

export const GuildInfo = model("GuildInfo", guildInfo);
