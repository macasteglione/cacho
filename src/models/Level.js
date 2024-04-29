const { Schema, model } = require("mongoose");

const LEVEL_SCHEMA = new Schema({
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

module.exports = model("Level", LEVEL_SCHEMA);
