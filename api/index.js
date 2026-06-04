const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// جلب المفتاح السري بأمان من إعدادات البيئة في Vercel
const PI_API_KEY = process.env.PI_API_KEY;

// المسار الأول: الموافقة على الدفع (Approval)
app.post('/api/approve', async (req, res) => {
    const { paymentId } = req.body;
    if (!paymentId) return res.status(400).json({ error: "Missing paymentId" });

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
        console.error("خطأ سيرفر باي في مرحلة الموافقة:", error.response ? error.response.data : error.message);
        return res.status(500).json({ error: "فشلت عملية موافقة السيرفر الحقيقي" });
    }
});

// المسار الثاني: التأكيد النهائي للمعاملة (Completion)
app.post('/api/complete', async (req, res) => {
    const { paymentId, txid } = req.body;
    if (!paymentId || !txid) return res.status(400).json({ error: "Missing parameters" });

    try {
        const response = await axios.post(
            `https://api.minepi.com/v2/payments/${paymentId}/complete`,
            { txid: txid },
            {
                headers: {
                    'Authorization': `Key ${PI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return res.status(200).json(response.data);
    } catch (error) {
        console.error("خطأ سيرفر باي في مرحلة التأكيد:", error.response ? error.response.data : error.message);
        return res.status(500).json({ error: "فشلت عملية تأكيد السيرفر الحقيقي" });
    }
});

module.exports = app;
