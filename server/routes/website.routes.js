const express = require('express');
const router = express.Router();
const { generateWebsiteCode } = require('../services/geminiService');
const auth = require('../middleware/authMiddleware');

// Generate Website
router.post('/generate', auth, async (req, res) => {
    const { description } = req.body;
    if (!description) {
        return res.status(400).json({ error: 'Description is required' });
    }

    try {
        const html = await generateWebsiteCode(description);
        res.json({ html });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to generate website' });
    }
});

module.exports = router;
