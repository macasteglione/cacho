import { SlashCommandBuilder } from "discord.js";
import { Language } from "../../models/Language";
import { SlashCommandProps } from 'commandkit'
import getLanguages from "../../utils/getLanguages";

export const data = new SlashCommandBuilder()
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
    );

export async function run({ interaction, client }: SlashCommandProps) {
    await interaction.deferReply();
    
    const serverLanguage = await getLanguages(client);
    const guild = interaction.guild!.id;
    const LANGUAGE_TARGET = interaction.options.getString("target");

    try {
        let LANGUAGE = await Language.findOne({ guildId: guild });

        if (!LANGUAGE)
            LANGUAGE = new Language({
                guildId: guild,
                language: LANGUAGE_TARGET,
            });
        else LANGUAGE.language = LANGUAGE_TARGET!;

        await LANGUAGE.save();

        interaction.editReply(
            eval(
                serverLanguage[guild].translation.commands.language
                    .languageSet
            )
        );
    } catch (error) {
        console.log(`Error in language file: ${error}`);
        interaction.editReply(
            `An error occurred while processing your request: \`${error}\``
        );
    }
}