@echo off
echo 🔗 Настройка GitHub репозитория...
echo.

echo 📝 Введите URL вашего GitHub репозитория:
echo (например: https://github.com/yourusername/tiktok-publisher.git)
set /p github_url="GitHub URL: "

echo.
echo 🔗 Подключение к GitHub...
git remote add origin %github_url%

echo.
echo 🚀 Отправка кода на GitHub...
git branch -M main
git push -u origin main

echo.
echo ✅ Готово! Код загружен на GitHub
echo.
echo 📋 Следующие шаги:
echo 1. Перейдите в настройки репозитория на GitHub
echo 2. Добавьте секреты Vercel (см. DEPLOY.md)
echo 3. GitHub Actions автоматически задеплоят проект
echo.
pause


