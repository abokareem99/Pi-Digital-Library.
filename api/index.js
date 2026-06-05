const express = require('express');
const app = express();

app.use(express.json());

// دالة مساعدة لتجهيز مفتاح API لضمان عدم وجود أخطاء في النص
function getAuthHeader() {
    const key = process.env.PI_API_KEY || "";
    if (!key) throw new Error("مفتاح PI_API_KEY مفقود من متغيرات البيئة");
    return key.startsWith('Key ') ? key : `Key ${key}`;
}

// 1. مسار الموافقة الفورية (Approve)
app.post('/api/approve', async (req, res) => {
    const { paymentId } = req.body;
    if (!paymentId) return res.status(400).json({ error: "Missing paymentId" });

    try {
        const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
            method: 'POST',
            headers: {
                'Authorization': getAuthHeader(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({}) // مهم جداً: إرسال Body فارغ لتجنب رفض السيرفر للـ POST
        });

        const text = await response.text();
        let data;
        try { data = JSON.parse(text); } catch (e) { data = { message: text }; }
        
        if (!response.ok) {
            console.error("خطأ من سيرفر باي الرئيسي أثناء الموافقة:", data);
            return res.status(response.status).json(data);
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error("خطأ شبكة في مسار الموافقة:", error.message);
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
                'Authorization': getAuthHeader(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ txid })
        });

        const text = await response.text();
        let data;
        try { data = JSON.parse(text); } catch (e) { data = { message: text }; }

        if (!response.ok) {
            console.error("خطأ من سيرفر باي الرئيسي أثناء الإكمال:", data);
            return res.status(response.status).json(data);
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error("خطأ شبكة في مسار الإكمال:", error.message);
        return res.status(500).json({ error: "فشل السيرفر في تأكيد المعاملة نهائياً" });
    }
});

module.exports = app;
