const { SlashCommandBuilder } = require("discord.js");
const Language = require("../../models/Language");
const getLanguages = require("../../utils/getLanguages");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("language")
        .setDescription("Set the language for the bot.")
        .addStringOption((option) =>
            option
                .setName("target")
                .setDescription("The language to change.")
                .setRequired(true)
                .addChoices(
                    { name: "Español", value: "es_ES" },
                    { name: "English", value: "en_US" }
                )
        ),
    run: async ({ interaction, client }) => {
        try {
            const serverLanguage = await getLanguages(client);
            const guild = interaction.guild.id;
            const LANGUAGE_TARGET = interaction.options.getString("target");

            await interaction.deferReply();

            let LANGUAGE = await Language.findOne({ guildId: guild });

            if (!LANGUAGE)
                LANGUAGE = new Language({
                    guildId: guild,
                    language: LANGUAGE_TARGET,
                });
            else LANGUAGE.language = LANGUAGE_TARGET;

            await LANGUAGE.save();

            interaction.editReply(
                eval(
                    serverLanguage[guild].translation.commands.language
                        .languageSet
                )
            );
        } catch (error) {
            console.log(`Error in language file: ${error}`);
            interaction.reply(
                `:x: An error occurred while processing your request: \`${error}\``
            );
        }
    },
};
