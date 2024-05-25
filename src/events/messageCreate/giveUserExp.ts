import { Level } from "../../models/Level";
import calculateLevelExp from "../../utils/calculateLevelExp";
import { GuildInfo } from "../../models/guildInfo";
import { Message } from "discord.js";
import getCache from "../../utils/getCache";

const cooldowns = new Set();

function giveRandomExp(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default async (message: Message, client: any) => {
    const guildId = message.guild!.id;
    const guildinfo: any = await getCache(
        "guild_info",
        { guildId: guildId },
        GuildInfo
    );

    if (
        !message.inGuild() ||
        message.author.bot ||
        cooldowns.has(message.author.id) &&
        !guildinfo.levelEnabled
    )
        return;

    const EXP_TO_GIVE = giveRandomExp(5, 15);

    const QUERY = {
        userId: message.author.id,
        guildId: guildId,
    };

    try {
        const LEVEL = await Level.findOne(QUERY);

        if (LEVEL) {
            LEVEL.exp += EXP_TO_GIVE;

            if (LEVEL.exp > calculateLevelExp(LEVEL.level)) {
                LEVEL.exp = 0;
                LEVEL.level += 1;

                message.channel.send(
                    `:tada:\t${message.member} you have leveled up to **level ${LEVEL.level}**!\t:tada:`
                );
            }

            await LEVEL.save().catch((error) => {
                console.log(`Error saving updated level: ${error}`);
            });

            cooldowns.add(message.author.id);

            setTimeout(() => {
                cooldowns.delete(message.author.id);
            }, 60000);
        } else {
            const NEW_LEVEL = new Level({
                userId: message.author.id,
                guildId: message.guild!.id,
                exp: EXP_TO_GIVE,
            });

            await NEW_LEVEL.save();

            cooldowns.add(message.author.id);

            setTimeout(() => {
                cooldowns.delete(message.author.id);
            }, 60000);
        }
    } catch (error) {
        console.log(`Error giving exp: ${error}`);
    }
};
