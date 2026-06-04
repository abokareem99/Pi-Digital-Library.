const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// جلب المفتاح السري الخاص بتطبيقك من إعدادات Vercel بأمان
const PI_API_KEY = process.env.PI_API_KEY;

// 1. مسار الموافقة على الدفع (Server Approval)
app.post('/api/approve', async (req, res) => {
    const { paymentId } = req.body;

    try {
        // الاتصال بسيرفرات باي نتورك للموافقة على المعاملة
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
        
        // إرجاع رد النجاح للمتصفح ليقوم بخصم العملة من المستخدم
        return res.status(200).json(response.data);
    } catch (error) {
        console.error("خطأ في مرحلة الموافقة:", error.response ? error.response.data : error.message);
        return res.status(500).json({ error: "فشلت عملية موافقة السيرفر الحقيقي" });
    }
});

// 2. مسار التأكيد النهائي للمعاملة (Server Completion)
app.post('/api/complete', async (req, res) => {
    const { paymentId, txid } = req.body;

    try {
        // إرسال طلب إكمال المعاملة وتوثيق الـ txid الخاص بالبلوكشين
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

        // هنا يمكنك إضافة كود في السيرفر لتفعيل الكتاب للمستخدم أو حفظ المعاملة في قاعدة بياناتك
        return res.status(200).json(response.data);
    } catch (error) {
        console.error("خطأ في مرحلة التأكيد النهائي:", error.response ? error.response.data : error.message);
        return res.status(500).json({ error: "فشلت عملية تأكيد السيرفر الحقيقي" });
    }
});

module.exports = app;
