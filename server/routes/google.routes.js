const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const googleService = require('../services/googleBusinessService');

// Get Audit Score
router.get('/audit', auth, async (req, res) => {
    try {
        const { name, url, category } = req.query;
        const audit = await googleService.getBusinessAudit(req.user.id, { name, url, category });
        res.json(audit);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Reviews
router.get('/reviews', auth, async (req, res) => {
    try {
        const reviews = await googleService.getReviews(req.user.id);
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Generate AI Reply
router.post('/reviews/generate-reply', auth, async (req, res) => {
    const { reviewText, rating } = req.body;
    try {
        const reply = await googleService.generateReviewReply(reviewText, rating);
        res.json({ reply });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Post Reply (Simulated)
router.post('/reviews/:id/reply', auth, async (req, res) => {
    const { replyText } = req.body;
    try {
        const result = await googleService.postReply(req.user.id, req.params.id, replyText);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
