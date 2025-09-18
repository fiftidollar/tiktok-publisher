export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    tiktok_configured: !!(process.env.TIKTOK_CLIENT_KEY && process.env.TIKTOK_CLIENT_SECRET),
    vercel_region: process.env.VERCEL_REGION || 'unknown'
  };

  console.log('🏥 Health check:', health);

  res.status(200).json(health);
}
