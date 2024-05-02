import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommandProps } from "commandkit";

export const data = new SlashCommandBuilder()
    .setName("help")
    .setDescription("Shows a list of commands you can use.");

export async function run({ interaction, client }: SlashCommandProps) {
    const responseEmbed = new EmbedBuilder()
        .setColor("#db2473")
        .setDescription("Below you can see all the commands I know.")
        .setAuthor({
            name: "Hi! I'm Cacho!",
            iconURL: client.user.displayAvatarURL(),
            url: "https://cacho.vercel.app/",
        })
        .setThumbnail(client.user.displayAvatarURL())
        .addFields(
            { name: "Fun", value: "`roulette`" },
            {
                name: "Misc",
                value: "`pong`, `help`",
            },
            {
                name: "Config",
                value: "`language`",
            },
            {
                name: "Economy",
                value: "`level`",
            }
        );

    interaction.reply({ embeds: [responseEmbed] });
}
