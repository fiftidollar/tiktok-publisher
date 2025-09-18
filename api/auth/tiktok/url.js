export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY;
    const REDIRECT_URI = process.env.TIKTOK_REDIRECT_URI || 'https://tiktok-publisher-35jl.vercel.app/auth/callback';

    if (!CLIENT_KEY) {
      return res.status(500).json({ error: 'TikTok Client Key not configured' });
    }

    const authUrl = `https://open-api.tiktok.com/oauth/authorize/` +
      `?client_key=${CLIENT_KEY}` +
      `&scope=user.info.basic,video.publish` +
      `&response_type=code` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      `&state=${Date.now()}`;

    console.log('🔗 Generated TikTok auth URL:', authUrl);

    res.status(200).json({ authUrl });
  } catch (error) {
    console.error('❌ Error generating auth URL:', error);
    res.status(500).json({ 
      error: 'Failed to generate authorization URL',
      details: error.message 
    });
  }
}
