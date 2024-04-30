const { Schema, model } = require("mongoose");

const LANGUAGE_SCHEMA = new Schema({
    guildId: {
        type: String,
        require: true,
    },
    language: {
        type: String,
        default: "en_US",
    },
});

module.exports = model("Language", LANGUAGE_SCHEMA);
