import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
}

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const location = useLocation();

  return (
    <header style={{
      background: 'linear-gradient(135deg, #ff0050, #ff4081)',
      color: 'white',
      padding: '16px 0',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
              TikTok Publisher
            </h1>
          </div>
          
          {user && (
            <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <Link 
                to="/dashboard" 
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  backgroundColor: location.pathname === '/dashboard' ? 'rgba(255,255,255,0.2)' : 'transparent'
                }}
              >
                Дашборд
              </Link>
              <Link 
                to="/upload" 
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  backgroundColor: location.pathname === '/upload' ? 'rgba(255,255,255,0.2)' : 'transparent'
                }}
              >
                Загрузить видео
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {user.avatarUrl && (
                  <img 
                    src={user.avatarUrl} 
                    alt={user.displayName}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%'
                    }}
                  />
                )}
                <span>{user.displayName}</span>
                <button 
                  onClick={onLogout}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Выйти
                </button>
              </div>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
