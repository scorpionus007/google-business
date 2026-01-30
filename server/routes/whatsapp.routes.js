const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const whatsappService = require('../services/whatsappService');

// Send Bill via WhatsApp
router.post('/send-bill', auth, async (req, res) => {
    const { phone, billDetails } = req.body;
    try {
        const result = await whatsappService.sendBill(phone, billDetails);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Send Promo via WhatsApp
router.post('/send-promo', auth, async (req, res) => {
    const { phone, promoDetails } = req.body;
    try {
        const result = await whatsappService.sendPromotionalMessage(phone, promoDetails);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
