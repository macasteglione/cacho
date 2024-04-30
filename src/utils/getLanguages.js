/*const Language = require("../models/Language");
const fs = require("fs");

module.exports = async (client) => {
    const guildLanguages = {};

    try {
        for (const guild of client.guilds.cache) {
            const guildId = guild[0];
            const result = await Language.findOne({ guildId: guildId });
            guildLanguages[guildId] = result;
        }
    } catch (error) {
        console.log(`Error while fetching guild languages: ${error}`);
    }

    const languageFiles = {};

    const languageFileNames = fs
        .readdirSync(`${__dirname}/../languages`)
        .filter((file) => file.endsWith(".json"))
        .map((lang) => lang.replace(/.json/, ""));

    for (const fileName of languageFileNames) {
        const languageContent = require(`../languages/${fileName}.json`);
        languageFiles[fileName] = languageContent;
    }

      for (const guildId in guildLanguages) {
          const guildLanguage = guildLanguages[guildId];
          if (guildLanguage.language === "en_US") {
              guildLanguage.language = languageFiles[guildLanguage.language];
          }
      }

    return guildLanguages;
};
*/