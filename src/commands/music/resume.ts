import { SlashCommandBuilder } from "discord.js";
import { SlashCommandProps } from "commandkit";
import { useQueue } from "discord-player";
import showError from "../../utils/showError";

export const data = new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Resumes the curent song.");

export async function run({ interaction, client }: SlashCommandProps) {
    await interaction.deferReply();

    if (!interaction.inGuild())
        return interaction.editReply(
            ":x: **This command only works on guilds.**"
        );

    try {
        const queue = useQueue(interaction.guild!.id);

        if (!queue) return interaction.editReply("There is no song playing.");

        queue.node.setPaused(false);

        await interaction.editReply("The current song has been resumed.");
    } catch (error) {
        showError("resume", error, interaction);
    }
}
