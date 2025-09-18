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
      console.log('🚀 Начинаем авторизацию через TikTok Login Kit...');
      
      // Используем TikTok Login Kit согласно документации
      const CLIENT_KEY = 'sbawc39rewr05919uc';
      const REDIRECT_URI = `${window.location.origin}/auth/callback`;
      
      // Создаем URL для TikTok Login Kit согласно документации
      const authUrl = `https://open-api.tiktok.com/oauth/authorize/` +
        `?client_key=${CLIENT_KEY}` +
        `&scope=user.info.basic,video.publish` +
        `&response_type=code` +
        `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
        `&state=${Date.now()}`;
      
      console.log('📱 TikTok Login Kit URL:', authUrl);
      console.log('🔗 Redirect URI:', REDIRECT_URI);
      console.log('🔑 Client Key:', CLIENT_KEY);
      
      // Открываем окно авторизации
      const authWindow = window.open(
        authUrl,
        'tiktok-auth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      if (!authWindow) {
        throw new Error('Не удалось открыть окно авторизации. Проверьте блокировщик всплывающих окон.');
      }

      console.log('🪟 Окно авторизации открыто');

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

      // Таймаут для окна авторизации
      const timeout = setTimeout(() => {
        console.log('⏰ Таймаут авторизации');
        authWindow.close();
        window.removeEventListener('message', messageHandler);
        setError('Время ожидания авторизации истекло. Попробуйте еще раз.');
        setLoading(false);
      }, 300000); // 5 минут

      // Очищаем таймаут при успешной авторизации
      const originalMessageHandler = messageHandler;
      window.addEventListener('message', (event) => {
        if (event.data.type === 'TIKTOK_AUTH_SUCCESS' || event.data.type === 'TIKTOK_AUTH_ERROR') {
          clearTimeout(timeout);
        }
        originalMessageHandler(event);
      });
      
    } catch (err: any) {
      console.error('❌ Ошибка при авторизации:', err);
      setError(`Ошибка авторизации: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthCode = async (code: string) => {
    try {
      console.log('🔄 Обмениваем код на токен через TikTok API...');
      
      // Используем правильный endpoint согласно документации
      const CLIENT_KEY = 'sbawc39rewr05919uc';
      const CLIENT_SECRET = 'ESMTUZ3ELmCzsfsqwzroyDU0krxwVnFe';
      const REDIRECT_URI = `${window.location.origin}/auth/callback`;
      
      // Обмен кода на токен согласно документации TikTok
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
        console.error('❌ Ошибка обмена токена:', errorData);
        throw new Error(`Ошибка обмена токена: ${tokenResponse.status} - ${errorData}`);
      }

      const tokenData = await tokenResponse.json();
      console.log('🎫 Ответ от TikTok API:', tokenData);

      if (tokenData.error) {
        throw new Error(tokenData.error.message || 'Ошибка обмена токена');
      }

      if (!tokenData.data || !tokenData.data.access_token) {
        throw new Error('Не получен access_token от TikTok');
      }

      const accessToken = tokenData.data.access_token;
      console.log('✅ Токен получен успешно');

      // Получаем информацию о пользователе через Display API
      const userResponse = await fetch('https://open-api.tiktok.com/user/info/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!userResponse.ok) {
        const errorData = await userResponse.text();
        console.error('❌ Ошибка получения информации о пользователе:', errorData);
        throw new Error(`Не удалось получить информацию о пользователе: ${userResponse.status}`);
      }

      const userData = await userResponse.json();
      console.log('👤 Информация о пользователе:', userData);

      if (userData.error) {
        throw new Error(userData.error.message || 'Ошибка получения информации о пользователе');
      }

      if (!userData.data || !userData.data.user) {
        throw new Error('Не получена информация о пользователе');
      }

      const user: User = {
        id: userData.data.user.open_id || userData.data.user.id,
        username: userData.data.user.username || 'tiktok_user',
        displayName: userData.data.user.display_name || 'TikTok User',
        avatarUrl: userData.data.user.avatar_url
      };

      // Сохраняем токен для дальнейшего использования
      localStorage.setItem('tiktok_access_token', accessToken);
      localStorage.setItem('tiktok_user_data', JSON.stringify(user));
      
      console.log('✅ Пользователь авторизован:', user);
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
