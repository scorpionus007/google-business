const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
    try {
        // req.body should include username, password, businessName, category
        const user = await User.create(req.body);
        res.json({ message: 'User created', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login (Mock)
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (user && user.password === password) {
        res.json({ message: 'Login successful', user });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

module.exports = router;
