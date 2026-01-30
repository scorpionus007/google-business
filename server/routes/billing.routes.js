const express = require('express');
const router = express.Router();
const Bill = require('../models/Bill');
const auth = require('../middleware/authMiddleware');

// Get all bills for user
router.get('/', auth, async (req, res) => {
    try {
        const bills = await Bill.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']]
        });
        res.json(bills);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;
