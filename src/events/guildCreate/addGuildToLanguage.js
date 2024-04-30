const Language = require("../../models/Language");

module.exports = async (guild, client) => {
    try {
        const NEW_GUILD = Language({
            guildId: guild.id,
        });

        await NEW_GUILD.save();
    } catch (error) {
        console.error("Error adding language document: ", error);
    }
};
