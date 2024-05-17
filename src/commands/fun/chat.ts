import { SlashCommandProps } from "commandkit";
import { AttachmentBuilder, SlashCommandBuilder } from "discord.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import showError from "../../utils/showError";

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
        const geminiAi = new GoogleGenerativeAI(process.env.GEMINI_API_URL!);
        const model = geminiAi.getGenerativeModel({ model: "gemini-pro" });
        
        const parts = [
            {
                text: `input: ${interaction.options.getString("prompt")}`,
            },
        ];
        
        const generationConfig = {
            temperature: 0.9,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
        };

        let prevMessages = await interaction.channel?.messages.fetch({
            limit: 15,
        });
        prevMessages?.reverse();

        prevMessages?.forEach((msg) => {
            if (msg.author.id !== client.user.id && msg.author.bot) return;
            if (msg.author.id !== interaction.user.id) return;
            parts.push({ text: msg.content });
        });

        const result = await model.generateContent({
            contents: [{ role: "user", parts }],
            generationConfig,
        });

        const reply = await result.response.text();

        if (reply.length > 2000) {
            const attachFile = new AttachmentBuilder(
                Buffer.from(reply)
            ).setName("message.txt");
            await interaction.editReply({
                content: "Answer",
                files: [attachFile],
            });
        } else await interaction.editReply(reply);
    } catch (error) {
        showError("chat", error, interaction);
    }
}
