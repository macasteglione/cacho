import { Client, Guild } from "discord.js";
import { Language } from "../../models/Language";

export default async (guild: Guild, client: Client) => {
    try {
        const NEW_GUILD = new Language({
            guildId: guild.id,
        });

        await NEW_GUILD.save();
    } catch (error) {
        console.log("Error adding language document: ", error);
    }
};
