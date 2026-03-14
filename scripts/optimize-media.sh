#!/bin/bash

# Скрипт для оптимизации медиа файлов

echo "🎬 Оптимизация медиа файлов..."

# Проверка наличия ffmpeg
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ ffmpeg не установлен. Установите: sudo apt install ffmpeg"
    exit 1
fi

# Проверка наличия cwebp (для WebP конвертации)
if ! command -v cwebp &> /dev/null; then
    echo "⚠️  cwebp не установлен. Установите: sudo apt install webp"
    WEBP_AVAILABLE=false
else
    WEBP_AVAILABLE=true
fi

cd "$(dirname "$0")/.." || exit 1

# 1. Создать оптимизированное мобильное видео
echo ""
echo "📱 Создание мобильного видео высокого качества (720p, 1.5 Mbps)..."
if [ -f "public/hero.mp4" ]; then
    ffmpeg -i public/hero.mp4 \
        -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2" \
        -c:v libx264 \
        -preset slow \
        -crf 28 \
        -b:v 1500k \
        -maxrate 1800k \
        -bufsize 3000k \
        -c:a aac \
        -b:a 128k \
        -movflags +faststart \
        -y public/hero-mobile-hq.mp4

    SIZE_ORIGINAL=$(du -h public/hero-mobile.mp4 | cut -f1)
    SIZE_NEW=$(du -h public/hero-mobile-hq.mp4 | cut -f1)
    echo "✅ Создано: public/hero-mobile-hq.mp4"
    echo "   Старое: $SIZE_ORIGINAL -> Новое: $SIZE_NEW"
else
    echo "❌ Файл public/hero.mp4 не найден"
fi

# 2. Оптимизировать desktop видео (уменьшить размер без потери качества)
echo ""
echo "🖥️  Оптимизация desktop видео..."
if [ -f "public/hero.mp4" ]; then
    ffmpeg -i public/hero.mp4 \
        -c:v libx264 \
        -preset slow \
        -crf 26 \
        -b:v 4000k \
        -maxrate 4500k \
        -bufsize 8000k \
        -c:a aac \
        -b:a 128k \
        -movflags +faststart \
        -y public/hero-optimized.mp4

    SIZE_ORIGINAL=$(du -h public/hero.mp4 | cut -f1)
    SIZE_NEW=$(du -h public/hero-optimized.mp4 | cut -f1)
    echo "✅ Создано: public/hero-optimized.mp4"
    echo "   Оригинал: $SIZE_ORIGINAL -> Оптимизировано: $SIZE_NEW"
else
    echo "❌ Файл public/hero.mp4 не найден"
fi

# 3. Конвертировать 6.png в WebP
if [ "$WEBP_AVAILABLE" = true ]; then
    echo ""
    echo "🖼️  Конвертация изображений в WebP..."

    if [ -f "public/6.png" ]; then
        cwebp -q 85 public/6.png -o public/6.webp
        SIZE_PNG=$(du -h public/6.png | cut -f1)
        SIZE_WEBP=$(du -h public/6.webp | cut -f1)
        echo "✅ Создано: public/6.webp"
        echo "   PNG: $SIZE_PNG -> WebP: $SIZE_WEBP"
    else
        echo "❌ Файл public/6.png не найден"
    fi
else
    echo "⚠️  Пропуск конвертации WebP (cwebp не установлен)"
fi

echo ""
echo "✅ Оптимизация завершена!"
echo ""
echo "📝 Следующие шаги:"
echo "1. Замените файлы в Hero.tsx:"
echo "   - hero-mobile.mp4 -> hero-mobile-hq.mp4"
echo "   - hero.mp4 -> hero-optimized.mp4"
echo ""
echo "2. Если создан 6.webp, обновите AboutSection.tsx:"
echo "   - Измените src=\"/6.png\" на src=\"/6.webp\""
