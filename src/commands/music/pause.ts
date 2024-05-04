import { SlashCommandBuilder } from "discord.js";
import getLanguages from "../../utils/getLanguages";
import { SlashCommandProps } from "commandkit";
import { useQueue } from "discord-player";
import showError from "../../utils/showError";

export const data = new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pauses the curent song.");

export async function run({ interaction, client }: SlashCommandProps) {
    await interaction.deferReply();

    try {
        const guild = interaction.guild!.id;
        const queue = useQueue(guild);
        const serverLanguage = await getLanguages(client);

        if (!queue) {
            await interaction.editReply(
                serverLanguage[guild].translation.commands.skip.noSongPlaying
            );
            return;
        }

        queue.node.setPaused(true);

        await interaction.editReply(
            serverLanguage[guild].translation.commands.pause.paused
        );
    } catch (error) {
        showError("pause", error, interaction);
    }
}
