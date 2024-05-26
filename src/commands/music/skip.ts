import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommandProps } from "commandkit";
import { useQueue } from "discord-player";
import showError from "../../utils/showError";

export const data = new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips the curent song.");

export async function run({ interaction, client }: SlashCommandProps) {
    await interaction.deferReply();

    if (!interaction.inGuild())
        return interaction.editReply(
            ":x: **This command only works on guilds.**"
        );

    try {
        const queue = useQueue(interaction.guild!.id);

        if (!queue) return interaction.editReply("There is no song playing.");

        const currentSong = queue.currentTrack;

        queue.node.skip();

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`Skipped **${currentSong}**`)
                    .setThumbnail(currentSong!.thumbnail),
            ],
        });
    } catch (error) {
        showError("skip", error, interaction);
    }
}
