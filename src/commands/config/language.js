const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("language")
        .setDescription("Set the language for the bot."),
    run: ({ interaction, client }) => {
        interaction.reply(
            ":rolling_eyes: **This commands is not implemented yet.**"
        );
    },
};
