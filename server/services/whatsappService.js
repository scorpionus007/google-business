// Simulated WhatsApp Service based on Meta Graph API v24.0

async function sendTemplateMessage(to, templateName, languageCode, components) {
    // In a real implementation, this would make a fetch/axios call to:
    // https://graph.facebook.com/v24.0/${PHONE_NUMBER_ID}/messages

    console.log("--- SIMULATING WHATSAPP MESSAGE SEND ---");
    console.log(`To: ${to}`);
    console.log(`Template: ${templateName} (${languageCode})`);
    console.log("Components:", JSON.stringify(components, null, 2));

    // Simulate Network Delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Return success structure based on documentation
    return {
        messaging_product: "whatsapp",
        contacts: [
            {
                input: to,
                wa_id: to
            }
        ],
        messages: [
            {
                id: `wamid.HBgL${Date.now()}VAgARGBJBRkJENzEx`,
                message_status: "accepted"
            }
        ]
    };
}

async function sendBill(to, billDetails) {
    // Construct a Utility Template payload for a bill
    // Template: "bill_notification" (hypothetical)

    const components = [
        {
            type: "body",
            parameters: [
                { type: "text", parameter_name: "customer_name", text: billDetails.customerName },
                { type: "text", parameter_name: "amount", text: `$${billDetails.amount}` },
                { type: "text", parameter_name: "date", text: new Date().toLocaleDateString() }
            ]
        },
        {
            type: "button",
            sub_type: "url",
            index: "0",
            parameters: [
                { type: "text", text: "view_bill" } // Dynamic suffix if needed
            ]
        }
    ];

    return await sendTemplateMessage(to, "bill_notification", "en_US", components);
}

async function sendPromotionalMessage(to, promoDetails) {
    // Construct a Marketing Template payload
    // Template: "seasonal_promo"

    const components = [
        {
            type: "header",
            parameters: [
                { type: "image", image: { link: promoDetails.imageUrl || "https://example.com/default.jpg" } }
            ]
        },
        {
            type: "body",
            parameters: [
                { type: "text", parameter_name: "customer_name", text: "Valued Customer" },
                { type: "text", parameter_name: "promo_text", text: promoDetails.text }
            ]
        }
    ];

    return await sendTemplateMessage(to, "seasonal_promo", "en_US", components);
}

module.exports = {
    sendTemplateMessage,
    sendBill,
    sendPromotionalMessage
};
