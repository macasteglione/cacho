import { Level } from "../../models/Level";
import calculateLevelExp from "../../utils/calculateLevelExp";
import { GuildInfo } from "../../models/guildInfo";
import { Message } from "discord.js";
import getCache from "../../utils/getCache";

const cooldowns = new Set<string>();

function giveRandomExp(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default async function giveUserExp(message: Message, client: any) {
    if (
        !message.guild ||
        message.author.bot ||
        cooldowns.has(message.author.id)
    )
        return;

    const guildId = message.guild.id;
    const guildInfo: any = await getCache(
        `give_user_exp:guild_info:${message.author.id}:${guildId}`,
        { guildId: guildId },
        GuildInfo
    );

    if (!guildInfo || !guildInfo.levelEnabled) return;

    const EXP_TO_GIVE = giveRandomExp(5, 15);

    try {
        let level = await Level.findOne({
            userId: message.author.id,
            guildId: guildId,
        });

        if (!level)
            level = new Level({
                userId: message.author.id,
                guildId: guildId,
                exp: EXP_TO_GIVE,
            });
        else {
            level.exp += EXP_TO_GIVE;

            if (level.exp >= calculateLevelExp(level.level)) {
                level.exp -= calculateLevelExp(level.level);
                level.level += 1;

                message.channel.send(
                    `:tada: Congratulations, ${message.author}! You've reached **level ${level.level}**! :tada:`
                );
            }
        }

        await level.save();
        cooldowns.add(message.author.id);

        setTimeout(() => {
            cooldowns.delete(message.author.id);
        }, 60000);
    } catch (error) {
        console.error(`Error giving exp: ${error}`);
    }
}
