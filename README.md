# TikTok Publisher

Сервис для публикации контента в TikTok через API. Позволяет пользователям авторизоваться через TikTok и публиковать видео как через веб-интерфейс, так и через API.

## 🚀 Возможности

- ✅ Авторизация через TikTok OAuth
- ✅ Загрузка и публикация видео через веб-интерфейс
- ✅ API для автоматической публикации контента
- ✅ Управление настройками приватности
- ✅ Отслеживание статуса публикации
- ✅ Современный React интерфейс

## 📋 Требования

- Node.js 16+ 
- TikTok Developer Account
- Client Key и Secret Key от TikTok

## 🛠 Установка

### 1. Клонирование и установка зависимостей

```bash
# Установка зависимостей фронтенда
cd tiktok-publisher
npm install

# Установка зависимостей бэкенда
cd server
npm install
```

### 2. Настройка TikTok API

1. Создайте приложение в [TikTok Developer Portal](https://developers.tiktok.com/)
2. Получите Client Key и Secret Key
3. Скопируйте `server/env.example` в `server/.env`
4. Заполните переменные окружения:

```env
TIKTOK_CLIENT_KEY=your_client_key_here
TIKTOK_CLIENT_SECRET=your_client_secret_here
TIKTOK_REDIRECT_URI=http://localhost:3000/auth/callback
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

### 3. Запуск приложения

```bash
# Терминал 1 - Запуск бэкенда
cd server
npm run dev

# Терминал 2 - Запуск фронтенда
cd ..
npm start
```

Приложение будет доступно по адресу: http://localhost:3000

## 📖 API Документация

### Авторизация

#### Получение URL для авторизации
```http
GET /api/auth/tiktok/url
```

#### Обмен кода на токен
```http
POST /api/auth/tiktok
Content-Type: application/json

{
  "code": "authorization_code_from_tiktok"
}
```

### Публикация видео

#### Загрузка видео
```http
POST /api/publish/video
Content-Type: multipart/form-data
Authorization: Bearer YOUR_ACCESS_TOKEN

FormData:
- video: File (видео файл)
- description: string (описание)
- privacy_level: string (уровень приватности)
```

#### Получение статуса публикации
```http
GET /api/publish/status/{videoId}
Authorization: Bearer YOUR_ACCESS_TOKEN
```

#### Получение списка видео
```http
GET /api/videos
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Уровни приватности

- `PUBLIC_TO_EVERYONE` - Публичное видео
- `MUTUAL_FOLLOW_FRIEND` - Только друзья
- `SELF_ONLY` - Только я

## 🔧 Использование

### Веб-интерфейс

1. Откройте http://localhost:3000
2. Нажмите "Войти через TikTok"
3. Авторизуйтесь в TikTok
4. Перейдите в "Загрузить видео"
5. Выберите видео файл и добавьте описание
6. Нажмите "Опубликовать в TikTok"

### API интеграция

```javascript
// Пример использования API
const response = await fetch('http://localhost:3001/api/publish/video', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
  },
  body: formData // FormData с видео файлом
});

const result = await response.json();
console.log(result);
```

## 📁 Структура проекта

```
tiktok-publisher/
├── public/                 # Статические файлы
├── src/                   # React приложение
│   ├── components/        # React компоненты
│   ├── services/         # API сервисы
│   └── App.tsx           # Главный компонент
├── server/               # Node.js бэкенд
│   ├── server.js         # Express сервер
│   └── package.json      # Зависимости бэкенда
└── package.json          # Зависимости фронтенда
```

## 🐛 Устранение неполадок

### Ошибка CORS
Убедитесь, что `CORS_ORIGIN` в `.env` файле соответствует URL фронтенда.

### Ошибка авторизации TikTok
Проверьте правильность `TIKTOK_CLIENT_KEY` и `TIKTOK_CLIENT_SECRET`.

### Ошибка загрузки видео
Убедитесь, что видео соответствует требованиям TikTok:
- Формат: MP4, MOV, AVI
- Размер: до 500MB
- Длительность: 3 секунды - 10 минут

## 📝 Лицензия

MIT License

## 🤝 Поддержка

При возникновении проблем создайте issue в репозитории проекта.


