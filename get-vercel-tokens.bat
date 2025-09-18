@echo off
echo 🔑 Получение токенов Vercel...
echo.

echo 📦 Установка Vercel CLI...
npm install -g vercel

echo.
echo 🔐 Вход в Vercel...
vercel login

echo.
echo 📋 Получение токенов...
echo.
echo 1. VERCEL_TOKEN:
vercel env ls

echo.
echo 2. ORG_ID и PROJECT_ID:
echo Перейдите в Vercel Dashboard → Settings → General
echo Скопируйте Organization ID и Project ID
echo.

echo 📝 Добавьте эти токены в GitHub Secrets:
echo Settings → Secrets and variables → Actions → New repository secret
echo.

pause
