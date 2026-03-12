#!/bin/bash
# Автоматическое исправление проблемы с uploads

echo "🔧 АВТОИСПРАВЛЕНИЕ ПРОБЛЕМЫ С UPLOADS"
echo "======================================"
echo ""

# 1. Ищем где РЕАЛЬНО лежат файлы
echo "1️⃣ Ищем загруженные файлы..."
FOUND_FILES=$(find /opt/apartment-project -name "*.jpg" -o -name "*.png" -o -name "*.jpeg" 2>/dev/null | grep -E "[0-9]{13}" | head -5)

if [ -z "$FOUND_FILES" ]; then
    echo "   ℹ️  Загруженных файлов не найдено - сначала загрузи файл через админку"
    exit 1
fi

echo "   Найдено файлов:"
echo "$FOUND_FILES"
echo ""

# 2. Определяем откуда идет неправильный путь
FIRST_FILE=$(echo "$FOUND_FILES" | head -1)
UPLOAD_DIR=$(dirname $(dirname "$FIRST_FILE"))
echo "2️⃣ Файлы загружаются в: $UPLOAD_DIR"
echo ""

# 3. Проверяем правильный путь
CORRECT_DIR="/opt/apartment-project/public/uploads"
echo "3️⃣ Правильный путь должен быть: $CORRECT_DIR"
echo ""

if [ "$UPLOAD_DIR" == "$CORRECT_DIR" ]; then
    echo "   ✅ Файлы уже в правильном месте!"
    echo "   ⚠️  Проблема в другом - возможно nginx не может их прочитать"
    echo ""
    echo "   Проверяем права доступа:"
    ls -la $CORRECT_DIR/
    echo ""
    echo "   Исправляем права:"
    chmod -R 755 $CORRECT_DIR
    chown -R www-data:www-data $CORRECT_DIR 2>/dev/null || chown -R nginx:nginx $CORRECT_DIR 2>/dev/null
    echo "   ✅ Права исправлены"
else
    echo "   ⚠️  ФАЙЛЫ В НЕПРАВИЛЬНОМ МЕСТЕ!"
    echo ""
    echo "4️⃣ Создаем правильные папки:"
    mkdir -p $CORRECT_DIR/properties
    mkdir -p $CORRECT_DIR/owners
    mkdir -p $CORRECT_DIR/team
    echo "   ✅ Созданы"
    echo ""

    echo "5️⃣ Копируем файлы в правильное место:"
    # Копируем properties
    if [ -d "$UPLOAD_DIR/properties" ]; then
        cp -v $UPLOAD_DIR/properties/* $CORRECT_DIR/properties/ 2>/dev/null
        echo "   ✅ Скопированы properties"
    fi
    # Копируем owners
    if [ -d "$UPLOAD_DIR/owners" ]; then
        cp -v $UPLOAD_DIR/owners/* $CORRECT_DIR/owners/ 2>/dev/null
        echo "   ✅ Скопированы owners"
    fi
    # Копируем team
    if [ -d "$UPLOAD_DIR/team" ]; then
        cp -v $UPLOAD_DIR/team/* $CORRECT_DIR/team/ 2>/dev/null
        echo "   ✅ Скопированы team"
    fi
    echo ""

    echo "6️⃣ Устанавливаем права доступа:"
    chmod -R 755 $CORRECT_DIR
    chown -R www-data:www-data $CORRECT_DIR 2>/dev/null || chown -R nginx:nginx $CORRECT_DIR 2>/dev/null
    echo "   ✅ Права установлены"
fi

echo ""
echo "7️⃣ Исправляем .env чтобы файлы сохранялись сразу в правильное место:"
if ! grep -q "^UPLOADS_DIR=" /opt/apartment-project/.env 2>/dev/null; then
    echo "" >> /opt/apartment-project/.env
    echo "# File Uploads" >> /opt/apartment-project/.env
    echo "UPLOADS_DIR=/opt/apartment-project/public/uploads" >> /opt/apartment-project/.env
    echo "   ✅ Добавлено в .env"
else
    echo "   ℹ️  UPLOADS_DIR уже есть в .env"
    grep "UPLOADS_DIR" /opt/apartment-project/.env
fi

echo ""
echo "8️⃣ Перезапускаем приложение:"
pm2 restart apartment-project --update-env
sleep 2
echo "   ✅ Перезапущено"

echo ""
echo "9️⃣ Проверяем результат:"
echo "   Файлы в правильной папке:"
ls -lh $CORRECT_DIR/properties/ | tail -5

echo ""
echo "======================================"
echo "✅ ГОТОВО!"
echo ""
echo "🧪 ТЕСТ:"
echo "Теперь открой сайт и проверь - фотки должны показываться!"
echo "Если нет - загрузи НОВЫЙ файл через админку и снова проверь"
