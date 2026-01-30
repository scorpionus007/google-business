const { GoogleGenAI } = require("@google/genai");
require('dotenv').config({ path: '../.env' });

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

async function listModels() {
    try {
        console.log("Listing models...");
        const response = await ai.models.list();
        // The SDK 2026 might return an async iterator or array.
        // Let's assume standard array first or try to log strictly.

        console.log("Response:", JSON.stringify(response, null, 2));

        // Attempt to iterate if it's iterable
        for await (const model of response) {
            console.log(`Model: ${model.name}`);
            console.log(`Methods: ${model.supportedGenerationMethods}`);
        }
    } catch (e) {
        console.error("Error listing models:", e);
    }
}

listModels();
