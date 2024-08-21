import { Client, Guild } from "discord.js";
import { GuildInfo } from "../../models/GuildInfo";

export default async (guild: Guild, client: Client) => {
    try {
        const NEW_GUILD = new GuildInfo({
            guildId: guild.id,
        });

        await NEW_GUILD.save();
    } catch (error) {
        console.log("Error adding language document: ", error);
    }
};
