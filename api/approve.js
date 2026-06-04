import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    
    const { paymentId } = req.body;
    const PI_API_KEY = process.env.PI_API_KEY; // يتم تعريفه في متغيرات البيئة (Environment Variables)

    try {
        // إخطار سيرفر Pi بالموافقة على بدء الدفع
        await axios.post(`https://api.minepi.com/v1/payments/${paymentId}/approve`, {}, {
            headers: { 'Authorization': `Key ${PI_API_KEY}` }
        });
        
        return res.status(200).json({ message: 'Payment Approved on Server' });
    } catch (error) {
        console.error("Approval Error:", error.response ? error.response.data : error.message);
        return res.status(500).json({ error: 'Approval failed' });
    }
}
