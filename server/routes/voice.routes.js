const express = require('express');
const router = express.Router();
const { parseVoiceIntent, generateMarketingText, generateImage } = require('../services/geminiService');
const Product = require('../models/Product');
const Bill = require('../models/Bill');
const MarketingPost = require('../models/MarketingPost'); // Make sure to require this
const auth = require('../middleware/authMiddleware');

router.post('/process', auth, async (req, res) => {
    const { transcript } = req.body;

    if (!transcript) return res.status(400).json({ error: 'No transcript provided' });

    // 1. Get Intent from Gemini
    const aiResponse = await parseVoiceIntent(transcript);
    console.log("AI Parsed Intent:", aiResponse);

    const { intent, entities } = aiResponse;

    let result = {};
    let responseMessage = "I didn't understand that."; // Initialize response message

    try {
        // 2. Execute Action based on Intent
        switch (intent) {
            case 'ADD_PRODUCT':
                const { name, price, stock, category } = entities;
                if (!name) {
                    responseMessage = "Please specify the product name.";
                    break;
                }
                const newProduct = await Product.create({
                    name,
                    price: price || 0,
                    stock: stock || 1, // Default stock to 1 if not provided
                    category: category || 'General', // Fallback to 'General'
                    imageUrl: '',
                    userId: req.user.id
                });
                responseMessage = `Added ${newProduct.name} to inventory.`;
                result = { message: responseMessage, data: newProduct };
                break;

            case 'AMBIGUOUS':
                responseMessage = aiResponse.entities.response_text || "Could you be more specific?";
                break;

            case 'OFF_TOPIC':
                responseMessage = aiResponse.entities.response_text || "I focus only on your business usage.";
                break;

            case 'CHECK_STOCK':
                // Fuzzy search or exact. Filtering by userId
                const product = await Product.findOne({ where: { name: entities.product_name, userId: req.user.id } });
                if (product) {
                    result = { message: `${product.name} has ${product.stock} items in stock.` };
                } else {
                    result = { message: `Could not find product ${entities.product_name}.` };
                }
                break;

            case 'MARKETING_TEXT':
                const adCopy = await generateMarketingText(entities.topic, entities.platform || 'General', entities.type || 'Offer');
                // Save to DB (Content field is text-only for now)
                await MarketingPost.create({
                    type: 'text_post',
                    content: adCopy.text,
                    status: 'draft',
                    userId: req.user.id
                });
                // Return full rich object (text + html)
                result = { message: "Generated marketing content.", data: adCopy, type: 'marketing_text' };
                break;

            case 'MARKETING_IMAGE':
                const imgDescription = entities.description || "Product image";
                const imgUrl = await generateImage(imgDescription);
                await MarketingPost.create({
                    type: 'image_ad',
                    imageUrl: imgUrl,
                    status: 'draft',
                    userId: req.user.id
                });
                result = { message: "Generated marketing image.", data: imgUrl, type: 'marketing_image' };
                break;

            case 'CREATE_BILL':
                // entities.items might be [{name: 'x', qty: 2}]
                const billItems = entities.items || [];
                let total = 0;
                let stockUpdates = [];

                for (const item of billItems) {
                    // Try to find product to get price and manage stock
                    const product = await Product.findOne({ where: { name: item.name, userId: req.user.id } });

                    if (product) {
                        item.price = product.price; // Use real price

                        // Check Stock
                        if (product.stock < (item.qty || 1)) {
                            // Option: Warn but allow? Or Block? Let's allow and warn in message
                            // For this MVP, we just decrement into negative to show deficit
                        }

                        // Prepare stock update
                        stockUpdates.push(product.decrement('stock', { by: item.qty || 1 }));
                    } else {
                        if (!item.price) item.price = 10; // Default mock price if not found
                    }

                    total += item.price * (item.qty || 1);
                }

                // Execute all stock updates
                await Promise.all(stockUpdates);

                const newBill = await Bill.create({
                    customerName: "Walk-in Customer",
                    items: billItems,
                    totalAmount: total,
                    pdfUrl: "generated_bill_101.pdf", // Placeholder
                    userId: req.user.id
                });

                const stockWarning = stockUpdates.length < billItems.length ? " (Some items not in inventory)" : "";

                result = {
                    message: `Created bill for ${billItems.length} items. Total is ₹${total}.${stockWarning}`,
                    data: newBill,
                    entities: { ...entities, total } // Pass back total for UI
                };
                break;

            default:
                result = { message: "I understood: " + intent + ", but I don't know how to handle it yet.", raw: aiResponse };
        }

        res.json({ ...result, intent });

    } catch (err) {
        console.error("Action Error:", err);
        res.status(500).json({ error: "Failed to execute action", details: err.message });
    }
});

module.exports = router;
