const express = require('express');
const router = express.Router();
const MarketingPost = require('../models/MarketingPost');
const { generateMarketingText, generateImage } = require('../services/geminiService');

const auth = require('../middleware/authMiddleware');

// Get all posts
router.get('/', auth, async (req, res) => {
    try {
        const posts = await MarketingPost.findAll({ where: { userId: req.user.id } });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Generate new post (Direct API call without voice)
router.post('/generate', auth, async (req, res) => {
    const { topic, platform, type } = req.body;
    try {
        let generatedData = { text: '', html: '' };
        let imageUrl = '';

        // Generate content (returns { text, html })
        generatedData = await generateMarketingText(topic, platform, type);

        if (type === 'image_ad' || type === 'product_demo') {
            imageUrl = await generateImage(topic);
        }

        // Save as draft
        // Note: We are saving the main text caption to 'content'. 
        // We currently don't have an HTML column, so we'll append it or just return it.
        // For the preview to work, we MUST return the HTML.

        const post = await MarketingPost.create({
            type: type || 'text_post',
            content: generatedData.text, // Save just the text part to DB for now
            imageUrl: imageUrl,
            status: 'draft',
            userId: req.user.id
        });

        // Return the full generated data to the frontend so preview works
        // We merge the DB object with the ephemeral HTML generated
        res.json({
            ...post.toJSON(),
            html: generatedData.html,
            text: generatedData.text // Ensure text is explicit
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
