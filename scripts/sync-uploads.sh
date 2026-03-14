#!/bin/bash

# Скрипт для синхронизации папки uploads между dev и production

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Настройки
SERVER="root@your-server-ip"
SERVER_PATH="/opt/apartment-project/public/uploads/"
LOCAL_PATH="./public/uploads/"

echo -e "${YELLOW}📦 Синхронизация uploads${NC}\n"

# Меню
echo "Выберите действие:"
echo "1) Скачать файлы с сервера (server → local)"
echo "2) Загрузить файлы на сервер (local → server)"
echo "3) Показать различия"
read -p "Ваш выбор (1/2/3): " choice

case $choice in
  1)
    echo -e "\n${YELLOW}⬇️  Скачивание файлов с сервера...${NC}"
    rsync -avz --progress --delete "$SERVER:$SERVER_PATH" "$LOCAL_PATH"
    echo -e "${GREEN}✅ Готово!${NC}"
    ;;
  2)
    echo -e "\n${RED}⚠️  ВНИМАНИЕ: Это перезапишет файлы на сервере!${NC}"
    read -p "Вы уверены? (yes/no): " confirm
    if [ "$confirm" = "yes" ]; then
      echo -e "\n${YELLOW}⬆️  Загрузка файлов на сервер...${NC}"
      rsync -avz --progress "$LOCAL_PATH" "$SERVER:$SERVER_PATH"
      echo -e "${GREEN}✅ Готово!${NC}"

      # Перезапустить приложение
      echo -e "\n${YELLOW}🔄 Перезапуск приложения на сервере...${NC}"
      ssh "$SERVER" "cd /opt/apartment-project && pm2 restart apartment-project"
      echo -e "${GREEN}✅ Приложение перезапущено!${NC}"
    else
      echo -e "${YELLOW}❌ Отменено${NC}"
    fi
    ;;
  3)
    echo -e "\n${YELLOW}🔍 Проверка различий...${NC}"
    rsync -avz --dry-run --itemize-changes "$LOCAL_PATH" "$SERVER:$SERVER_PATH"
    ;;
  *)
    echo -e "${RED}❌ Неверный выбор${NC}"
    exit 1
    ;;
esac
