import { Schema, model } from "mongoose";

const languageSchema = new Schema({
    guildId: {
        type: String,
        require: true,
    },
    language: {
        type: String,
        default: "en_US",
    },
});

export const Language = model("Language", languageSchema);
