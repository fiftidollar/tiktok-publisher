export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code } = req.body;
    const CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY;
    const CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET;
    const REDIRECT_URI = process.env.TIKTOK_REDIRECT_URI || 'https://tiktok-publisher-35jl.vercel.app/auth/callback';

    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    if (!CLIENT_KEY || !CLIENT_SECRET) {
      return res.status(500).json({ error: 'TikTok API credentials not configured' });
    }

    console.log('🔄 Exchanging code for token:', code);

    // Exchange code for access token
    const tokenResponse = await fetch('https://open-api.tiktok.com/oauth/access_token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_key: CLIENT_KEY,
        client_secret: CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI
      })
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('❌ Token exchange failed:', errorData);
      throw new Error(`Token exchange failed: ${tokenResponse.status}`);
    }

    const tokenData = await tokenResponse.json();
    console.log('✅ Token exchange successful');

    if (tokenData.error) {
      throw new Error(tokenData.error.message || 'Token exchange failed');
    }

    res.status(200).json({
      access_token: tokenData.data.access_token,
      expires_in: tokenData.data.expires_in,
      scope: tokenData.data.scope
    });

  } catch (error) {
    console.error('❌ Error in token exchange:', error);
    res.status(500).json({ 
      error: 'Failed to exchange authorization code',
      details: error.message 
    });
  }
}
