const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

const auth = require('../middleware/authMiddleware');

// Get all products
router.get('/', auth, async (req, res) => {
    try {
        const products = await Product.findAll({ where: { userId: req.user.id } });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add product
router.post('/', auth, async (req, res) => {
    try {
        const { name, category, price, stock, description } = req.body;
        const product = await Product.create({
            name,
            category,
            price,
            stock,
            description,
            userId: req.user.id
        });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
