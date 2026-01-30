const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { Product, Bill, MarketingPost } = require('../models/associations');
const sequelize = require('../config/database');

// Get Dashboard Stats
router.get('/stats', auth, async (req, res) => {
    try {
        const userId = req.user.id;

        // Count Products
        const productCount = await Product.count({ where: { userId } });

        // Calculate Total Sales (sum of Bill totalAmount)
        const totalSalesResult = await Bill.sum('totalAmount', { where: { userId } });
        const totalSales = totalSalesResult || 0;

        // Calculate Customers (unique customer names from Bills)
        const uniqueCustomers = await Bill.count({
            where: { userId },
            distinct: true,
            col: 'customerName'
        });

        // Get recent Quick Actions status (example: check low stock, pending posts)
        const lowStockCount = await Product.count({
            where: {
                userId,
                stock: { [sequelize.Sequelize.Op.lt]: 10 } // Less than 10 stock
            }
        });

        const draftPosts = await MarketingPost.count({
            where: { userId, status: 'draft' }
        });

        res.json({
            sales: {
                total: totalSales,
                trend: "+12%" // Placeholder for now, could be calculated if we had dates
            },
            customers: {
                total: uniqueCustomers,
                trend: "+5%"
            },
            inventory: {
                count: productCount,
                lowStock: lowStockCount
            },
            marketing: {
                drafts: draftPosts
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
