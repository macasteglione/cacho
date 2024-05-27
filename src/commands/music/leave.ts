import { SlashCommandBuilder } from "discord.js";
import { SlashCommandProps } from "commandkit";
import { useQueue } from "discord-player";
import showError from "../../utils/showError";

export const data = new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Leaves the voice channel.");

async function handleExitCommand(interaction: any) {
    if (!interaction.inGuild())
        return interaction.editReply(
            ":x: **This command only works on guilds.**"
        );

    const queue = useQueue(interaction.guild!.id);

    if (!queue) return interaction.editReply("There is no song playing.");

    queue.delete();
    await interaction.editReply("Disconnected");
}

export async function run({ interaction, client }: SlashCommandProps) {
    await interaction.deferReply();

    try {
        await handleExitCommand(interaction);
    } catch (error) {
        showError("leave", error, interaction);
    }
}
