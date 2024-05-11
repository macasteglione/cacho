import { SlashCommandBuilder } from "discord.js";
import { SlashCommandProps } from "commandkit";
import { useQueue } from "discord-player";
import showError from "../../utils/showError";

export const data = new SlashCommandBuilder()
    .setName("exit")
    .setDescription("Exits the voice channel.");

export async function run({ interaction, client }: SlashCommandProps) {
    await interaction.deferReply();

    if (!interaction.inGuild())
        return interaction.editReply(
            ":x: **This command only works on guilds.**"
        );

    try {
        const guild = interaction.guild!.id;
        const queue = useQueue(guild);

        if (!queue) 
            return interaction.editReply("There is no song playing.");

        queue.delete();

        await interaction.editReply("Disconnected");
    } catch (error) {
        showError("exit", error, interaction);
    }
}
