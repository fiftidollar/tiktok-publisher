import React, { useState, useEffect } from 'react';

interface DebugPanelProps {
  isVisible: boolean;
  onToggle: () => void;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ isVisible, onToggle }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    // Перехватываем console.log для отображения в панели
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = (...args) => {
      setLogs(prev => [...prev.slice(-49), `[LOG] ${new Date().toLocaleTimeString()}: ${args.join(' ')}`]);
      originalLog(...args);
    };

    console.error = (...args) => {
      setLogs(prev => [...prev.slice(-49), `[ERROR] ${new Date().toLocaleTimeString()}: ${args.join(' ')}`]);
      originalError(...args);
    };

    console.warn = (...args) => {
      setLogs(prev => [...prev.slice(-49), `[WARN] ${new Date().toLocaleTimeString()}: ${args.join(' ')}`]);
      originalWarn(...args);
    };

    // Проверяем статус API
    checkApiStatus();

    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  const checkApiStatus = async () => {
    try {
      // Проверяем доступность TikTok API согласно документации
      const response = await fetch('https://open-api.tiktok.com/oauth/authorize/', {
        method: 'HEAD'
      });
      setApiStatus(response.ok ? 'online' : 'offline');
    } catch {
      setApiStatus('offline');
    }
  };

  const clearLogs = () => setLogs([]);

  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: '#ff0050',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          cursor: 'pointer',
          fontSize: '20px',
          zIndex: 1000
        }}
        title="Открыть панель отладки"
      >
        🐛
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '400px',
      height: '300px',
      background: 'white',
      border: '2px solid #ff0050',
      borderRadius: '8px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        background: '#ff0050',
        color: 'white',
        padding: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{ margin: 0, fontSize: '16px' }}>🐛 Debug Panel</h3>
        <div>
          <button
            onClick={clearLogs}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '8px'
            }}
          >
            Очистить
          </button>
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
      </div>

      <div style={{
        padding: '10px',
        flex: 1,
        overflow: 'auto',
        fontSize: '12px',
        fontFamily: 'monospace'
      }}>
        <div style={{ marginBottom: '10px' }}>
          <strong>API Status:</strong> 
          <span style={{ 
            color: apiStatus === 'online' ? 'green' : apiStatus === 'offline' ? 'red' : 'orange',
            marginLeft: '5px'
          }}>
            {apiStatus === 'online' ? '✅ Online' : apiStatus === 'offline' ? '❌ Offline' : '⏳ Checking...'}
          </span>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <strong>Environment:</strong> {process.env.NODE_ENV || 'development'}
        </div>

        <div style={{ marginBottom: '10px' }}>
          <strong>TikTok API:</strong> https://open-api.tiktok.com
        </div>

        <div style={{ marginBottom: '10px' }}>
          <strong>Logs:</strong>
        </div>

        <div style={{
          background: '#f5f5f5',
          padding: '8px',
          borderRadius: '4px',
          maxHeight: '150px',
          overflow: 'auto',
          fontSize: '11px'
        }}>
          {logs.length === 0 ? (
            <div style={{ color: '#666' }}>Нет логов</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} style={{
                marginBottom: '2px',
                color: log.includes('[ERROR]') ? 'red' : log.includes('[WARN]') ? 'orange' : 'black'
              }}>
                {log}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DebugPanel;


