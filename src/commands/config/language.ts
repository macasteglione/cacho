/*import { SlashCommandBuilder } from "discord.js";
import { Language } from "../../models/Language";
import { SlashCommandProps } from "commandkit";
import getLanguages from "../../utils/getLanguages";
import { redis } from "../../lib/redis";
import getCache from "../../utils/getCache";
import showError from "../../utils/showError";

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

    try {
        const serverLanguage = await getLanguages(client);
        const guild = interaction.guild!.id;
        const LANGUAGE_TARGET = interaction.options.getString("target");
        let LANGUAGE: any = getCache(guild, { guildId: guild }, Language);

        if (!LANGUAGE)
            LANGUAGE = new Language({
                guildId: guild,
                language: LANGUAGE_TARGET,
            });
        else LANGUAGE.language = LANGUAGE_TARGET!;

        LANGUAGE = await Language.findOneAndUpdate(
            { guildId: guild },
            { language: LANGUAGE_TARGET },
            { new: true }
        );
        await redis.set(guild, JSON.stringify(LANGUAGE), {
            ex: 60,
        });

        interaction.editReply(
            eval(
                serverLanguage[guild].translation.commands.language.languageSet
            )
        );
    } catch (error) {
        showError("language", error, interaction);
    }
}
*/