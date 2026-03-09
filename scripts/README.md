# 📜 Deployment Scripts

Коллекция скриптов для развертывания и управления приложением.

## 📋 Доступные скрипты

### 🔧 setup-server.sh
**Назначение**: Первичная настройка сервера для деплоя

**Что делает**:
- Устанавливает Node.js 18 (LTS)
- Устанавливает PM2
- Настраивает Nginx (опционально)
- Настраивает UFW firewall (опционально)
- Создает директорию приложения

**Использование**:
```bash
# На сервере
curl -o setup-server.sh https://raw.githubusercontent.com/YOUR_USERNAME/apartment-project/main/scripts/setup-server.sh
chmod +x setup-server.sh
./setup-server.sh
```

**Когда использовать**: Один раз при первичной настройке нового сервера

---

### 🚀 deploy-manual.sh
**Назначение**: Ручное развертывание без GitHub Actions

**Что делает**:
- Собирает проект локально
- Создает deployment пакет
- Загружает на сервер через SCP
- Разворачивает и запускает через PM2

**Использование**:
```bash
# Локально
export SSH_HOST=your-server-ip
export SSH_USER=your-username
export SSH_PORT=22  # опционально
chmod +x scripts/deploy-manual.sh
./scripts/deploy-manual.sh
```

**Когда использовать**:
- Когда нужен быстрый деплой без GitHub Actions
- Для тестирования деплоя
- Когда GitHub Actions недоступен

---

### 🔍 check-deployment.sh
**Назначение**: Проверка готовности проекта к развертыванию

**Что проверяет**:
- Наличие Node.js и npm
- Конфигурацию Next.js (standalone mode)
- Наличие необходимых файлов
- Возможность успешной сборки
- Git конфигурацию

**Использование**:
```bash
chmod +x scripts/check-deployment.sh
./scripts/check-deployment.sh
```

**Когда использовать**:
- Перед первым деплоем
- После изменения конфигурации
- При возникновении проблем с деплоем

---

### 💾 backup-server.sh
**Назначение**: Создание серверных резервных копий данных

**Что делает**:
- Делает архив базы SQLite (`/var/lib/apartment-project/dev.db`)
- Сохраняет `.env` из приложения
- Сохраняет пользовательские загрузки (`public/uploads`)
- Создает SHA256 checksum архива
- Удаляет старые бэкапы старше 14 дней

**Использование**:
```bash
# На сервере
chmod +x scripts/backup-server.sh
./scripts/backup-server.sh
```

**Автоматический запуск**:
- При `./scripts/deploy-manual.sh` cron-задача устанавливается автоматически
- Расписание по умолчанию: каждые 6 часов
- Файлы бэкапа: `/var/backups/apartment-project`
- Лог: `/var/log/apartment-backup.log`

---

### 🔄 backup-db.sh
**Назначение**: Локальное резервное копирование базы данных

**Что делает**:
- Создает копию `prisma/dev.db` в папку `backups/`
- Автоматически удаляет старые бэкапы (хранит последние 30)
- Формат имени: `dev.db.backup-YYYYMMDD-HHMMSS`

**Использование**:
```bash
bash scripts/backup-db.sh
```

---

### ♻️ restore-db.sh
**Назначение**: Восстановление базы данных из бэкапа

**Что делает**:
- Восстанавливает базу данных из выбранного бэкапа
- Создает safety backup текущей БД перед восстановлением

**Использование**:
```bash
# Посмотреть доступные бэкапы
bash scripts/restore-db.sh

# Восстановить из конкретного бэкапа
bash scripts/restore-db.sh backups/dev.db.backup-20260309-120000

# После восстановления перезапустить приложение
pm2 restart apartment-project
```

---

### 🚀 migrate-with-backup.sh ⭐
**Назначение**: Безопасное применение миграций с автоматическим бэкапом

**Что делает**:
1. Создает бэкап базы данных
2. Применяет изменения схемы (`npx prisma db push`)
3. Регенерирует Prisma клиент
4. Перезапускает приложение

**Использование**:
```bash
# На сервере - РЕКОМЕНДУЕТСЯ для всех миграций!
bash scripts/migrate-with-backup.sh
```

**Когда использовать**:
- При любых изменениях схемы базы данных
- Вместо ручного `npx prisma db push`
- Гарантирует наличие бэкапа перед изменениями

---

### ⏰ setup-cron.sh
**Назначение**: Настройка автоматических периодических бэкапов

**Что делает**:
- Интерактивно выбирает интервал бэкапов
- Добавляет cron job для автоматических бэкапов
- Создает директорию для логов
- Логи сохраняются в `logs/backup.log`

**Доступные интервалы**:
- Каждые 2 часа (рекомендуется для продакшена)
- Каждые 4 часа
- Каждые 6 часов
- Каждые 12 часов
- Раз в день в 2:00 AM

