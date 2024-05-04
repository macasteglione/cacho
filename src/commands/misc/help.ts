import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommandProps } from "commandkit";
import getLanguages from "../../utils/getLanguages";
import showError from "../../utils/showError";

export const data = new SlashCommandBuilder()
    .setName("help")
    .setDescription("Shows a list of commands you can use.");

export async function run({ interaction, client }: SlashCommandProps) {
    await interaction.deferReply();

    let responseEmbed;

    if (interaction.inGuild()) {
        const guild = interaction.guild!.id;
        const serverLanguage = await getLanguages(client);

        responseEmbed = new EmbedBuilder()
            .setColor("#db2473")
            .setDescription(
                serverLanguage[guild].translation.commands.help.commands
            )
            .setAuthor({
                name: serverLanguage[guild].translation.commands.help.name,
                iconURL: client.user.displayAvatarURL(),
                url: "https://cacho.vercel.app/",
            })
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(
                {
                    name: serverLanguage[guild].translation.commands.help.fun,
                    value: "`roulette`",
                },
                {
                    name: serverLanguage[guild].translation.commands.help.misc,
                    value: "`pong`, `help`",
                },
                {
                    name: serverLanguage[guild].translation.commands.help
                        .config,
                    value: "`language`",
                },
                {
                    name: serverLanguage[guild].translation.commands.help
                        .economy,
                    value: "`level`",
                },
                {
                    name: serverLanguage[guild].translation.commands.help.music,
                    value: "`play`, `skip`, `pause`, `resume`, `queue`, `exit`",
                }
            );
    } else {
        responseEmbed = new EmbedBuilder()
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
                    value: "`roulette`",
                },
                {
                    name: "Misc",
                    value: "`pong`, `help`",
                },
                {
                    name: "Configuration",
                    value: "`language`",
                },
                {
                    name: "Economy",
                    value: "`level`",
                },
                {
                    name: "Music",
                    value: "`play`, `skip`, `pause`, `resume`, `queue`, `exit`",
                }
            );
    }
    
    interaction.editReply({ embeds: [responseEmbed] });
}
