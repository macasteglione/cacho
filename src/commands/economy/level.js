const {
    Client,
    Interaction,
    ApplicationCommandOptionType,
    AttachmentBuilder,
} = require("discord.js");
const Level = require("../../models/Level");
const canvacord = require("canvacord");
const { Font } = require("canvacord");
const calculateLevelExp = require("../../utils/calculateLevelExp");

module.exports = {
    name: "level",
    description: "Shows your/someone's level.",
    options: [
        {
            name: "target-user",
            description: "The user whose level you want to see.",
            type: ApplicationCommandOptionType.Mentionable,
        },
    ],
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
        if (!interaction.inGuild()) {
            interaction.reply("You can only run this command inside a server.");
            return;
        }

        await interaction.deferReply();

        const MENTIONED_USER_ID = interaction.options.get("target-user")?.value;
        const TARGET_USER_ID = MENTIONED_USER_ID || interaction.member.id;
        const TARGET_USER_OBJECT = await interaction.member.fetch(
            TARGET_USER_ID
        );
        const FETCH_LEVEL = await Level.findOne({
            userId: TARGET_USER_ID,
            guildId: interaction.guild.id,
        });

        if (!FETCH_LEVEL) {
            interaction.editReply(
                MENTIONED_USER_ID
                    ? `${TARGET_USER_OBJECT.user.tag} doesn't hace any levels yet. Try again when they chat a little more.`
                    : "You don't have any levels yet. Chat a little more and try again."
            );
            return;
        }

        let allLevels = await Level.find({
            guildId: interaction.guild.id,
        }).select("-_id userId level exp");

        allLevels.sort((a, b) => {
            if (a.level === b.level) return b.exp - a.exp;
            else return b.level - a.level;
        });

        let currentRank =
            allLevels.findIndex((lvl) => lvl.userId === TARGET_USER_ID) + 1;

        Font.loadDefault();

        const RANK = new canvacord.RankCardBuilder()
            .setAvatar(TARGET_USER_OBJECT.user.displayAvatarURL({ size: 256 }))
            .setRank(currentRank)
            .setLevel(FETCH_LEVEL.level)
            .setCurrentXP(FETCH_LEVEL.exp)
            .setRequiredXP(calculateLevelExp(FETCH_LEVEL.level))
            .setStatus(TARGET_USER_OBJECT.presence.status)
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
    },
};
