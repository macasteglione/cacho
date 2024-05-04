import { AttachmentBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommandProps } from "commandkit";
import { Level } from "../../models/Level";
import { RankCardBuilder } from "canvacord";
import { Font } from "canvacord";
import calculateLevelExp from "../../utils/calculateLevelExp";
import getLanguages from "../../utils/getLanguages";
import getCache from "../../utils/getCache";
import showError from "../../utils/showError";

export const data = new SlashCommandBuilder()
    .setName("level")
    .setDescription("Shows your level.")
    .addUserOption((option) =>
        option.setName("target").setDescription("Shows someone's level.")
    );

export async function run({ interaction, client }: SlashCommandProps) {
    await interaction.deferReply();

    try {
        const guild = interaction.guild!.id;
        const serverLanguage = await getLanguages(client);
        
        if (!interaction.inGuild()) {
            interaction.editReply(":x: **This command only works on guilds.**");
            return;
        }

        const MENTIONED_USER_ID = interaction.options.getUser("target")?.id;
        const TARGET_USER_ID = MENTIONED_USER_ID || interaction.user.id;
        const TARGET_USER_OBJECT = await interaction.guild!.members.fetch(
            TARGET_USER_ID
        );

        const FETCH_LEVEL: any = await getCache(
            guild,
            { guildId: guild },
            Level
        );

        if (!FETCH_LEVEL) {
            interaction.editReply(
                MENTIONED_USER_ID
                    ? eval(
                          serverLanguage[guild].translation.commands.level
                              .targetNoLevelExp
                      )
                    : eval(
                          serverLanguage[guild].translation.commands.level
                              .noLevelExp
                      )
            );
            return;
        }

        let allLevels = await Level.find({
            guildId: guild,
        }).select("-_id userId level exp");

        allLevels.sort((a: any, b: any) => {
            if (a.level === b.level) return b.exp - a.exp;
            else return b.level - a.level;
        });

        let currentRank =
            allLevels.findIndex((lvl: any) => lvl.userId === TARGET_USER_ID) +
            1;

        Font.loadDefault();

        const RANK = new RankCardBuilder()
            .setAvatar(TARGET_USER_OBJECT.user.displayAvatarURL({ size: 256 }))
            .setRank(currentRank)
            .setLevel(FETCH_LEVEL.level)
            .setCurrentXP(FETCH_LEVEL.exp)
            .setRequiredXP(calculateLevelExp(FETCH_LEVEL.level))
            .setStatus(TARGET_USER_OBJECT.presence!.status)
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

        interaction.editReply({ files: [ATTACHMENT] });
    } catch (error) {
        showError("level", error, interaction);
    }
}
