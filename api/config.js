// Vercel Serverless Function: /api/config
// API Key dibaca dari Environment Variable Vercel (bukan dari code/GitHub)
export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'https://logaritma.id');
    res.setHeader('Cache-Control', 'no-store');
    
    const apiKey = process.env.LOGARITMA_API_KEY;
    
    if (!apiKey) {
        return res.status(500).json({ error: 'API key not configured' });
    }
    
    res.status(200).json({ key: apiKey });
}
