const { Client, Interaction } = require("discord.js");

module.exports = {
    name: "ping",
    description: "Replies with the bot ping!",
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
        await interaction.deferReply();

        const REPLY = await interaction.fetchReply();

        const PING = REPLY.createdTimestamp - interaction.createdTimestamp;

        interaction.editReply(
            `Pong! Client ${PING}ms | Websocket: ${client.ws.ping}ms`
        );
    },
};
