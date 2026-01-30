const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '../.env' }); // Adjust path to .env

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyBTtw-WMTHIKytT6JbuVmnpgfp5A7Im5cA");

async function listModels() {
    // Accessing the model listing via REST because the SDK wrapper might not expose it easily in this version
    // Or just try-catch a common one.
    console.log("Testing model availability...");
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
        const result = await model.generateContent("Hello");
        console.log("gemini-2.0-flash-exp is AVAILABLE.");
    } catch (e) {
        console.log("gemini-2.0-flash-exp is NOT available:", e.message);
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello");
        console.log("gemini-1.5-flash is AVAILABLE.");
    } catch (e) {
        console.log("gemini-1.5-flash is NOT available:", e.message);
    }
}

listModels();
