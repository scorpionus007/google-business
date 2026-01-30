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
       * Rule: If price is missing, use 0. If stock is missing, use 1.
       * Rule: Infer category from the item name if not specified (e.g. "iPhone" -> "Electronics").
    - CHECK_STOCK: User asks about stock level or availability. Entities: product_name.
       * Rule: Handle queries like "Do we have X?" or "How many X are left?".
       * Rule: If "product_name" is very generic (like "product", "item"), return "UNKNOWN_PRODUCT".
    - CREATE_BILL: User wants to make a bill/invoice. Entities: items (array of {name, qty}).
    - MARKETING_TEXT: User wants to write an ad/post. Entities: topic, platform, type.
    - MARKETING_IMAGE: User wants an image. Entities: description.
    - BUILD_WEBSITE: User wants to create/generate a website. Entities: description (business details).
    - REVIEW_REPLY: User wants to reply to a review. Entities: review_text, sentiment.
    - OFF_TOPIC: User talks about non-business topics. Entities: response_text.
    - AMBIGUOUS: User's intent is unclear or input is too short (e.g., just "product"). status: "ask_clarification".

    Transcript: "${transcript}"

    Examples:
    - "Add 50 Bottles of Coke" -> { "intent": "ADD_PRODUCT", "entities": { "name": "Coke", "stock": 50, "category": "Beverage" } }
    - "Do we have Rice?" -> { "intent": "CHECK_STOCK", "entities": { "product_name": "Rice" } }
    - "Make a website for my bakery" -> { "intent": "BUILD_WEBSITE", "entities": { "description": "bakery" } }
    - "product" -> { "intent": "AMBIGUOUS", "entities": { "response_text": "Could you be more specific? Do you want to add a product or check stock?" } }

    JSON Output Format:
    {
      "intent": "INTENT_NAME",
      "entities": { ... }
    }
    `;

        // Use "gemini-2.5-flash" for speed and reasoning
        // console.log("Sending transcript to Gemini:", transcript);
        const text = await getTextResponse("gemini-2.5-flash", prompt);
        // console.log("Raw Gemini Response text:", text);

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
        const prompt = `
        You are a digital marketing expert and a frontend developer. 
        Create a marketing post for ${platform} about "${topic}". The type of post is ${type}.
        
        Return ONLY a JSON object with the following fields:
        1. "text": A short, engaging caption with emojis and hashtags.
        2. "html": A COMPLETE, single-file HTML code snippet (with inline CSS) that visually represents this ad.
           - It should be a beautiful, modern card or flyer design.
           - Use a ${platform === 'Story' ? 'portrait (9:16)' : 'square (1:1)'} aspect ratio container.
           - Use generic placeholder images (e.g. https://placehold.co/600x400) if needed.
           - Make it look premium and professional.
           - correct all syntax errors. 
           
        JSON Output Format:
        {
          "text": "Caption here...",
          "html": "<div style='...'>...</div>"
        }
        `;

        const responseText = await getTextResponse("gemini-2.5-flash", prompt);
        const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Gemini Text Gen Error:", error);
        return { text: "Error generating content.", html: "<div style='padding:20px;color:red;'>Failed to generate design.</div>" };
    }
}

async function generateImage(description) {
    try {
        // Fallback/Alternative: Use Pollinations.ai for reliable, free AI image generation
        // This avoids Quota/Model Not Found issues with the Google Key for this specific feature in a demo setting.
        const encodedPrompt = encodeURIComponent(description);
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${Math.floor(Math.random() * 1000)}`;

        return imageUrl;

        return imageUrl;
        /* CONFIGURATION FOR GOOGLE GENAI IMAGEN (IF AVAILABLE)
        const response = await ai.models.generateContent({
            model: "imagen-3.0-generate-001",
            contents: prompt
        });
        
        if (response.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
            const imgData = response.candidates[0].content.parts[0].inlineData;
            return `data:${imgData.mimeType};base64,${imgData.data}`;
        }
        */
    } catch (error) {
        console.error("Gemini Image Gen Error:", error);
        return null;
    }
}

async function generateWebsiteCode(description) {
    try {
        const prompt = `
        You are an expert web developer. Create a complete, single-file HTML landing page (with embedded CSS in <style> tags) for a small business described as: "${description}".
        
        Requirements:
        - Modern, responsive design (use Flexbox/Grid).
        - Professional color scheme suitable for the business type.
        - Sections: Header (Logo/Name), Hero (Headline, CTA), About Us, Services/Products, Contact Info (Footer).
        - Use placehold.co for images if needed (e.g., <img src="https://placehold.co/600x400" />).
        - Return ONLY the raw HTML string. Do NOT wrap in \`\`\`html markdown blocks.
        `;

        const text = await getTextResponse("gemini-2.5-flash", prompt);
        // Clean markdown if present just in case
        return text.replace(/```html/g, '').replace(/```/g, '').trim();
    } catch (error) {
        console.error("Website Gen Error:", error);
        return "<h1>Error generating website</h1><p>Please try again.</p>";
    }
}

module.exports = {
    parseVoiceIntent,
    generateMarketingText,
    generateImage,
    getTextResponse,
    generateWebsiteCode
};
