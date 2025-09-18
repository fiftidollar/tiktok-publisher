import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('🔄 Обрабатываем callback от TikTok...');
        
        // Получаем параметры из URL
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const state = searchParams.get('state');

        console.log('📋 Параметры callback:', { code, error, state });

        if (error) {
          console.error('❌ Ошибка от TikTok:', error);
          setError(`Ошибка авторизации: ${error}`);
          setStatus('error');
          return;
        }

        if (!code) {
          console.error('❌ Код авторизации не получен');
          setError('Код авторизации не получен');
          setStatus('error');
          return;
        }

        console.log('✅ Получен код авторизации:', code);

        // Отправляем код родительскому окну
        if (window.opener) {
          window.opener.postMessage({
            type: 'TIKTOK_AUTH_SUCCESS',
            code: code,
            state: state
          }, window.location.origin);
          
          console.log('📤 Код отправлен родительскому окну');
          window.close();
        } else {
          console.error('❌ Родительское окно не найдено');
          setError('Ошибка: родительское окно не найдено');
          setStatus('error');
        }

      } catch (err: any) {
        console.error('❌ Ошибка при обработке callback:', err);
        setError(`Ошибка: ${err.message}`);
        setStatus('error');
        
        if (window.opener) {
          window.opener.postMessage({
            type: 'TIKTOK_AUTH_ERROR',
            error: err.message
          }, window.location.origin);
        }
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  if (status === 'loading') {
    return (
      <div className="card" style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
        <h2>🔄 Обработка авторизации...</h2>
        <p>Пожалуйста, подождите...</p>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #ff0050',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '20px auto'
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="card" style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
        <h2 style={{ color: '#ff0050' }}>❌ Ошибка авторизации</h2>
        <p>{error}</p>
        <button 
          onClick={() => window.close()}
          className="btn"
        >
          Закрыть окно
        </button>
      </div>
    );
  }

  return (
    <div className="card" style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      <h2 style={{ color: 'green' }}>✅ Авторизация успешна!</h2>
      <p>Окно закроется автоматически...</p>
    </div>
  );
};

export default AuthCallback;
