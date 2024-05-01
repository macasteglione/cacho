const Language = require("../models/Language");
const fs = require("fs");
const path = require("path");

module.exports = async (client) => {
    const guildLanguages = {};

    try {
        const languageFiles = {};
        const languageFileNames = fs
            .readdirSync(path.join(__dirname, "../languages"))
            .filter((file) => file.endsWith(".json"))
            .map((lang) => lang.replace(/\.json$/, ""));

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
