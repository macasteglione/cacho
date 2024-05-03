import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import getLanguages from "../../utils/getLanguages";
import { SlashCommandProps } from "commandkit";
import { Track, useQueue } from "discord-player";

export const data = new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Shows the first 10 songs in the queue.");

export async function run({ interaction, client }: SlashCommandProps) {
    await interaction.deferReply();
    
    const serverLanguage = await getLanguages(client);
    const guild = interaction.guild!.id;
    const queue = useQueue(guild);

    try {
        if (!queue || !queue.isPlaying()) {
            await interaction.editReply(
                serverLanguage[guild].translation.commands.queue.noQueue
            );
            return;
        }

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
                        `${
                            serverLanguage[guild].translation.commands.queue
                                .currentlyPlaying
                        }\n${currentSong} - <@${
                            currentSong!.requestedBy!.id
                        }>\n\n${
                            serverLanguage[guild].translation.commands.queue
                                .queue
                        }\n${queueString}`
                    )
                    .setThumbnail(currentSong!.thumbnail),
            ],
        });
    } catch (error) {
        console.log(`Error in queue file: ${error}`);
        interaction.editReply(
            `An error occurred while processing your request: \`${error}\``
        );
    }
}
