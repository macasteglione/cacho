import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { QueryType, useMainPlayer } from "discord-player";
import { SlashCommandProps } from "commandkit";
import showError from "../../utils/showError";

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
                    .setDescription("Playlist URL")
                    .setRequired(true)
            )
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName("song")
            .setDescription("Plays a song from YouTube")
            .addStringOption((option) =>
                option
                    .setName("url")
                    .setDescription("URL of the song")
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

        const embed = new EmbedBuilder();

        if (interaction.options.getSubcommand() === "song")
            await handleSongSubcommand(interaction, player, queue, embed);
        else if (interaction.options.getSubcommand() === "playlist")
            await handlePlaylistSubcommand(interaction, player, queue, embed);
        else if (interaction.options.getSubcommand() === "search")
            await handleSearchSubcommand(interaction, player, queue, embed);

        await entry.getTask();

        if (!queue.isPlaying()) await queue.node.play();

        await interaction.editReply({ embeds: [embed] });
    } catch (error) {
        showError("play", error, interaction);
    } finally {
        queue.tasksQueue.release();
    }
}

async function handleSongSubcommand(
    interaction: any,
    player: any,
    queue: any,
    embed: any
) {
    const url = interaction.options.getString("url");
    const result = await player.search(url!, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_VIDEO,
    });

    if (result.tracks.length === 0)
        return interaction.editReply("No results found.");

    const song = result.tracks[0];
    await queue.addTrack(song);

    embed
        .setDescription(`Added **[${song.title}](${song.url})** to the queue.`)
        .setThumbnail(song.thumbnail)
        .setFooter({ text: `Duration: ${song.duration}` });
}

async function handlePlaylistSubcommand(
    interaction: any,
    player: any,
    queue: any,
    embed: any
) {
    const url = interaction.options.getString("url");
    const result = await player.search(url!, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_PLAYLIST,
    });

    if (result.tracks.length === 0)
        return interaction.editReply("No playlist found.");

    const playlist = result.playlist;
    await queue.addTrack(playlist!);

    embed
        .setDescription(
            `Added **[${playlist!.title}](${playlist!.url})** to the queue.`
        )
        .setThumbnail(playlist!.thumbnail)
        .setFooter({ text: `Duration: ${playlist!.durationFormatted}` });
}

async function handleSearchSubcommand(
    interaction: any,
    player: any,
    queue: any,
    embed: any
) {
    const searchTerms = interaction.options.getString("searchterms");
    const result = await player.search(searchTerms!, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_SEARCH,
    });

    if (result.tracks.length === 0)
        return interaction.editReply("No results found.");

    const song = result.tracks[0];
    await queue.addTrack(song);

    embed
        .setDescription(`Added **[${song.title}](${song.url})** to the queue.`)
        .setThumbnail(song.thumbnail)
        .setFooter({ text: `Duration: ${song.duration}` });
}

export async function run({ interaction, client }: SlashCommandProps) {
    await interaction.deferReply();

    try {
        await handlePlayCommand(interaction);
    } catch (error) {
        showError("play", error, interaction);
    }
}
