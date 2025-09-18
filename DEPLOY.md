# 🚀 Деплой на Vercel - Быстрый старт

## 📋 Что нужно сделать

### 1. **Подготовка фронтенда**

1. **Установите Vercel CLI:**
```bash
npm install -g vercel
```

2. **Войдите в Vercel:**
```bash
vercel login
```

3. **Деплой фронтенда:**
```bash
cd tiktok-publisher
vercel
```

### 2. **Настройка бэкенда (отдельно)**

Бэкенд нужно деплоить отдельно, так как Vercel лучше подходит для фронтенда.

**Варианты для бэкенда:**
- **Railway** (рекомендуется) - https://railway.app
- **Render** - https://render.com
- **Heroku** - https://heroku.com
- **DigitalOcean App Platform**

### 3. **Настройка переменных окружения**

В Vercel Dashboard добавьте:
```
REACT_APP_API_URL=https://your-backend-url.vercel.app/api
```

### 4. **Быстрый деплой через GitHub**

1. **Создайте репозиторий на GitHub**
2. **Загрузите код:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/tiktok-publisher.git
git push -u origin main
```

3. **Подключите к Vercel:**
   - Зайдите на https://vercel.com
   - Нажмите "New Project"
   - Выберите ваш GitHub репозиторий
   - Vercel автоматически определит React и задеплоит

## 🔧 **Альтернативный вариант - Vercel для бэкенда**

Создайте отдельную папку для бэкенда и деплойте как Vercel Function:

### 1. **Создайте папку api в корне проекта:**
```
tiktok-publisher/
├── api/
│   ├── auth/
│   │   └── tiktok.js
│   ├── publish/
│   │   └── video.js
│   └── user/
│       └── info.js
├── src/
└── vercel.json
```

### 2. **Обновите vercel.json:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build"
    },
    {
      "src": "api/**/*.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    }
  ]
}
```

## ⚡ **Самый быстрый способ (5 минут):**

1. **Создайте аккаунт на Vercel**
2. **Установите Vercel CLI:**
```bash
npm install -g vercel
```

3. **В папке проекта:**
```bash
vercel
```

4. **Следуйте инструкциям CLI**
5. **Готово!** Ваш сайт будет доступен по ссылке вида: `https://tiktok-publisher-xxx.vercel.app`

## 🔑 **Настройка TikTok API для продакшена:**

1. **В TikTok Developer Portal:**
   - Добавьте домен Vercel в разрешенные redirect URI
   - Например: `https://your-app.vercel.app/auth/callback`

2. **В Vercel Dashboard:**
   - Добавьте переменные окружения:
   ```
   TIKTOK_CLIENT_KEY=your_key
   TIKTOK_CLIENT_SECRET=your_secret
   TIKTOK_REDIRECT_URI=https://your-app.vercel.app/auth/callback
   ```

## 🎯 **Результат:**

- ✅ Фронтенд: `https://your-app.vercel.app`
- ✅ API: `https://your-app.vercel.app/api`
- ✅ Автоматические деплои при push в GitHub
- ✅ HTTPS из коробки
- ✅ CDN по всему миру

## 💡 **Советы:**

1. **Используйте GitHub** - Vercel лучше всего работает с GitHub
2. **Настройте домен** - можно подключить свой домен
3. **Мониторинг** - Vercel показывает статистику и логи
4. **Превью** - каждая ветка получает свой URL для тестирования

## 🆘 **Если что-то не работает:**

1. Проверьте логи в Vercel Dashboard
2. Убедитесь, что все переменные окружения настроены
3. Проверьте, что TikTok API разрешает ваш домен
4. Посмотрите документацию Vercel: https://vercel.com/docs


