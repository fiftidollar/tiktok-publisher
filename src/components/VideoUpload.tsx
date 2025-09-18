import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
}

interface VideoUploadProps {
  user: User;
}

const VideoUpload: React.FC<VideoUploadProps> = ({ user }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [privacyLevel, setPrivacyLevel] = useState('PUBLIC_TO_EVERYONE');
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        setSelectedFile(file);
        setStatus(null);
      } else {
        setStatus({ type: 'error', message: 'Пожалуйста, выберите видео файл' });
      }
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
      setStatus(null);
    } else {
      setStatus({ type: 'error', message: 'Пожалуйста, перетащите видео файл' });
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setStatus({ type: 'error', message: 'Пожалуйста, выберите видео файл' });
      return;
    }

    setUploading(true);
    setStatus({ type: 'info', message: 'Загрузка видео через TikTok Content Posting API...' });

    try {
      console.log('🚀 Начинаем загрузку видео в TikTok...');
      
      // Получаем токен из localStorage
      const accessToken = localStorage.getItem('tiktok_access_token');
      if (!accessToken) {
        throw new Error('Токен доступа не найден. Пожалуйста, авторизуйтесь заново.');
      }

      // Создаем FormData для загрузки
      const formData = new FormData();
      formData.append('video', selectedFile);
      formData.append('description', description || '');
      formData.append('privacy_level', privacyLevel);

      console.log('📤 Отправляем видео в TikTok...');

      // Загружаем видео через Content Posting API
      const uploadResponse = await fetch('https://open-api.tiktok.com/share/video/upload/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: formData
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.text();
        console.error('❌ Ошибка загрузки видео:', errorData);
        throw new Error(`Ошибка загрузки: ${uploadResponse.status} - ${errorData}`);
      }

      const uploadData = await uploadResponse.json();
      console.log('📹 Ответ от TikTok:', uploadData);

      if (uploadData.error) {
        throw new Error(uploadData.error.message || 'Ошибка загрузки видео');
      }

      if (!uploadData.data || !uploadData.data.video_id) {
        throw new Error('Не получен video_id от TikTok');
      }

      const videoId = uploadData.data.video_id;
      console.log('✅ Видео загружено успешно, ID:', videoId);

      setStatus({ 
        type: 'success', 
        message: `Видео успешно загружено в TikTok! ID: ${videoId}` 
      });
      
      // Сбрасываем форму
      setSelectedFile(null);
      setDescription('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      console.error('❌ Ошибка при загрузке видео:', error);
      setStatus({ 
        type: 'error', 
        message: `Ошибка при загрузке видео: ${error.message}` 
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <Link to="/dashboard" style={{ marginRight: '20px', color: '#ff0050' }}>
            ← Назад к дашборду
          </Link>
          <h2>Загрузка видео в TikTok</h2>
        </div>

        {status && (
          <div className={`status ${status.type}`}>
            {status.message}
          </div>
        )}

        <div className="form-group">
          <label>Выберите видео файл:</label>
          <div
            className={`file-upload ${selectedFile ? 'has-file' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            {selectedFile ? (
              <div>
                <p>✅ Выбран файл: {selectedFile.name}</p>
                <p>Размер: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  style={{
                    background: 'none',
                    border: '1px solid #ff0050',
                    color: '#ff0050',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginTop: '10px'
                  }}
                >
                  Удалить файл
                </button>
              </div>
            ) : (
              <div>
                <p>📁 Перетащите видео сюда или нажмите для выбора</p>
                <p>Поддерживаемые форматы: MP4, MOV, AVI</p>
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Описание видео:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Добавьте описание к вашему видео..."
            maxLength={2200}
          />
          <small style={{ color: '#666' }}>
            {description.length}/2200 символов
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="privacy">Уровень приватности:</label>
          <select
            id="privacy"
            value={privacyLevel}
            onChange={(e) => setPrivacyLevel(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '16px'
            }}
          >
            <option value="PUBLIC_TO_EVERYONE">Публичное (все пользователи)</option>
            <option value="MUTUAL_FOLLOW_FRIEND">Только друзья</option>
            <option value="SELF_ONLY">Только я</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
          <button
            className="btn"
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            style={{ flex: 1 }}
          >
            {uploading ? 'Загрузка...' : 'Опубликовать в TikTok'}
          </button>
          
          <button
            className="btn btn-secondary"
            onClick={() => {
              setSelectedFile(null);
              setDescription('');
              setPrivacyLevel('PUBLIC_TO_EVERYONE');
              setStatus(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
            }}
            disabled={uploading}
          >
            Очистить
          </button>
        </div>
      </div>

      <div className="card">
        <h3>📋 Требования к видео</h3>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li>Формат: MP4, MOV, AVI</li>
          <li>Максимальный размер: 500 MB</li>
          <li>Длительность: от 3 секунд до 10 минут</li>
          <li>Разрешение: минимум 720p</li>
          <li>Соотношение сторон: 9:16 (вертикальное) или 16:9 (горизонтальное)</li>
        </ul>
      </div>
    </div>
  );
};

export default VideoUpload;


