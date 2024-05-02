import { Client, Guild } from "discord.js";
import { Language } from "../../models/Language";

export default async (guild: Guild, client: Client) => {
    try {
        const GUILD = await Language.findOne({ guildId: guild.id });

        await GUILD!.deleteOne();
    } catch (error) {
        console.log("Error deleting language document: ", error);
    }
};
