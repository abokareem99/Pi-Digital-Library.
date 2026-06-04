export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    
    const { paymentId } = req.body;
    const PI_API_KEY = process.env.PI_API_KEY;

    try {
        // استخدام fetch المدمج في السيرفر بدلاً من axios
        const response = await fetch(`https://api.minepi.com/v1/payments/${paymentId}/approve`, {
            method: 'POST',
            headers: { 
                'Authorization': `Key ${PI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: 'فشلت موافقة سيرفر باي الرئيسي' });
        }
        
        return res.status(200).json({ message: 'Payment Approved on Server' });
    } catch (error) {
        console.error("Approval Error:", error.message);
        return res.status(500).json({ error: error.message });
    }
}
