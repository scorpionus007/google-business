const express = require('express');
const router = express.Router();
const { parseVoiceIntent, generateMarketingText } = require('../services/geminiService');
const Product = require('../models/Product');
const Bill = require('../models/Bill');

router.post('/process', async (req, res) => {
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
                    imageUrl: ''
                });
                responseMessage = `Added ${newProduct.name} to inventory.`;
                result = { message: responseMessage, data: newProduct };
                break;

            case 'OFF_TOPIC':
                responseMessage = aiResponse.entities.response_text || "I focus only on your business usage.";
                break;

            case 'CHECK_STOCK':
                // Fuzzy search or exact
                const product = await Product.findOne({ where: { name: entities.product_name } });
                if (product) {
                    result = { message: `${product.name} has ${product.stock} items in stock.` };
                } else {
                    result = { message: `Could not find product ${entities.product_name}.` };
                }
                break;

            case 'MARKETING_TEXT':
                const adCopy = await generateMarketingText(entities.topic, entities.platform || 'General', entities.type || 'Offer');
                result = { message: "Generated marketing content.", data: adCopy, type: 'marketing_text' };
                break;

            case 'CREATE_BILL':
                // entities.items might be [{name: 'x', qty: 2}]
                // Real app would fetch prices from DB. Here we mock or trust entities if price missing
                const billItems = entities.items || [];
                let total = 0;
                // Simple mock calculation
                billItems.forEach(item => {
                    if (!item.price) item.price = 10; // Default mock price
                    total += item.price * (item.qty || 1);
                });

                const newBill = await Bill.create({
                    customerName: "Walk-in Customer",
                    items: billItems,
                    totalAmount: total,
                    pdfUrl: "generated_bill_101.pdf" // Placeholder
                });

                result = {
                    message: `Created bill for ${billItems.length} items. Total is ${total}.`,
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
