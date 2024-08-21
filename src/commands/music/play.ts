import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { QueryType, useMainPlayer } from "discord-player";
import { SlashCommandProps } from "commandkit";
import showError from "../../utils/showError";

export const data = new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays a song.")
    .addSubcommand((subcommand) =>
        subcommand
            .setName("song")
            .setDescription("Play a song!")
            .addStringOption((option) =>
                option
                    .setName("query")
                    .setDescription("Link or search for a song.")
                    .setRequired(true)
            )
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName("playlist")
            .setDescription("Plays a playlist from YouTube")
            .addStringOption((option) =>
                option
                    .setName("url")
                    .setDescription("Playlist URL")
                    .setRequired(true)
            )
    );

async function handlePlayCommand(interaction: any) {
    if (!interaction.inGuild())
        return interaction.editReply(
            ":x: **This command only works on guilds.**"
        );

    const player = useMainPlayer();
    const queue = await player.nodes.create(interaction.guild!);
    const entry = queue.tasksQueue.acquire();

    try {
        const voiceChannel = interaction.guild?.members.cache.get(
            interaction.user.id
        )?.voice.channelId;

        if (!voiceChannel)
            return interaction.editReply(
                "You must be in a voice channel to use this command."
            );

        if (!queue.connection) await queue.connect(voiceChannel);

        if (interaction.options.getSubcommand() === "playlist")
            await handlePlaylistSubcommand(interaction, player, queue, entry);
        else if (interaction.options.getSubcommand() === "song")
            await handleSongSubcommand(interaction, player, queue, entry);

        if (!queue.isPlaying()) await queue.node.play();
    } catch (error) {
        showError("music", error, interaction);
    } finally {
        queue.tasksQueue.release();
    }
}

async function handlePlaylistSubcommand(
    interaction: any,
    player: any,
    queue: any,
    entry: any
) {
    const url = interaction.options.getString("url");
    const result = await player.search(url!, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_PLAYLIST,
    });

    if (result.tracks.length === 0)
        return interaction.editReply(":x: **No results found.**");

    const playlist = result.playlist;
    await entry.getTask();
    await queue.addTrack(playlist!);

    await interaction.editReply({
        embeds: [
            new EmbedBuilder()
                .setDescription(
                    `Added **[${playlist!.title}](${
                        playlist!.url
                    })** to the queue.`
                )
                .setThumbnail(playlist!.thumbnail)
                .setFooter({
                    text: `Duration: ${playlist!.durationFormatted}`,
                }),
        ],
    });
}

async function handleSongSubcommand(
    interaction: any,
    player: any,
    queue: any,
    entry: any
) {
    const searchTerms = interaction.options.getString("query");
    const result = await player.search(searchTerms!, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE,
    });

    if (result.tracks.length === 0)
        return interaction.editReply(":x: **No results found.**");

    const song = result.tracks[0];
    await entry.getTask();
    await queue.addTrack(song);

    await interaction.editReply({
        embeds: [
            new EmbedBuilder()
                .setDescription(
                    `Added **[${song.title}](${song.url})** to the queue.`
                )
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}` }),
        ],
    });
}

export async function run({ interaction, client }: SlashCommandProps) {
    await interaction.deferReply();

    try {
        await handlePlayCommand(interaction);
    } catch (error) {
        showError("music", error, interaction);
    }
}
