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
import { redis } from "../../lib/redis";

async function save(guildInfo: any, option: boolean) {
    let guild = await GuildInfo.findOneAndUpdate(
        { guildId: guildInfo.guildId },
        { levelEnabled: option },
        { new: true }
    );
    await redis.set("guildInfo", JSON.stringify(guild), {
        ex: 60,
    });
}

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
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName("config")
            .setDescription("Configure the leveling system.")
            .addBooleanOption((option) =>
                option
                    .setName("enable")
                    .setDescription(
                        "Enable or disable the user leveling process."
                    )
            )
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
            "guildInfo",
            { guildId: guild },
            GuildInfo
        );

        if (interaction.options.getSubcommand() === "config") {
            const option = interaction.options.getBoolean("enable");
            await save(guildInfo, option!);

            return interaction.editReply(
                `Leveling system **has been ${
                    option ? "enabled" : "disabled"
                }.**`
            );
        }

        if (guildInfo.levelEnabled) {
            const MENTIONED_USER_ID = interaction.options.getUser("user")?.id;
            const TARGET_USER_ID = MENTIONED_USER_ID || interaction.user.id;
            const TARGET_USER_OBJECT = await interaction.guild!.members.fetch(
                TARGET_USER_ID
            );
            const query = { guildId: guild };

            const FETCH_LEVEL: any = await getCache(
                "fetch_level",
                query,
                Level
            );

            if (!FETCH_LEVEL) {
                interaction.editReply(
                    MENTIONED_USER_ID
                        ? `:x: <@${TARGET_USER_OBJECT.user.id}> **doesn't hace any levels yet.** Try again when they chat a little more.`
                        : "**You don't have any levels yet.** Chat a little more and try again."
                );
                return;
            }

            let allLevels = Object.values(
                await findCache(guild, query, Level, "userId level exp")
            );

            allLevels.sort((a: any, b: any) => {
                if (a.level === b.level) return b.exp - a.exp;
                else return b.level - a.level;
            });

            let currentRank =
                allLevels.findIndex(
                    (lvl: any) => lvl.userId === TARGET_USER_ID
                ) + 1;

            Font.loadDefault();

            const RANK = new RankCardBuilder()
                .setAvatar(
                    TARGET_USER_OBJECT.user.displayAvatarURL({ size: 256 })
                )
                .setRank(currentRank)
                .setLevel(FETCH_LEVEL.level)
                .setCurrentXP(FETCH_LEVEL.exp)
                .setRequiredXP(calculateLevelExp(FETCH_LEVEL.level))
                .setStatus(
                    TARGET_USER_OBJECT.presence
                        ? TARGET_USER_OBJECT.presence.status
                        : "offline"
                )
                .setUsername(TARGET_USER_OBJECT.user.username)
                .setDisplayName(TARGET_USER_OBJECT.user.displayName)
                .setBackground("#23272a")
                .setTextStyles({
                    level: "LEVEL:",
                    xp: "EXP:",
                    rank: "RANK:",
                });

            const IMAGE = await RANK.build({ format: "png" });
            const ATTACHMENT = new AttachmentBuilder(IMAGE);

            return interaction.editReply({ files: [ATTACHMENT] });
        } else {
            return interaction.editReply("Leveling is disabled.");
        }
    } catch (error) {
        showError("level", error, interaction);
    }
}
