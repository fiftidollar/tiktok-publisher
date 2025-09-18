@echo off
echo 🔧 Быстрое исправление и деплой...
echo.

echo 📝 Добавление всех изменений...
git add .

echo.
echo 💬 Коммит изменений...
set /p commit_msg="Введите описание изменений: "
git commit -m "%commit_msg%"

echo.
echo 🚀 Пуш в GitHub...
git push origin main

echo.
echo ⚡ Деплой на Vercel...
vercel --prod

echo.
echo ✅ Готово! Изменения исправлены и задеплоены
echo.
pause


