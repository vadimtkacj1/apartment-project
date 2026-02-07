# ⚡ Quick Start - Deployment

Быстрое руководство по развертыванию за 15 минут.

## 🚀 Вариант 1: Автоматический деплой (GitHub Actions)

### Шаг 1: Настройте сервер (5 минут)

```bash
# Подключитесь к серверу
ssh your-user@your-server-ip

# Загрузите и запустите скрипт
curl -o setup.sh https://raw.githubusercontent.com/YOUR_USERNAME/apartment-project/main/scripts/setup-server.sh
chmod +x setup.sh
./setup.sh

# Создайте SSH ключ для GitHub Actions
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github-actions
cat ~/.ssh/github-actions.pub >> ~/.ssh/authorized_keys

# ВАЖНО: Сохраните приватный ключ
cat ~/.ssh/github-actions
```

### Шаг 2: Настройте GitHub Secrets (3 минуты)

Перейдите: `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

Добавьте:
- **SSH_HOST**: `123.45.67.89` (IP вашего сервера)
- **SSH_USER**: `ubuntu` (ваш SSH пользователь)
- **SSH_PRIVATE_KEY**: (содержимое `~/.ssh/github-actions`)
- **DEPLOYMENT_URL**: `http://123.45.67.89` (для health check)

### Шаг 3: Запустите деплой (1 минута)

```bash
# Просто сделайте push в main/master
git push origin main

# ИЛИ запустите вручную в GitHub:
# Actions → Deploy to Production → Run workflow
```

**Готово!** Ваше приложение развернется автоматически.

---

## 🔧 Вариант 2: Ручной деплой (без GitHub Actions)

### Предварительные требования на сервере:

```bash
# Установите Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Установите PM2
sudo npm install -g pm2

# Создайте директорию
sudo mkdir -p /opt/apartment-project
sudo chown $USER:$USER /opt/apartment-project
```

### Деплой с локальной машины:

```bash
# 1. Соберите проект
npm run build

# 2. Запустите скрипт деплоя
export SSH_HOST=your-server-ip
export SSH_USER=your-username
chmod +x scripts/deploy-manual.sh
./scripts/deploy-manual.sh
```

---

## 📊 Проверка работы

```bash
# Подключитесь к серверу
ssh user@server

# Проверьте статус
pm2 status

# Посмотрите логи
pm2 logs apartment-project

# Проверьте в браузере
# http://your-server-ip:3000
```

---

## 🔄 Обновление приложения

### С GitHub Actions:
```bash
git push origin main  # Автоматический деплой
```

### Вручную на сервере:
```bash
ssh user@server
cd /opt/apartment-project
pm2 restart apartment-project
```

---

## 🆘 Быстрое решение проблем

### Приложение не запускается?
```bash
pm2 logs apartment-project --lines 50
```

### Порт занят?
```bash
sudo lsof -i :3000
pm2 delete apartment-project
pm2 start server.js --name apartment-project
```

### Не хватает памяти?
```bash
pm2 delete apartment-project
pm2 start server.js --name apartment-project --max-memory-restart 500M
```

---

## 📚 Подробная документация

Для детальной информации смотрите [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## ✅ Checklist

- [ ] Сервер с Node.js 18+ и PM2
- [ ] SSH доступ к серверу
- [ ] GitHub Secrets добавлены (для auto deploy)
- [ ] Firewall открыт (порты 22, 80)
- [ ] Push в main или запуск workflow
- [ ] Проверка http://your-server-ip:3000

**Вопросы?** Смотрите [DEPLOYMENT.md](./DEPLOYMENT.md) или откройте issue.
