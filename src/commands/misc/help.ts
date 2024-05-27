import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommandProps } from "commandkit";
import showError from "../../utils/showError";

export const data = new SlashCommandBuilder()
    .setName("help")
    .setDescription("Shows a list of commands you can use.");

function createHelpEmbed(client: any) {
    return new EmbedBuilder()
        .setColor("#db2473")
        .setDescription("Below you can see all the commands I know.")
        .setAuthor({
            name: "Hi! I'm Cacho!",
            iconURL: client.user.displayAvatarURL(),
            url: "https://cacho.vercel.app/",
        })
        .setThumbnail(client.user.displayAvatarURL())
        .addFields(
            {
                name: "Fun",
                value: "`roulette`, `chat`",
            },
            {
                name: "Misc",
                value: "`ping`, `help`",
            },
            {
                name: "Economy",
                value: "`level show`, `level target`",
            },
            {
                name: "Music",
                value: "`play`, `skip`, `pause`, `resume`, `queue`, `leave`",
            },
            {
                name: "Config (Admin only)",
                value: "`level-config`",
            }
        );
}

export async function run({ interaction, client }: SlashCommandProps) {
    await interaction.deferReply();

    try {
        await interaction.editReply({ embeds: [createHelpEmbed(client)] });
    } catch (error) {
        showError("help", error, interaction);
    }
}
