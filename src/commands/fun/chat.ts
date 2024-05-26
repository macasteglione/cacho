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

async function fetchChatResponse(prompt: string) {
    const result = await chat.sendMessage(prompt);
    return result.response.text();
}

async function handleLongReply(reply: string, interaction: any) {
    const attachFile = new AttachmentBuilder(Buffer.from(reply)).setName(
        "message.txt"
    );
    await interaction.editReply({ files: [attachFile] });
}

async function handleReply(reply: string, interaction: any) {
    if (reply.length > 2000) await handleLongReply(reply, interaction);
    else await interaction.editReply(reply);
}

export async function run({ interaction, client }: SlashCommandProps) {
    await interaction.deferReply();

    try {
        const prompt = interaction.options.getString("prompt", true);
        const reply = await fetchChatResponse(prompt);
        await handleReply(reply, interaction);
    } catch (error) {
        showError("chat", error, interaction);
    }
}
