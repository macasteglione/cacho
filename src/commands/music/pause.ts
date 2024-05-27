import { SlashCommandBuilder } from "discord.js";
import { SlashCommandProps } from "commandkit";
import { useQueue } from "discord-player";
import showError from "../../utils/showError";

export const data = new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pauses the current song.");

async function handlePauseCommand(interaction: any) {
    const queue = useQueue(interaction.guild!.id);

    if (!queue) 
        return interaction.editReply("There is no song playing.");

    queue.node.setPaused(true);
    await interaction.editReply("The current song has been paused.");
}

export async function run({ interaction, client }: SlashCommandProps) {
    await interaction.deferReply();

    try {
        await handlePauseCommand(interaction);
    } catch (error) {
        showError("pause", error, interaction);
    }
}
