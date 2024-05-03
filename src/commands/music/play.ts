import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { QueryType, useMainPlayer } from "discord-player";
import getLanguages from "../../utils/getLanguages";
import { SlashCommandProps } from "commandkit";

export const data = new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays a song.")
    .addSubcommand((subcommand) =>
        subcommand
            .setName("search")
            .setDescription("Searches for a song.")
            .addStringOption((option) =>
                option.setName("searchterms").setDescription("Search keywords")
            )
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName("playlist")
            .setDescription("Plays a playlist from YouTube")
            .addStringOption((option) =>
                option
                    .setName("url")
                    .setDescription("Playlist url")
                    .setRequired(true)
            )
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName("song")
            .setDescription("Plays song from YouTube")
            .addStringOption((option) =>
                option
                    .setName("url")
                    .setDescription("Url of the song")
                    .setRequired(true)
            )
    );

export async function run({ interaction, client }: SlashCommandProps) {
    const player = useMainPlayer();
    const queue = await player.nodes.create(interaction.guild!);
    const entry = queue.tasksQueue.acquire();
    const serverLanguage = await getLanguages(client);
    const guild = interaction.guild!.id;
    const voiceChannel = interaction.guild?.members.cache.get(
        interaction.user.id
    )?.voice.channelId;
    await interaction.deferReply();

    try {
        if (!voiceChannel) {
            await interaction.editReply(
                serverLanguage[guild].translation.commands.play
                    .mustBeInVoiceChannel
            );
            return;
        }

        if (!queue.connection) await queue.connect(voiceChannel);

        let embed = new EmbedBuilder();

        if (interaction.options.getSubcommand() === "song") {
            let url = interaction.options.getString("url");

            const result = await player.search(url!, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO,
            });

            if (result.tracks.length === 0) {
                await interaction.editReply(
                    serverLanguage[guild].translation.commands.play.noResult
                );
                return;
            }

            const song = result.tracks[0];
            await entry.getTask();
            await queue.addTrack(song);

            embed
                .setDescription(
                    `${serverLanguage[guild].translation.commands.play.added} **[${song.title}](${song.url})** ${serverLanguage[guild].translation.commands.play.toQueue}`
                )
                .setThumbnail(song.thumbnail)
                .setFooter({
                    text: eval(
                        serverLanguage[guild].translation.commands.play.duration
                    ),
                });
        } else if (interaction.options.getSubcommand() === "playlist") {
            let url = interaction.options.getString("url");

            const result = await player.search(url!, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO,
            });

            if (result.tracks.length === 0) {
                await interaction.editReply(
                    eval(
                        serverLanguage[guild].translation.commands.play
                            .noPlaylist
                    )
                );
                return;
            }

            const playlist = result.playlist;
            await entry.getTask();
            await queue.addTrack(playlist!);

            embed
                .setDescription(
                    `${
                        serverLanguage[guild].translation.commands.play.added
                    } **[${playlist!.title}](${playlist!.url})** ${
                        serverLanguage[guild].translation.commands.play.toQueue
                    }`
                )
                .setThumbnail(playlist!.thumbnail)
                .setFooter({
                    text: eval(
                        serverLanguage[guild].translation.commands.play.duration
                    ),
                });
        } else if (interaction.options.getSubcommand() === "search") {
            let url = interaction.options.getString("searchterms");

            const result = await player.search(url!, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO,
            });

            if (result.tracks.length === 0) {
                await interaction.editReply(
                    serverLanguage[guild].translation.commands.play.noResult
                );
                return;
            }

            const song = result.tracks[0];
            await entry.getTask();
            await queue.addTrack(song);

            embed
                .setDescription(
                    `${serverLanguage[guild].translation.commands.play.added} **[${song.title}](${song.url})** ${serverLanguage[guild].translation.commands.play.toQueue}`
                )
                .setThumbnail(song.thumbnail)
                .setFooter({
                    text: eval(
                        serverLanguage[guild].translation.commands.play.duration
                    ),
                });
        }

        if (!queue.isPlaying()) await queue.node.play();

        await interaction.editReply({ embeds: [embed] });
    } catch (error) {
        console.log(`Error in play file: ${error}`);
        interaction.editReply(
            `An error occurred while processing your request: \`${error}\``
        );
    } finally {
        queue.tasksQueue.release();
    }
}
