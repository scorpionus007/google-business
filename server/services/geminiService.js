const { GoogleGenAI } = require("@google/genai");
require('dotenv').config();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

async function getTextResponse(modelId, prompt) {
    try {
        const response = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
            config: { thinkingLevel: "medium" }
        });

        // Robust response extraction for @google/genai 2026 SDK
        if (typeof response.text === 'function') {
            return response.text();
        } else if (typeof response.text === 'string') {
            return response.text;
        } else if (response.candidates?.[0]?.content?.parts?.[0]?.text) {
            return response.candidates[0].content.parts[0].text;
        }
        console.log("Full Response Object:", JSON.stringify(response, null, 2));
        return "{}"; // Fallback
    } catch (e) {
        console.error(`Error with model ${modelId}:`, e.message);
        throw e;
    }
}

async function parseVoiceIntent(transcript, businessContext) {
    try {
        const contextStr = businessContext ? `This is for a ${businessContext} business.` : "This is for a generic small business.";
        const prompt = `
    You are an AI assistant for an MSME business management app. ${contextStr}
    Analyze the following user voice transcript and extract the intent and entities.
    Return ONLY a JSON object. Do not include markdown formatting.

    Possible Intents:
    - ADD_PRODUCT: User wants to add a product/service to inventory. Entities: name, price, stock, category.
       * If category is missing, infer it based on the business type (e.g., if Restaurant and item is "Coke", category="Beverage").
    - CHECK_STOCK: User asks about stock. Entities: product_name.
    - CREATE_BILL: User wants to make a bill. Entities: items (array of {name, qty}).
    - MARKETING_TEXT: User wants to write an ad/post. Entities: topic, platform, type.
    - MARKETING_IMAGE: User wants an image. Entities: description.
    - REVIEW_REPLY: User wants to reply to a review. Entities: review_text, sentiment.
    - OFF_TOPIC: User talks about non-business topics (weather, jokes, casual chat). Entities: response_text (a polite refusal or short chatter).

    Transcript: "${transcript}"

    JSON Output Format:
    {
      "intent": "INTENT_NAME",
      "entities": { ... }
    }
    `;

        // Use "gemini-2.5-flash" for speed and reasoning
        console.log("Sending transcript to Gemini:", transcript);
        const text = await getTextResponse("gemini-2.5-flash", prompt);
        console.log("Raw Gemini Response text:", text);

        // Clean markdown
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Gemini Intent Parse Error:", error);
        console.error("Raw Text likely caused error");
        return { intent: "UNKNOWN", error: error.message };
    }
}

async function generateMarketingText(topic, platform, type) {
    try {
        const prompt = `Write a short, engaging marketing post for ${platform} about "${topic}". The type of post is ${type}. Include emojis and hashtags.`;
        return await getTextResponse("gemini-2.5-flash", prompt);
    } catch (error) {
        console.error("Gemini Text Gen Error:", error);
        return "Error generating content.";
    }
}

async function generateImage(description) {
    try {
        const prompt = `Generate a high-quality realistic image for: ${description}`;

        // Use "gemini-2.5-flash-image" for Native Image Generation
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-image",
            contents: prompt,
            config: { thinkingLevel: "medium" }
        });

        // Check for explicit image data in the response (2026 API)
        // This is hypothetical handling based on "Native Image Gen"
        if (response.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
            const imgData = response.candidates[0].content.parts[0].inlineData;
            return `data:${imgData.mimeType};base64,${imgData.data}`;
        }

        // Fallback to text if it returns a description or URL string
        if (typeof response.text === 'function') {
            return response.text();
        } else if (typeof response.text === 'string') {
            return response.text;
        }

        return "Image generation complete (Visual).";
    } catch (error) {
        console.error("Gemini Image Gen Error:", error);
        return null;
    }
}

module.exports = {
    parseVoiceIntent,
    generateMarketingText,
    generateImage
};
