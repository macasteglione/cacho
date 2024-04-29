const { Client, Message } = require("discord.js");
const Level = require("../../models/Level");
const calculateLevelExp = require("../../utils/calculateLevelExp");
const cooldowns = new Set();

function giveRandomExp(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 *
 * @param {Client} client
 * @param {Message} message
 */
module.exports = async (client, message) => {
    if (
        !message.inGuild() ||
        message.author.bot ||
        cooldowns.has(message.author.id)
    )
        return;

    const EXP_TO_GIVE = giveRandomExp(5, 15);

    const QUERY = {
        userId: message.author.id,
        guildId: message.guild.id,
    };

    try {
        const LEVEL = await Level.findOne(QUERY);

        if (LEVEL) {
            LEVEL.exp += EXP_TO_GIVE;

            if (LEVEL.exp > calculateLevelExp(LEVEL.level)) {
                LEVEL.exp = 0;
                LEVEL.level += 1;

                message.channel.send(
                    `${message.member} you have leveled up to **level ${LEVEL.level}**!`
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
            const NEW_LEVEL = Level({
                userId: message.author.id,
                guildId: message.guild.id,
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
