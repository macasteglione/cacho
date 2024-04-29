const { Client, Interaction } = require("discord.js");

module.exports = {
    name: "help",
    description: "Shows a list of commands you can use.",
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: (client, interaction) => {
        interaction.reply("This commands is not implemented yet");
    },
};
