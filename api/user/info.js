export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const accessToken = authHeader.split(' ')[1];
    console.log('👤 Getting user info for token:', accessToken.substring(0, 10) + '...');

    const response = await fetch('https://open-api.tiktok.com/user/info/', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      params: {
        fields: 'open_id,union_id,avatar_url,display_name,username'
      }
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ Failed to get user info:', errorData);
      throw new Error(`Failed to get user info: ${response.status}`);
    }

    const userData = await response.json();
    console.log('✅ User info retrieved successfully');

    if (userData.error) {
      throw new Error(userData.error.message || 'Failed to get user info');
    }

    res.status(200).json(userData.data.user);

  } catch (error) {
    console.error('❌ Error getting user info:', error);
    res.status(500).json({ 
      error: 'Failed to get user information',
      details: error.message 
    });
  }
}
