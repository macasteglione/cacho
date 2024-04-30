const { Schema, model } = require("mongoose");

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

module.exports = model("Roulette", rouletteSchema);
