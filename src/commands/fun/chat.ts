import { SlashCommandProps } from "commandkit";
import { AttachmentBuilder, SlashCommandBuilder } from "discord.js";
import showError from "../../utils/showError";
import { chat } from "../../lib/gemini";

export const data = new SlashCommandBuilder()
    .setName("chat")
    .setDescription("Chat with Cacho's AI!")
    .addStringOption((option) =>
        option
            .setName("prompt")
            .setDescription("Prompt for the chat.")
            .setRequired(true)
    );

export async function run({ interaction, client }: SlashCommandProps) {
    await interaction.deferReply();

    try {
        const result = await chat.sendMessage(
            interaction.options.getString("prompt")!
        );

        const reply = await result.response.text();

        if (reply.length > 2000) {
            const attachFile = new AttachmentBuilder(
                Buffer.from(reply)
            ).setName("message.txt");
            await interaction.editReply({
                files: [attachFile],
            });
        } else await interaction.editReply(reply);
    } catch (error) {
        showError("chat", error, interaction);
    }
}
