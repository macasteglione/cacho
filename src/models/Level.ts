import { Schema, model } from "mongoose";

const levelSchema = new Schema({
    userId: {
        type: String,
        require: true,
    },
    guildId: {
        type: String,
        require: true,
    },
    exp: {
        type: Number,
        default: 0,
    },
    level: {
        type: Number,
        default: 0,
    },
});

export const Level = model("Level", levelSchema);
