import { AttachmentBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommandProps } from "commandkit";
import { Level } from "../../models/Level";
import { RankCardBuilder } from "canvacord";
import { Font } from "canvacord";
import calculateLevelExp from "../../utils/calculateLevelExp";
import getCache from "../../utils/getCache";
import showError from "../../utils/showError";
import findCache from "../../utils/findCache";
import { GuildInfo } from "../../models/guildInfo";

export const data = new SlashCommandBuilder()
    .setName("level")
    .setDescription("Shows your level.")
    .addSubcommand((subcommand) =>
        subcommand.setName("show").setDescription("Show your level")
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName("target")
            .setDescription("Show someone's level.")
            .addUserOption((option) =>
                option.setName("user").setDescription("User to target.")
            )
    );

async function getGuildInfo(interaction: any) {
    const guildId = interaction.guild!.id;
    return await getCache(
        `level:guild_info:${interaction.user.id}:${guildId}`,
        { guildId },
        GuildInfo
    );
}

async function getUserLevel(interaction: any, userId: string) {
    const guildId = interaction.guild!.id;
    return await getCache(
        `level:fetch_level:${userId}:${guildId}`,
        { guildId },
        Level
    );
}

async function getAllLevels(interaction: any) {
    const guildId = interaction.guild!.id;
    const query = { guildId };
    return await findCache(
        `level:all_levels:${interaction.user.id}:${guildId}`,
        query,
        Level,
        "userId level exp"
    );
}

function sortLevels(levels: any[]) {
    return levels.sort((a, b) => {
        if (a.level === b.level) return b.exp - a.exp;
        return b.level - a.level;
    });
}

async function buildRankCard(
    targetUser: any,
    fetchLevel: any,
    currentRank: number
) {
    Font.loadDefault();

    const rankCard = new RankCardBuilder()
        .setAvatar(targetUser.user.displayAvatarURL({ size: 256 }))
        .setRank(currentRank)
        .setLevel(fetchLevel.level)
        .setCurrentXP(fetchLevel.exp)
        .setRequiredXP(calculateLevelExp(fetchLevel.level))
        .setStatus(targetUser.presence ? targetUser.presence.status : "offline")
        .setUsername(targetUser.user.username)
        .setDisplayName(targetUser.user.displayName)
        .setBackground("#23272a")
        .setTextStyles({ level: "LEVEL:", xp: "EXP:", rank: "RANK:" });

    const image = await rankCard.build({ format: "png" });
    return new AttachmentBuilder(image);
}

export async function run({ interaction, client }: SlashCommandProps) {
    await interaction.deferReply();

    if (!interaction.inGuild())
        return interaction.editReply(
            ":x: **This command only works on guilds.**"
        );

    try {
        const guildInfo = await getGuildInfo(interaction);

        if (guildInfo.levelEnabled) {
            const mentionedUser = interaction.options.getUser("user");
            const targetUserId = mentionedUser
                ? mentionedUser.id
                : interaction.user.id;
            const targetUser = await interaction.guild!.members.fetch(
                targetUserId
            );

            const fetchLevel = await getUserLevel(interaction, targetUserId);

            if (!fetchLevel)
                return interaction.editReply(
                    mentionedUser
                        ? `:x: <@${targetUser.user.id}> **doesn't have any levels yet.** Try again when they chat a little more.`
                        : "**You don't have any levels yet.** Chat a little more and try again."
                );

            let allLevels = sortLevels(await getAllLevels(interaction));

            let currentRank =
                allLevels.findIndex((lvl) => lvl.userId === targetUserId) + 1;

            const attachment = await buildRankCard(
                targetUser,
                fetchLevel,
                currentRank
            );

            return interaction.editReply({ files: [attachment] });
        } else return interaction.editReply("Leveling is disabled.");
    } catch (error) {
        showError("level", error, interaction);
    }
}
