const { getTextResponse } = require('./geminiService');

// Mock Data Store
const businessProfile = {
    id: "loc-12345",
    name: "My Business",
    rating: 4.2,
    reviewCount: 128,
    completeness: 65, // %
    missingFields: ["Website", "Opening Date", "Interior Photos"]
};

const mockReviews = [
    { id: "rev-1", user: "Rajesh Kumar", rating: 5, comment: "Great service and amazing products!", reply: null, date: "2023-10-01" },
    { id: "rev-2", user: "Priya Sharma", rating: 3, comment: "It was okay, but the wait time was long.", reply: null, date: "2023-10-05" },
    { id: "rev-3", user: "Amit Patel", rating: 1, comment: "Terrible experience. Rude staff.", reply: null, date: "2023-10-10" }
];

async function getBusinessAudit(userId, businessDetails) {
    if (!businessDetails || !businessDetails.name) {
        // Return default mock if no input provided yet
        return {
            score: businessProfile.completeness,
            health: "Pending Input",
            suggestions: ["Please enter your business details to get a real audit."],
            reviewsPending: 0
        };
    }

    try {
        const prompt = `
        Perform a simulated "Google Business Profile Audit" for a business named "${businessDetails.name}" 
        at URL/Location: "${businessDetails.url || 'Unknown'}".
        Category: "${businessDetails.category || 'General'}".

        Generate a JSON response with:
        - "score": A number between 0-100 representing profile completeness/health.
        - "health": a string like "Excellent", "Good", "Needs Improvement".
        - "suggestions": an array of 3-5 specific actionable tips to improve their Google presence.
        - "reviewsPending": a random integer between 1 and 10 representing unreplied reviews.

        Logic:
        - If just a name is given, score lower (~50-70) and suggest adding photos/hours.
        - If a URL is given, assume better score (~80+).
        `;

        const responseText = await getTextResponse("gemini-2.5-flash", prompt);

        // Clean and parse
        const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);

    } catch (err) {
        console.error("Audit Gen Error:", err);
        return {
            score: 0,
            health: "Error",
            suggestions: ["Could not generate audit. Please try again."],
            reviewsPending: 0
        };
    }
}

async function getReviews(userId) {
    return mockReviews;
}

async function generateReviewReply(reviewText, rating) {
    // Use Gemini to generate a professional reply
    const prompt = `
    Write a professional and polite reply to this Google Business review.
    Review Rating: ${rating}/5
    Review Comment: "${reviewText}"
    
    If good rating: Thank them warmly.
    If bad rating: Apologize and ask them to contact support.
    Keep it short (max 2 sentences).
    `;

    try {
        const reply = await getTextResponse("gemini-2.5-flash", prompt);
        return reply.trim();
    } catch (error) {
        console.error("Auto-reply gen error:", error);
        return "Thank you for your feedback! We appreciate it.";
    }
}

async function postReply(userId, reviewId, replyText) {
    // Find review and update mock DB
    const review = mockReviews.find(r => r.id === reviewId);
    if (review) {
        review.reply = replyText;
        return { success: true, message: "Reply posted successfully", review };
    }
    throw new Error("Review not found");
}

module.exports = {
    getBusinessAudit,
    getReviews,
    generateReviewReply,
    postReply
};
