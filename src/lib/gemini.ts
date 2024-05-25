import {
    ChatSession,
    GoogleGenerativeAI,
    HarmBlockThreshold,
    HarmCategory,
} from "@google/generative-ai";

const gemini = new GoogleGenerativeAI(
    process.env.GEMINI_API_URL!
).getGenerativeModel({
    model: "gemini-1.5-pro-latest",
    systemInstruction: "Your name is Cacho.",
});

let chat: ChatSession;

function startNewChat() {
    chat = gemini.startChat({
        history: [],
        generationConfig: {
            temperature: 0.9,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
        },
        safetySettings: [
            {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_NONE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.BLOCK_NONE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold: HarmBlockThreshold.BLOCK_NONE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold: HarmBlockThreshold.BLOCK_NONE,
            },
        ],
    });
}

startNewChat();
setTimeout(() => {
    startNewChat();
}, 43200000);

export { chat };
