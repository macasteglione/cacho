import { SlashCommandBuilder } from "discord.js";
import getLanguages from "../../utils/getLanguages";
import { SlashCommandProps } from "commandkit";
import { useQueue } from "discord-player";

export const data = new SlashCommandBuilder()
    .setName("exit")
    .setDescription("Exits the voice channel.");

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

        queue.delete();

        await interaction.editReply(
            serverLanguage[guild].translation.commands.exit.disconnected
        );
    } catch (error) {
        console.log(`Error in pause file: ${error}`);
        interaction.editReply(
            `An error occurred while processing your request: \`${error}\``
        );
    }
}
