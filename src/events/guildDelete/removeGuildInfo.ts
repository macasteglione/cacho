import { Client, Guild } from "discord.js";
import { GuildInfo } from "../../models/GuildInfo";

export default async (guild: Guild, client: Client) => {
    try {
        const GUILD = await GuildInfo.findOne({ guildId: guild.id });

        await GUILD!.deleteOne();
    } catch (error) {
        console.log("Error deleting language document: ", error);
    }
};
