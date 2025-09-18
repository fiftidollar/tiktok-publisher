import React, { useState, useEffect } from 'react';

interface DeployStatusProps {
  isVisible: boolean;
  onToggle: () => void;
}

const DeployStatus: React.FC<DeployStatusProps> = ({ isVisible, onToggle }) => {
  const [deployStatus, setDeployStatus] = useState<'checking' | 'building' | 'ready' | 'failed'>('checking');
  const [lastDeploy, setLastDeploy] = useState<string>('');
  const [buildTime, setBuildTime] = useState<number>(0);

  useEffect(() => {
    if (!isVisible) return;

    const checkDeployStatus = async () => {
      try {
        // Проверяем статус через API Vercel (если доступно)
        const response = await fetch('/api/deploy-status');
        if (response.ok) {
          const data = await response.json();
          setDeployStatus(data.status);
          setLastDeploy(data.lastDeploy);
          setBuildTime(data.buildTime);
        } else {
          // Fallback - проверяем доступность сайта
          const startTime = Date.now();
          const siteResponse = await fetch(window.location.origin);
          const endTime = Date.now();
          
          if (siteResponse.ok) {
            setDeployStatus('ready');
            setBuildTime(endTime - startTime);
          } else {
            setDeployStatus('failed');
          }
        }
      } catch (error) {
        console.error('Ошибка проверки статуса деплоя:', error);
        setDeployStatus('failed');
      }
    };

    checkDeployStatus();
    const interval = setInterval(checkDeployStatus, 30000); // Проверяем каждые 30 секунд

    return () => clearInterval(interval);
  }, [isVisible]);

  const getStatusIcon = () => {
    switch (deployStatus) {
      case 'checking': return '⏳';
      case 'building': return '🔨';
      case 'ready': return '✅';
      case 'failed': return '❌';
      default: return '❓';
    }
  };

  const getStatusText = () => {
    switch (deployStatus) {
      case 'checking': return 'Проверка статуса...';
      case 'building': return 'Сборка проекта...';
      case 'ready': return 'Сайт обновлен';
      case 'failed': return 'Ошибка деплоя';
      default: return 'Неизвестный статус';
    }
  };

  const getStatusColor = () => {
    switch (deployStatus) {
      case 'checking': return '#ffa500';
      case 'building': return '#ffa500';
      case 'ready': return '#00ff00';
      case 'failed': return '#ff0000';
      default: return '#666';
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        style={{
          position: 'fixed',
          bottom: '80px',
          right: '20px',
          background: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          cursor: 'pointer',
          fontSize: '20px',
          zIndex: 1000
        }}
        title="Статус деплоя"
      >
        🚀
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '300px',
      background: 'white',
      border: '2px solid #6c757d',
      borderRadius: '8px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        background: '#6c757d',
        color: 'white',
        padding: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{ margin: 0, fontSize: '16px' }}>🚀 Deploy Status</h3>
        <button
          onClick={onToggle}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ padding: '15px' }}>
        <div style={{ marginBottom: '15px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '8px' 
          }}>
            <span style={{ fontSize: '20px', marginRight: '8px' }}>
              {getStatusIcon()}
            </span>
            <span style={{ 
              fontWeight: 'bold',
              color: getStatusColor()
            }}>
              {getStatusText()}
            </span>
          </div>
          
          {lastDeploy && (
            <div style={{ fontSize: '12px', color: '#666' }}>
              Последний деплой: {lastDeploy}
            </div>
          )}
          
          {buildTime > 0 && (
            <div style={{ fontSize: '12px', color: '#666' }}>
              Время ответа: {buildTime}ms
            </div>
          )}
        </div>

        <div style={{ fontSize: '12px', color: '#666' }}>
          <div>🔄 Автоматическое обновление каждые 30 сек</div>
          <div>📝 Изменения в GitHub → Vercel</div>
          <div>⏱️ Время деплоя: 1-3 минуты</div>
        </div>

        <button
          onClick={() => window.location.reload()}
          style={{
            width: '100%',
            marginTop: '10px',
            padding: '8px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🔄 Обновить страницу
        </button>
      </div>
    </div>
  );
};

export default DeployStatus;


