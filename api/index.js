const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const PI_API_KEY = process.env.PI_API_KEY;

// مسار الموافقة
app.post('/api/approve', async (req, res) => {
    const { paymentId } = req.body;
    try {
        const response = await axios.post(
            `https://api.minepi.com/v2/payments/${paymentId}/approve`,
            {},
            {
                headers: {
                    'Authorization': `Key ${PI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return res.status(200).json(response.data);
    } catch (error) {
        console.error("خطأ في Approve:", error.response ? error.response.data : error.message);
        return res.status(500).json({ error: "فشل سيرفر التطبيق في الموافقة" });
    }
});

// مسار الإكمال
app.post('/api/complete', async (req, res) => {
    const { paymentId, txid } = req.body;
    try {
        const response = await axios.post(
            `https://api.minepi.com/v2/payments/${paymentId}/complete`,
            { txid },
            {
                headers: {
                    'Authorization': `Key ${PI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return res.status(200).json(response.data);
    } catch (error) {
        console.error("خطأ في Complete:", error.response ? error.response.data : error.message);
        return res.status(500).json({ error: "فشل سيرفر التطبيق في التأكيد" });
    }
});

// تصدير التطبيق ليعمل كـ Serverless Function على Vercel
module.exports = app;