**Использование**:
```bash
# На сервере - интерактивный режим
bash scripts/setup-cron.sh

# Или указать интервал сразу (1-5)
bash scripts/setup-cron.sh 1  # Каждые 2 часа
bash scripts/setup-cron.sh 3  # Каждые 6 часов
```

---

## 🎯 Типичные сценарии использования

### Сценарий 1: Первое развертывание

```bash
# 1. Проверьте локальную готовность
./scripts/check-deployment.sh

# 2. Настройте сервер (на сервере)
ssh user@server
curl -o setup.sh https://raw.githubusercontent.com/YOUR_USERNAME/apartment-project/main/scripts/setup-server.sh
chmod +x setup.sh
./setup.sh

# 3. Сделайте деплой (локально)
# Вариант A: Через GitHub Actions
git push origin main

# Вариант B: Вручную
SSH_HOST=server-ip SSH_USER=user ./scripts/deploy-manual.sh
```

### Сценарий 2: Обновление приложения

```bash
# Вариант A: Автоматически
git push origin main

# Вариант B: Вручную
SSH_HOST=server-ip SSH_USER=user ./scripts/deploy-manual.sh
```

### Сценарий 3: Применение миграции базы данных

```bash
# На сервере - с автоматическим бэкапом (рекомендуется)
bash scripts/migrate-with-backup.sh

# Если что-то пошло не так - откатиться
bash scripts/restore-db.sh backups/dev.db.backup-ПОСЛЕДНИЙ
pm2 restart apartment-project
```

### Сценарий 4: Быстрая проверка перед деплоем

```bash
# Проверьте, что всё готово
./scripts/check-deployment.sh

# Если всё ок, деплойте
git push origin main
```

### Сценарий 5: Настройка автоматических бэкапов (один раз)

```bash
# На сервере - выбрать интервал интерактивно
bash scripts/setup-cron.sh

# Или сразу указать: каждые 2 часа (рекомендуется)
bash scripts/setup-cron.sh 1

# Проверить, что cron job создан
crontab -l | grep backup-db.sh

# Посмотреть логи бэкапов в реальном времени
tail -f logs/backup.log
```

---

## 🛠️ Дополнительные команды

### На сервере (управление приложением)

```bash
# Проверить статус
pm2 status

# Посмотреть логи
pm2 logs apartment-project

# Рестартовать
pm2 restart apartment-project

# Остановить
pm2 stop apartment-project

# Мониторинг
pm2 monit
```

### Локально (управление деплоем)

```bash
# Проверить что будет задеплоено
git diff origin/main

# Проверить последние коммиты
git log --oneline -5

# Проверить статус сборки
npm run build
```

---

## ⚠️ Важные замечания

### setup-server.sh
- Требует sudo права
- Изменяет системные настройки
- Запускать только на чистом сервере
- Интерактивный (запрашивает подтверждения)

### deploy-manual.sh
- Требует SSH доступ к серверу
- Использует переменные окружения для конфигурации
- Создает временные файлы (удаляются автоматически)
- Перезапускает приложение (короткий downtime)

### check-deployment.sh
- Безопасный (не меняет файлы)
- Запускает тестовую сборку (может занять время)
- Требует установленные node_modules

---

## 🔐 Безопасность

### SSH ключи
```bash
# Создание ключа для деплоя
ssh-keygen -t ed25519 -C "deploy-key" -f ~/.ssh/deploy_key

# Добавление на сервер
ssh-copy-id -i ~/.ssh/deploy_key.pub user@server

# Использование
SSH_HOST=server ssh -i ~/.ssh/deploy_key user@server
```

### Переменные окружения
Никогда не храните секреты в скриптах!

```bash
# ✗ Плохо
SSH_HOST=123.45.67.89 ./deploy.sh

# ✓ Хорошо - используйте .env файл
# .env (не коммитьте в git!)
SSH_HOST=123.45.67.89
SSH_USER=deploy
SSH_PORT=22

# Загрузите в shell
set -a
source .env
set +a
./scripts/deploy-manual.sh
```

---

## 🐛 Troubleshooting

### "Permission denied" при запуске скрипта
```bash
chmod +x scripts/название-скрипта.sh
```

### "Command not found: npm/node"
```bash
# Установите Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### SSH соединение не удается
```bash
# Проверьте доступ
ssh -v user@server

# Проверьте SSH ключ
ssh-add -l
```

### Build fails
```bash
# Очистите кеш
rm -rf .next node_modules
npm install
npm run build
```

---

## 📚 Дополнительные ресурсы

- [DEPLOYMENT.md](../DEPLOYMENT.md) - Полная документация по деплою
- [QUICKSTART.md](../QUICKSTART.md) - Быстрый старт за 15 минут
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

**Вопросы?** Откройте issue в GitHub или проверьте [DEPLOYMENT.md](../DEPLOYMENT.md)
