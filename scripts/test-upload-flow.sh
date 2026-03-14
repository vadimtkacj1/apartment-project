#!/bin/bash
# Тестирование полного цикла загрузки файла

echo "🧪 ТЕСТ ЗАГРУЗКИ ФАЙЛОВ"
echo "======================="
echo ""

# Путь к проекту
PROJECT_DIR="/opt/apartment-project"
cd $PROJECT_DIR

echo "1️⃣ Проверка структуры проекта:"
echo "   process.cwd() будет: $(pwd)"
ls -la | grep -E "public|.next"
echo ""

echo "2️⃣ Проверка .env:"
if [ -f .env ]; then
    echo "   UPLOADS_DIR = $(grep UPLOADS_DIR .env || echo 'НЕ НАЙДЕН')"
else
    echo "   ❌ .env НЕ НАЙДЕН!"
fi
echo ""

echo "3️⃣ Проверка существующих папок uploads:"
find . -type d -name "uploads" -not -path "./node_modules/*" 2>/dev/null
echo ""

echo "4️⃣ Проверка .next/standalone (если есть):"
if [ -d .next/standalone ]; then
    echo "   ✅ STANDALONE BUILD найден"
    echo "   CWD процесса PM2 будет: $(pm2 describe apartment-project 2>/dev/null | grep cwd | head -1)"
    ls -la .next/standalone/ | grep -E "public|server"
else
    echo "   ℹ️  Standalone не найден - обычный build"
fi
echo ""

echo "5️⃣ Создаем ТЕСТОВЫЙ файл и проверяем доступность:"
# Создаем тестовый файл
mkdir -p public/uploads/properties
echo "TEST" > public/uploads/properties/test.txt
chmod 755 public/uploads/properties/test.txt
echo "   ✅ Создан: public/uploads/properties/test.txt"
echo ""

# Проверяем доступность через curl
echo "6️⃣ Тест доступности через API:"
echo "   Запрос: curl http://localhost:3000/uploads/properties/test.txt"
RESULT=$(curl -s -w "\nHTTP_CODE:%{http_code}" http://localhost:3000/uploads/properties/test.txt 2>&1)
echo "$RESULT"
echo ""

if echo "$RESULT" | grep -q "HTTP_CODE:200"; then
    echo "   ✅ API работает! Файл доступен"
else
    echo "   ❌ API НЕ РАБОТАЕТ! Код: $(echo "$RESULT" | grep HTTP_CODE)"
    echo ""
    echo "   Проверяем логи приложения:"
    pm2 logs apartment-project --lines 20 --nostream | tail -10
fi
echo ""

echo "7️⃣ Проверка nginx:"
echo "   Запрос напрямую через nginx:"
NGINX_RESULT=$(curl -s -w "\nHTTP_CODE:%{http_code}" https://ram-haim.co.il/uploads/properties/test.txt 2>&1)
echo "$NGINX_RESULT"
echo ""

echo "8️⃣ Последние 5 загруженных файлов:"
find public/uploads -name "*.jpg" -o -name "*.png" -o -name "*.jpeg" 2>/dev/null | tail -5
echo ""

echo "======================="
echo "📊 РЕЗУЛЬТАТ:"
echo ""
if echo "$RESULT" | grep -q "HTTP_CODE:200"; then
    echo "✅ API работает - проблема в другом месте (nginx/dns/кэш)"
    echo "   Попробуй открыть напрямую: http://IP-СЕРВЕРА:3000/uploads/properties/test.txt"
else
    echo "❌ API НЕ РАБОТАЕТ - проблема в коде или путях"
    echo "   Нужны логи! Запусти: pm2 logs apartment-project"
    echo "   Потом загрузи файл через админку и скопируй сюда логи"
fi
