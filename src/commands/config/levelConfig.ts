import { CommandOptions, SlashCommandProps } from "commandkit";
import { SlashCommandBuilder } from "discord.js";
import getCache from "../../utils/getCache";
import { GuildInfo } from "../../models/guildInfo";
import showError from "../../utils/showError";
import saveCache from "../../utils/saveCache";

export const data = new SlashCommandBuilder()
    .setName("level-config")
    .setDescription("Configure the leveling system.")
    .addBooleanOption((option) =>
        option
            .setName("enable")
            .setDescription("Enable or disable the user leveling process.")
            .setRequired(true)
    );

async function getGuildInfoCache(userId: string, guildId: string) {
    return getCache(
        `level_config:guild_info:${userId}:${guildId}`,
        { guildId: guildId },
        GuildInfo
    );
}

async function updateGuildInfoCache(
    userId: string,
    guildId: string,
    update: Record<string, any>
) {
    return saveCache(
        `level_config:guild_info:${userId}:${guildId}`,
        GuildInfo,
        { guildId: guildId },
        update,
        { new: true }
    );
}

export async function run({ interaction, client }: SlashCommandProps) {
    await interaction.deferReply();

    if (!interaction.inGuild())
        return interaction.editReply(
            ":x: **This command only works on guilds.**"
        );

    try {
        const guildId = interaction.guild!.id;
        const userId = interaction.user.id;
        const guildInfo: any = await getGuildInfoCache(userId, guildId);

        const option = interaction.options.getBoolean("enable");
        await updateGuildInfoCache(userId, guildInfo.guildId, {
            levelEnabled: option,
        });

        return interaction.editReply(
            `Leveling system **has been ${option ? "enabled" : "disabled"}.**`
        );
    } catch (error) {
        showError("levelConfig", error, interaction);
    }
}

export const options: CommandOptions = {
    userPermissions: ["Administrator"],
};
