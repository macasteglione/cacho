import { Client } from "discord.js";
import { GuildInfo } from "../models/GuildInfo";

export default async (client: Client) => {
    try {
        for (const [guildId] of client.guilds.cache) {
            const updated_guild = new GuildInfo({
                guildId: guildId,
                language: "en_US",
                levelEnabled: true,
            });
            updated_guild.save();
        }
    } catch (error) {
        console.log(`Error while fetching guild languages: ${error}`);
    }
};
