export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { paymentId, txid } = req.body;
    const PI_API_KEY = process.env.PI_API_KEY;

    try {
        // استخدام fetch المدمج في السيرفر بدلاً من axios
        const response = await fetch(`https://api.minepi.com/v1/payments/${paymentId}/complete`, {
            method: 'POST',
            headers: { 
                'Authorization': `Key ${PI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ txid })
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: 'فشل تأكيد سيرفر باي الرئيسي' });
        }
        
        return res.status(200).json({ message: 'Payment Completed successfully' });
    } catch (error) {
        console.error("Completion Error:", error.message);
        return res.status(500).json({ error: error.message });
    }
}
