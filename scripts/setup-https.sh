#!/bin/bash
# HTTPS Setup Script with Let's Encrypt
# Автоматическая настройка SSL сертификата для вашего домена

set -e

echo "🔒 HTTPS Setup with Let's Encrypt"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Проверка что скрипт запущен НЕ от root
if [ "$EUID" -eq 0 ]; then
   echo "❌ Пожалуйста, запустите без sudo"
   echo "Скрипт сам запросит sudo когда нужно"
   exit 1
fi

# Проверка наличия домена
if [ -z "$1" ]; then
    echo "❌ Ошибка: Домен не указан"
    echo ""
    echo "Использование:"
    echo "  ./setup-https.sh your-domain.com"
    echo ""
    echo "Примеры:"
    echo "  ./setup-https.sh example.com"
    echo "  ./setup-https.sh apartments.example.com"
    exit 1
fi

DOMAIN=$1
EMAIL=${2:-"admin@$DOMAIN"}

echo "Настройка HTTPS для:"
echo "  Домен: $DOMAIN"
echo "  Email: $EMAIL"
echo ""

# Проверка что Nginx установлен
if ! command -v nginx &> /dev/null; then
    echo "📦 Nginx не найден, устанавливаю..."
    sudo apt update
    sudo apt install -y nginx
else
    echo "✅ Nginx уже установлен"
fi

# Проверка что Certbot установлен
if ! command -v certbot &> /dev/null; then
    echo "📦 Устанавливаю Certbot..."
    sudo apt update
    sudo apt install -y certbot python3-certbot-nginx
else
    echo "✅ Certbot уже установлен"
fi

# Создание Nginx конфигурации
echo ""
echo "📝 Создаю конфигурацию Nginx..."

sudo tee /etc/nginx/sites-available/apartment-project > /dev/null << EOF
# HTTP - редирект на HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;

    # Разрешить Let's Encrypt verification
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    # Редирект на HTTPS
    location / {
        return 301 https://\$server_name\$request_uri;
    }
}

# HTTPS
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;

    # SSL сертификаты (будут добавлены Certbot)
    # ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;

    # SSL настройки
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Логи
    access_log /var/log/nginx/apartment-project.access.log;
    error_log /var/log/nginx/apartment-project.error.log;

    # Proxy к Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        # Таймауты
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Статические файлы (кеширование)
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }

    # Favicon
    location = /favicon.ico {
        proxy_pass http://localhost:3000;
        access_log off;
        log_not_found off;
    }

    # Robots.txt
    location = /robots.txt {
        proxy_pass http://localhost:3000;
        access_log off;
        log_not_found off;
    }
}
EOF

# Активация конфигурации
echo "✅ Конфигурация создана"

# Создание символической ссылки
sudo ln -sf /etc/nginx/sites-available/apartment-project /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Проверка конфигурации
echo ""
echo "🔍 Проверяю конфигурацию Nginx..."
if sudo nginx -t; then
    echo "✅ Конфигурация корректна"
else
    echo "❌ Ошибка в конфигурации Nginx"
    exit 1
fi

# Перезапуск Nginx
echo ""
echo "🔄 Перезапускаю Nginx..."
sudo systemctl restart nginx

# Проверка DNS
echo ""
echo "🔍 Проверяю DNS для $DOMAIN..."
if host $DOMAIN &> /dev/null; then
    IP=$(host $DOMAIN | grep "has address" | awk '{print $4}' | head -1)
    echo "✅ Домен найден: $DOMAIN -> $IP"

    # Получить IP сервера
    SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "unknown")
    if [ "$IP" != "$SERVER_IP" ] && [ "$SERVER_IP" != "unknown" ]; then
        echo "⚠️  ВНИМАНИЕ: DNS указывает на $IP, но IP сервера: $SERVER_IP"
        echo "   Убедитесь что DNS настроен правильно!"
    fi
else
    echo "⚠️  Домен $DOMAIN не найден в DNS"
    echo "   Убедитесь что:"
    echo "   1. DNS записи настроены (A запись)"
    echo "   2. DNS изменения вступили в силу (может занять до 24 часов)"
    echo ""
    read -p "Продолжить всё равно? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Получение SSL сертификата
echo ""
echo "🔒 Получаю SSL сертификат от Let's Encrypt..."
echo "   Это может занять минуту..."
echo ""

if sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email $EMAIL --redirect; then
    echo ""
    echo "✅ SSL сертификат успешно установлен!"
else
    echo ""
    echo "❌ Ошибка при получении сертификата"
    echo ""
    echo "Возможные причины:"
    echo "1. DNS не настроен или не распространился"
    echo "2. Порты 80 и 443 закрыты firewall"
    echo "3. Домен уже используется"
    echo ""
    echo "Попробуйте:"
    echo "  sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
    exit 1
fi

# Тест автообновления
echo ""
echo "🔄 Проверяю автоматическое обновление сертификата..."
if sudo certbot renew --dry-run; then
    echo "✅ Автообновление настроено"
else
    echo "⚠️  Проверьте настройки автообновления"
fi

# Финальная проверка
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ HTTPS успешно настроен!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Информация:"
echo "  Домен: https://$DOMAIN"
echo "  Сертификат: Let's Encrypt"
echo "  Срок действия: 90 дней"
echo "  Автообновление: Включено"
echo ""
echo "🔗 Проверьте:"
echo "  https://$DOMAIN"
echo "  https://www.$DOMAIN"
echo ""
echo "📝 Полезные команды:"
echo "  Статус Nginx: sudo systemctl status nginx"
echo "  Логи Nginx: sudo tail -f /var/log/nginx/apartment-project.error.log"
echo "  Инфо о сертификате: sudo certbot certificates"
echo "  Обновить сертификат: sudo certbot renew"
echo ""
echo "⚠️  Сертификат обновляется автоматически каждые 60 дней"
echo ""
