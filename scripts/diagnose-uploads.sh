#!/bin/bash
# Диагностика проблемы с загрузкой файлов

echo "🔍 ДИАГНОСТИКА ПРОБЛЕМЫ С UPLOADS"
echo "=================================="
echo ""

echo "1️⃣ Проверяем .env на сервере:"
if [ -f /opt/apartment-project/.env ]; then
    echo "   📄 Файл .env существует"
    echo "   UPLOADS_DIR = $(grep UPLOADS_DIR /opt/apartment-project/.env || echo 'НЕ НАЙДЕН!')"
else
    echo "   ❌ Файл .env НЕ НАЙДЕН!"
fi
echo ""

echo "2️⃣ Проверяем где запущен процесс PM2:"
pm2 describe apartment-project | grep -E "cwd|exec cwd"
echo ""

echo "3️⃣ Проверяем переменные окружения процесса:"
pm2 env apartment-project | grep UPLOADS_DIR
echo ""

echo "4️⃣ Ищем ВСЕ папки uploads на сервере:"
find /opt/apartment-project -type d -name "uploads" 2>/dev/null
echo ""

echo "5️⃣ Ищем последние загруженные .jpg/.png файлы:"
find /opt/apartment-project -name "*.jpg" -o -name "*.png" -o -name "*.jpeg" 2>/dev/null | grep -E "[0-9]{13}" | tail -10
echo ""

echo "6️⃣ Проверяем права доступа к папкам uploads:"
ls -la /opt/apartment-project/public/ 2>/dev/null | grep uploads
ls -la /opt/apartment-project/public/uploads/ 2>/dev/null
echo ""

echo "7️⃣ Проверяем .next/standalone (если используется):"
if [ -d /opt/apartment-project/.next/standalone ]; then
    echo "   ⚠️  НАЙДЕН .next/standalone - возможно используется standalone build!"
    find /opt/apartment-project/.next/standalone -name "*.jpg" -o -name "*.png" 2>/dev/null | tail -5
    echo "   CWD процесса может быть: /opt/apartment-project/.next/standalone"
fi
echo ""

echo "8️⃣ Последние 30 строк логов приложения (ищем DEBUG upload):"
pm2 logs apartment-project --lines 30 --nostream | grep -A 5 "DEBUG upload" || echo "   ℹ️  Логов DEBUG upload не найдено - нужно загрузить файл через админку!"
echo ""

echo "=================================="
echo "✅ Диагностика завершена!"
echo ""
echo "📋 ЧТО ДЕЛАТЬ ДАЛЬШЕ:"
echo "1. Загрузи НОВЫЙ файл через админку"
echo "2. Запусти: pm2 logs apartment-project --lines 50"
echo "3. Найди строки с '🔍 DEBUG upload:' - там будет путь куда сохранился файл"
echo "4. Скопируй эти строки сюда"
