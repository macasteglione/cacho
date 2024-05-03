import { SlashCommandBuilder } from "discord.js";
import getLanguages from "../../utils/getLanguages";
import { SlashCommandProps } from "commandkit";
import { useQueue } from "discord-player";

export const data = new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pauses the curent song.");

export async function run({ interaction, client }: SlashCommandProps) {
    const guild = interaction.guild!.id;
    const queue = useQueue(guild);
    const serverLanguage = await getLanguages(client);
    await interaction.deferReply();

    try {
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
        console.log(`Error in pause file: ${error}`);
        interaction.editReply(
            `An error occurred while processing your request: \`${error}\``
        );
    }
}
