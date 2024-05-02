import { Client } from "discord.js";
import { Language } from "../models/Language";
import fs = require("fs");
import path = require("path");

export default async (client: Client) => {
    const guildLanguages: any = {};

    try {
        const languageFiles: any = {};
        const languageFileNames = fs
            .readdirSync(path.join(__dirname, "../languages"))
            .filter((file: string) => file.endsWith(".json"))
            .map((lang: string) => lang.replace(/\.json$/, ""));

        for (const fileName of languageFileNames) {
            const languageContent = require(`../languages/${fileName}.json`);
            languageFiles[fileName] = languageContent;
        }

        for (const [guildId] of client.guilds.cache) {
            const result = await Language.findOne({ guildId: guildId });
            if (result)
                guildLanguages[guildId] = {
                    language: result.language,
                    translation: languageFiles[result.language] || {},
                };
        }
    } catch (error) {
        console.log(`Error while fetching guild languages: ${error}`);
    }

    return guildLanguages;
};
