import { CommandOptions, SlashCommandProps } from "commandkit";
import { SlashCommandBuilder } from "discord.js";
import getCache from "../../utils/getCache";
import { GuildInfo } from "../../models/guildInfo";
import { redis } from "../../lib/redis";
import showError from "../../utils/showError";

async function save(guildInfo: any, option: boolean) {
    let guild = await GuildInfo.findOneAndUpdate(
        { guildId: guildInfo.guildId },
        { levelEnabled: option },
        { new: true }
    );
    await redis.set("guild_info", JSON.stringify(guild), {
        ex: 60,
    });
}

export const data = new SlashCommandBuilder()
    .setName("level-config")
    .setDescription("Configure the leveling system.")
    .addBooleanOption((option) =>
        option
            .setName("enable")
            .setDescription("Enable or disable the user leveling process.")
            .setRequired(true)
    );

export async function run({ interaction, client }: SlashCommandProps) {
    await interaction.deferReply();

    if (!interaction.inGuild())
        return interaction.editReply(
            ":x: **This command only works on guilds.**"
        );

    try {
        const guild = interaction.guild!.id;
        const guildInfo: any = await getCache(
            "guild_info",
            { guildId: guild },
            GuildInfo
        );

        const option = interaction.options.getBoolean("enable");
        await save(guildInfo, option!);

        return interaction.editReply(
            `Leveling system **has been ${option ? "enabled" : "disabled"}.**`
        );
    } catch (error) {
        showError("enableLevel", error, interaction);
    }
}

export const options: CommandOptions = {
    userPermissions: ["Administrator"],
};
