import { Schema, model } from "mongoose";

const itemSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
    },
    { _id: false }
);

const rouletteSchema = new Schema({
    guildId: {
        type: String,
        required: true,
    },
    items: [itemSchema],
});

export const Roulette = model("Roulette", rouletteSchema);
