import React from 'react';
import { Link } from 'react-router-dom';

interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
}

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  return (
    <div>
      <div className="card">
        <h2>Добро пожаловать, {user.displayName}!</h2>
        <p>Выберите действие для работы с TikTok:</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        <div className="card">
          <h3>📹 Загрузить видео</h3>
          <p>Загрузите видео файл и опубликуйте его в TikTok</p>
          <Link to="/upload" className="btn">
            Загрузить видео
          </Link>
        </div>

        <div className="card">
          <h3>🔗 API Документация</h3>
          <p>Используйте наш API для автоматической публикации контента</p>
          <div style={{ marginTop: '20px' }}>
            <h4>Пример запроса:</h4>
            <pre style={{ 
              background: '#f5f5f5', 
              padding: '15px', 
              borderRadius: '6px',
              overflow: 'auto',
              fontSize: '14px'
            }}>
{`POST /api/publish
Content-Type: application/json
Authorization: Bearer YOUR_API_TOKEN

{
  "video_url": "https://example.com/video.mp4",
  "description": "Описание видео",
  "privacy_level": "PUBLIC_TO_EVERYONE"
}`}
            </pre>
          </div>
        </div>

        <div className="card">
          <h3>📊 Статистика</h3>
          <p>Просмотрите статистику ваших публикаций</p>
          <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>Опубликовано видео:</span>
              <strong>0</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>В очереди:</span>
              <strong>0</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Ошибок:</span>
              <strong>0</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


