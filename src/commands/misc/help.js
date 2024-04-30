const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Shows a list of commands you can use."),
    run: ({ interaction, client }) => {
        interaction.reply(
            ":rolling_eyes: **This commands is not implemented yet.**"
        );
    },
};
