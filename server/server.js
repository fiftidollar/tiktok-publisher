const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const path = require('path');
require('dotenv').config({ path: './config.env' });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Настройка multer для загрузки файлов
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Только видео файлы разрешены'), false);
    }
  }
});

// TikTok API Configuration
const TIKTOK_API_BASE = 'https://open-api.tiktok.com';
const CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY;
const CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET;
const REDIRECT_URI = process.env.TIKTOK_REDIRECT_URI || 'http://localhost:3000/auth/callback';

// Хранилище для токенов (в продакшене используйте Redis или базу данных)
const tokenStore = new Map();

// Получение URL для авторизации TikTok
app.get('/api/auth/tiktok/url', (req, res) => {
  try {
    const authUrl = `${TIKTOK_API_BASE}/oauth/authorize/` +
      `?client_key=${CLIENT_KEY}` +
      `&scope=user.info.basic,video.publish` +
      `&response_type=code` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      `&state=${Date.now()}`;

    res.json({ authUrl });
  } catch (error) {
    console.error('Ошибка создания URL авторизации:', error);
    res.status(500).json({ error: 'Ошибка создания URL авторизации' });
  }
});

// Обработка callback от TikTok
app.post('/api/auth/tiktok', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Код авторизации не предоставлен' });
    }

    // Обмен кода на токен доступа
    const tokenResponse = await axios.post(`${TIKTOK_API_BASE}/oauth/access_token/`, {
      client_key: CLIENT_KEY,
      client_secret: CLIENT_SECRET,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: REDIRECT_URI
    });

    const { access_token, refresh_token, expires_in, scope } = tokenResponse.data.data;

    // Сохраняем токен
    tokenStore.set(access_token, {
      refresh_token,
      expires_at: Date.now() + (expires_in * 1000),
      scope
    });

    res.json({ 
      access_token,
      expires_in,
      scope
    });
  } catch (error) {
    console.error('Ошибка получения токена:', error);
    res.status(500).json({ 
      error: 'Ошибка получения токена доступа',
      details: error.response?.data || error.message
    });
  }
});

// Получение информации о пользователе
app.get('/api/user/info', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Токен доступа не предоставлен' });
    }

    const accessToken = authHeader.split(' ')[1];

    const response = await axios.get(`${TIKTOK_API_BASE}/user/info/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      params: {
        fields: 'open_id,union_id,avatar_url,display_name,username'
      }
    });

    res.json(response.data.data.user);
  } catch (error) {
    console.error('Ошибка получения информации о пользователе:', error);
    res.status(500).json({ 
      error: 'Ошибка получения информации о пользователе',
      details: error.response?.data || error.message
    });
  }
});

// Публикация видео
app.post('/api/publish/video', upload.single('video'), async (req, res) => {
  try {
    const { description, privacy_level, access_token } = req.body;
    const videoFile = req.file;

    if (!videoFile) {
      return res.status(400).json({ error: 'Видео файл не предоставлен' });
    }

    if (!access_token) {
      return res.status(401).json({ error: 'Токен доступа не предоставлен' });
    }

    // Проверяем токен
    if (!tokenStore.has(access_token)) {
      return res.status(401).json({ error: 'Недействительный токен доступа' });
    }

    // Создаем FormData для загрузки в TikTok
    const formData = new FormData();
    formData.append('video', videoFile.buffer, {
      filename: videoFile.originalname,
      contentType: videoFile.mimetype
    });
    formData.append('description', description || '');
    formData.append('privacy_level', privacy_level || 'PUBLIC_TO_EVERYONE');

    // Загружаем видео в TikTok
    const uploadResponse = await axios.post(
      `${TIKTOK_API_BASE}/share/video/upload/`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'Authorization': `Bearer ${access_token}`
        },
        timeout: 300000 // 5 минут
      }
    );

    res.json({
      success: true,
      video_id: uploadResponse.data.data.video_id,
      message: 'Видео успешно загружено'
    });

  } catch (error) {
    console.error('Ошибка публикации видео:', error);
    res.status(500).json({ 
      error: 'Ошибка при публикации видео',
      details: error.response?.data || error.message
    });
  }
});

// Получение статуса публикации
app.get('/api/publish/status/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Токен доступа не предоставлен' });
    }

    const accessToken = authHeader.split(' ')[1];

    const response = await axios.get(`${TIKTOK_API_BASE}/share/video/status/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      params: {
        video_id: videoId
      }
    });

    res.json(response.data.data);
  } catch (error) {
    console.error('Ошибка получения статуса:', error);
    res.status(500).json({ 
      error: 'Ошибка получения статуса публикации',
      details: error.response?.data || error.message
    });
  }
});

// Получение списка видео пользователя
app.get('/api/videos', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Токен доступа не предоставлен' });
    }

    const accessToken = authHeader.split(' ')[1];

    const response = await axios.get(`${TIKTOK_API_BASE}/video/list/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      params: {
        fields: 'id,title,cover_image_url,create_time,share_url'
      }
    });

    res.json({
      videos: response.data.data.videos || []
    });
  } catch (error) {
    console.error('Ошибка получения списка видео:', error);
    res.status(500).json({ 
      error: 'Ошибка получения списка видео',
      details: error.response?.data || error.message
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    tiktok_configured: !!(CLIENT_KEY && CLIENT_SECRET)
  });
});

// Обработка ошибок
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Файл слишком большой. Максимальный размер: 500MB' });
    }
  }
  
  console.error('Ошибка сервера:', error);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(`📱 TikTok API настроен: ${CLIENT_KEY ? 'Да' : 'Нет'}`);
  console.log(`🌐 CORS разрешен для: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);
});
