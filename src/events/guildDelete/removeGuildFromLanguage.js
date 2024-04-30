const Language = require("../../models/Language");

module.exports = async (guild, client) => {
    try {
        const GUILD = await Language.findOne({ guildId: guild.id });

        await GUILD.deleteOne();
    } catch (error) {
        console.error("Error deleting language document: ", error);
    }
};
