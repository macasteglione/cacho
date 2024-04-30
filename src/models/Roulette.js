const { Schema, model } = require("mongoose");

const ROULETTE_SCHEMA = new Schema({
    guildId: {
        type: String,
        require: true,
    },
    items: [
        {
            name: {
                type: String,
                required: true,
            },
        },
    ],
});

module.exports = model("Roulette", ROULETTE_SCHEMA);
