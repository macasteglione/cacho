import { SlashCommandBuilder } from "discord.js";
import getLanguages from "../../utils/getLanguages";
import { SlashCommandProps } from "commandkit";
import { useQueue } from "discord-player";
import showError from "../../utils/showError";

export const data = new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Resumes the curent song.");

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

        queue.node.setPaused(false);

        await interaction.editReply(
            serverLanguage[guild].translation.commands.resume.resumed
        );
    } catch (error) {
        showError("resume", error, interaction);
    }
}
