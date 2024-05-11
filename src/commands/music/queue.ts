import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommandProps } from "commandkit";
import { Track, useQueue } from "discord-player";
import showError from "../../utils/showError";

export const data = new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Shows the first 10 songs in the queue.");

export async function run({ interaction, client }: SlashCommandProps) {
    await interaction.deferReply();

    if (!interaction.inGuild())
        return interaction.editReply(
            ":x: **This command only works on guilds.**"
        );

    try {
        const guild = interaction.guild!.id;
        const queue = useQueue(guild);

        if (!queue || !queue.isPlaying())
            return interaction.editReply("There is no queue playing.");

        const queueString = queue.tracks.data
            .slice(0, 10)
            .map((song: Track, i: number) => {
                return `${i + 1}. [${song.duration}]\` ${song.title} - <@${
                    song.requestedBy!.id
                }>`;
            })
            .join("\n");

        const currentSong = queue.currentTrack;

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `**Currently playing:**\n${currentSong} - <@${
                            currentSong!.requestedBy!.id
                        }>\n\n**Queue:**\n${queueString}`
                    )
                    .setThumbnail(currentSong!.thumbnail),
            ],
        });
    } catch (error) {
        showError("queue", error, interaction);
    }
}
