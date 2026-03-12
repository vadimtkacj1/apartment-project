#!/bin/bash
# Скрипт для исправления проблемы с загрузкой файлов на сервере

echo "🔧 Исправление загрузки файлов на сервере..."
echo ""

# 1. Проверяем текущий .env
echo "1️⃣ Проверяем текущий .env файл:"
if grep -q "^UPLOADS_DIR=" /opt/apartment-project/.env 2>/dev/null; then
    echo "   ✅ UPLOADS_DIR уже есть в .env:"
    grep "^UPLOADS_DIR=" /opt/apartment-project/.env
else
    echo "   ❌ UPLOADS_DIR НЕ НАЙДЕН в .env - это проблема!"
    echo ""
    echo "2️⃣ Добавляем UPLOADS_DIR в .env..."
    echo "" >> /opt/apartment-project/.env
    echo "# File Uploads - путь куда сохраняются загруженные изображения" >> /opt/apartment-project/.env
    echo "UPLOADS_DIR=/opt/apartment-project/public/uploads" >> /opt/apartment-project/.env
    echo "   ✅ Добавлено!"
fi

echo ""
echo "3️⃣ Создаем папки uploads если их нет:"
mkdir -p /opt/apartment-project/public/uploads/properties
mkdir -p /opt/apartment-project/public/uploads/owners
mkdir -p /opt/apartment-project/public/uploads/team
chmod -R 755 /opt/apartment-project/public/uploads
echo "   ✅ Папки созданы"

echo ""
echo "4️⃣ Проверяем права доступа:"
ls -la /opt/apartment-project/public/uploads/

echo ""
echo "5️⃣ Перезапускаем приложение с новыми настройками:"
pm2 restart apartment-project --update-env
echo "   ✅ Приложение перезапущено"

echo ""
echo "6️⃣ Проверяем логи приложения:"
echo "   Последние 20 строк логов:"
pm2 logs apartment-project --lines 20 --nostream

echo ""
echo "✅ ГОТОВО!"
echo ""
echo "Теперь загрузи фото через админку и проверь что оно появилось в:"
echo "/opt/apartment-project/public/uploads/properties/"
echo ""
echo "Чтобы посмотреть что там есть:"
echo "ls -lh /opt/apartment-project/public/uploads/properties/ | tail -5"
