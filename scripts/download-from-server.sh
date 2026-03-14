#!/bin/bash

# Скрипт для скачивания файлов с production сервера

SERVER="root@your-server-ip"
SERVER_PATH="/opt/apartment-project/public/uploads/"
LOCAL_PATH="./public/uploads/"

echo "📥 Скачивание файлов с сервера..."
echo ""

# Создать локальную папку если нет
mkdir -p "$LOCAL_PATH"

# Скачать файлы с сервера
rsync -avz --progress "$SERVER:$SERVER_PATH" "$LOCAL_PATH"

echo ""
echo "✅ Файлы скачаны!"
echo ""
echo "Проверьте папку public/uploads/"
