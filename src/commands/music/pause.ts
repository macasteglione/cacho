import { SlashCommandBuilder } from "discord.js";
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

        if (!queue) 
            return interaction.editReply("There is no song playing.");
        
        queue.node.setPaused(true);

        await interaction.editReply("The current song has been paused.");
    } catch (error) {
        showError("pause", error, interaction);
    }
}
