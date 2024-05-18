import { ChatSession, GoogleGenerativeAI } from "@google/generative-ai";

const gemini = new GoogleGenerativeAI(
    process.env.GEMINI_API_URL!
).getGenerativeModel({ model: "gemini-pro" });

let chat: ChatSession;

function startNewChat() {
    chat = gemini.startChat({
        history: [{ role: "user", parts: [{ text: "Your name is Cacho." }] }],
        generationConfig: {
            temperature: 0.9,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
        },
    });
}

startNewChat();
setInterval(startNewChat, 43200000);

export { chat };
