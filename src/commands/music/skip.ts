import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import getLanguages from "../../utils/getLanguages";
import { SlashCommandProps } from "commandkit";
import { useQueue } from "discord-player";

export const data = new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips the curent song.");

export async function run({ interaction, client }: SlashCommandProps) {
    await interaction.deferReply();
    
    const guild = interaction.guild!.id;
    const queue = useQueue(guild);
    const serverLanguage = await getLanguages(client);

    try {
        if (!queue) {
            await interaction.editReply(
                serverLanguage[guild].translation.commands.skip.noSongPlaying
            );
            return;
        }

        const currentSong = queue.currentTrack;

        queue.node.skip();

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(
                        `${serverLanguage[guild].translation.commands.skip.skipped} **${currentSong}**`
                    )
                    .setThumbnail(currentSong!.thumbnail),
            ],
        });
    } catch (error) {
        console.log(`Error in skip file: ${error}`);
        interaction.editReply(
            `An error occurred while processing your request: \`${error}\``
        );
    }
}
