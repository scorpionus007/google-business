const express = require('express');
const router = express.Router();
const MarketingPost = require('../models/MarketingPost');
const { generateMarketingText } = require('../services/geminiService');

// Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await MarketingPost.findAll();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Generate new post (Direct API call without voice)
router.post('/generate', async (req, res) => {
    const { topic, platform, type } = req.body;
    try {
        const content = await generateMarketingText(topic, platform, type);
        // Optionally save it as draft
        const post = await MarketingPost.create({
            type: type || 'text_post',
            content: content,
            status: 'draft'
        });
        res.json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
