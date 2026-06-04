import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { paymentId, txid } = req.body;
    const PI_API_KEY = process.env.PI_API_KEY;

    try {
        // إكمال المعاملة بشكل نهائي على سيرفر Pi
        await axios.post(`https://api.minepi.com/v1/payments/${paymentId}/complete`, { txid }, {
            headers: { 'Authorization': `Key ${PI_API_KEY}` }
        });
        
        // 💡 تلميح: يمكنك هنا إضافة كود لحفظ العملية في قاعدة بياناتك (مثل Supabase) لتسليم الكتاب للمستخدم
        
        return res.status(200).json({ message: 'Payment Completed successfully' });
    } catch (error) {
        console.error("Completion Error:", error.response ? error.response.data : error.message);
        return res.status(500).json({ error: 'Completion failed' });
    }
}
