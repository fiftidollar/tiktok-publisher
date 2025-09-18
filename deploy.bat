@echo off
echo 🚀 Деплой TikTok Publisher на Vercel...
echo.

echo 📦 Установка Vercel CLI...
npm install -g vercel

echo.
echo 🔐 Вход в Vercel...
vercel login

echo.
echo 🚀 Деплой приложения...
vercel

echo.
echo ✅ Готово! Ваше приложение деплоено на Vercel
echo.
pause


