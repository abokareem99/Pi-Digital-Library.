const express = require('express');
const app = express();

app.use(express.json());

const PI_API_KEY = process.env.PI_API_KEY;

// 1. مسار الموافقة الفورية (Approve)
app.post('/api/approve', async (req, res) => {
    const { paymentId } = req.body;
    if (!paymentId) return res.status(400).json({ error: "Missing paymentId" });

    try {
        // استخدام fetch المدمج لسرعة استجابة السيرفر وتفادي حظر جدار حماية باي
        const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
            method: 'POST',
            headers: {
                'Authorization': `Key ${PI_API_KEY}`,
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (PiNetwork)'
            }
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error("خطأ من سيرفر باي الرئيسي:", data);
            return res.status(response.status).json(data);
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error("خطأ في الاتصال بالشبكة:", error.message);
        return res.status(500).json({ error: "فشل السيرفر في معالجة الموافقة الحقيقية" });
    }
});

// 2. مسار الإكمال الفوري التلقائي (Complete)
app.post('/api/complete', async (req, res) => {
    const { paymentId, txid } = req.body;
    if (!paymentId || !txid) return res.status(400).json({ error: "Missing parameters" });

    try {
        const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
            method: 'POST',
            headers: {
                'Authorization': `Key ${PI_API_KEY}`,
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (PiNetwork)'
            },
            body: JSON.stringify({ txid })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("خطأ إكمال من سيرفر باي الرئيسي:", data);
            return res.status(response.status).json(data);
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error("خطأ إكمال في الاتصال بالشبكة:", error.message);
        return res.status(500).json({ error: "فشل السيرفر في تأكيد المعاملة نهائياً" });
    }
});

module.exports = app;
