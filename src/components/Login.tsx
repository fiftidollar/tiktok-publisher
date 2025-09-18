import React, { useState } from 'react';

interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
}

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTikTokLogin = async () => {
    setLoading(true);
    setError('');

    try {
      console.log('🚀 Начинаем авторизацию через TikTok...');
      
      // Получаем URL для авторизации
      const apiUrl = process.env.REACT_APP_API_URL || window.location.origin;
      const response = await fetch(`${apiUrl}/api/auth/tiktok/url`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📱 Получен URL авторизации:', data.authUrl);
      
      // Открываем окно авторизации
      const authWindow = window.open(
        data.authUrl,
        'tiktok-auth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      // Слушаем сообщения от окна авторизации
      const messageHandler = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'TIKTOK_AUTH_SUCCESS') {
          console.log('✅ Авторизация успешна, получен код:', event.data.code);
          handleAuthCode(event.data.code);
          window.removeEventListener('message', messageHandler);
          authWindow?.close();
        } else if (event.data.type === 'TIKTOK_AUTH_ERROR') {
          console.error('❌ Ошибка авторизации:', event.data.error);
          setError(event.data.error);
          window.removeEventListener('message', messageHandler);
          authWindow?.close();
        }
      };

      window.addEventListener('message', messageHandler);
      
    } catch (err: any) {
      console.error('❌ Ошибка при получении URL авторизации:', err);
      setError(`Ошибка авторизации: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthCode = async (code: string) => {
    try {
      console.log('🔄 Обмениваем код на токен...');
      
      const apiUrl = process.env.REACT_APP_API_URL || window.location.origin;
      const response = await fetch(`${apiUrl}/api/auth/tiktok`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const tokenData = await response.json();
      console.log('🎫 Получен токен доступа:', tokenData.access_token);

      // Получаем информацию о пользователе
      const userResponse = await fetch(`${apiUrl}/api/user/info`, {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error('Не удалось получить информацию о пользователе');
      }

      const userData = await userResponse.json();
      console.log('👤 Информация о пользователе:', userData);

      const user: User = {
        id: userData.open_id || userData.id,
        username: userData.username || 'tiktok_user',
        displayName: userData.display_name || 'TikTok User',
        avatarUrl: userData.avatar_url
      };

      onLogin(user);
      
    } catch (err: any) {
      console.error('❌ Ошибка при обмене кода на токен:', err);
      setError(`Ошибка авторизации: ${err.message}`);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>
        Вход в TikTok Publisher
      </h2>
      
      {error && (
        <div className="status error">
          {error}
        </div>
      )}

      <div style={{ textAlign: 'center' }}>
        <p style={{ marginBottom: '30px', color: '#666' }}>
          Войдите через свой аккаунт TikTok для публикации контента
        </p>
        
        <button
          className="btn"
          onClick={handleTikTokLogin}
          disabled={loading}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}
        >
          {loading ? (
            'Загрузка...'
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.05-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
              Войти через TikTok
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Login;
