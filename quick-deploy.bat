@echo off
echo ⚡ Быстрый деплой TikTok Publisher...
echo.

echo 🔧 Проверка изменений...
git status

echo.
echo 📦 Сборка проекта...
npm run build

echo.
echo 🚀 Деплой на Vercel...
vercel --prod

echo.
echo ✅ Готово! Изменения задеплоены
echo.
pause
