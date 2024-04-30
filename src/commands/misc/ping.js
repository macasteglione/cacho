const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with the bot ping!"),
    run: async ({ interaction, client }) => {
        await interaction.deferReply();

        const REPLY = await interaction.fetchReply();

        const PING = REPLY.createdTimestamp - interaction.createdTimestamp;

        interaction.editReply(
            `**Pong!** :ping_pong:\tClient ${PING}ms | Websocket: ${client.ws.ping}ms.`
        );
    },
};
