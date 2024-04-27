const { ActivityType } = require("discord.js");

module.exports = (client) => {
    client.user.setActivity({
        name: "/help",
        type: ActivityType.Listening,
    });
};
