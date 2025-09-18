# 🚀 Быстрый старт TikTok Publisher

## 📋 Что нужно сделать перед запуском

### 1. Настройка TikTok API

1. Перейдите в [TikTok Developer Portal](https://developers.tiktok.com/)
2. Создайте новое приложение
3. Получите `Client Key` и `Client Secret`
4. Откройте файл `server/config.env`
5. Замените `your_client_key_here` и `your_client_secret_here` на ваши ключи

```env
TIKTOK_CLIENT_KEY=ваш_реальный_client_key
TIKTOK_CLIENT_SECRET=ваш_реальный_client_secret
```

### 2. Запуск приложения

#### Вариант 1: Через bat файлы (Windows)
1. Дважды кликните `start-backend.bat` - запустится сервер
2. Дважды кликните `start-frontend.bat` - запустится веб-приложение

#### Вариант 2: Через командную строку

**Терминал 1 - Бэкенд:**
```bash
cd server
npm run dev
```

**Терминал 2 - Фронтенд:**
```bash
npm start
```

### 3. Использование

1. Откройте http://localhost:3000
2. Нажмите "Войти через TikTok"
3. Авторизуйтесь в TikTok
4. Загрузите видео и опубликуйте!

## 🔧 API для автоматической публикации

После настройки вы можете использовать API для автоматической публикации:

```javascript
// Пример запроса к API
const formData = new FormData();
formData.append('video', videoFile);
formData.append('description', 'Мое видео');
formData.append('privacy_level', 'PUBLIC_TO_EVERYONE');
formData.append('access_token', 'YOUR_TIKTOK_ACCESS_TOKEN');

fetch('http://localhost:3001/api/publish/video', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```

## 📁 Структура файлов

```
tiktok-publisher/
├── src/                    # React приложение
│   ├── components/         # Компоненты UI
│   ├── services/          # API сервисы
│   └── App.tsx            # Главный компонент
├── server/                # Node.js бэкенд
│   ├── server.js          # Express сервер
│   ├── config.env         # Настройки (заполните своими ключами!)
│   └── package.json       # Зависимости бэкенда
├── start-frontend.bat     # Запуск фронтенда
├── start-backend.bat      # Запуск бэкенда
└── README.md              # Подробная документация
```

## ⚠️ Важные замечания

1. **Обязательно заполните `server/config.env`** своими ключами от TikTok
2. Убедитесь, что порты 3000 и 3001 свободны
3. Для продакшена измените `CORS_ORIGIN` в config.env
4. Видео должны соответствовать требованиям TikTok (см. README.md)

## 🆘 Если что-то не работает

1. Проверьте, что все зависимости установлены: `npm install` в обеих папках
2. Убедитесь, что ключи TikTok правильно указаны в config.env
3. Проверьте, что порты 3000 и 3001 не заняты другими приложениями
4. Посмотрите логи в консоли для диагностики ошибок

## 🎉 Готово!

Теперь у вас есть полнофункциональный сервис для публикации контента в TikTok!
