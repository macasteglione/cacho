import { SlashCommandBuilder } from "discord.js";
import { SlashCommandProps } from 'commandkit';

export const data = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with the bot ping!");

export async function run({ interaction, client }: SlashCommandProps) {
    const REPLY = await interaction.fetchReply();
    const PING = REPLY.createdTimestamp - interaction.createdTimestamp;

    interaction.reply(
        `**Pong!** :ping_pong:\tClient ${PING}ms | Websocket: ${client.ws.ping}ms.`
    );
}
