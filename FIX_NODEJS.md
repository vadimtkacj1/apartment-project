# 🔧 Исправление: Node.js версия

## Проблема
GitHub Actions и сервер требуют Node.js 20+ для Next.js 16.

## ✅ Что исправлено

1. ✅ GitHub Actions workflows обновлены на Node.js 20
2. ✅ Скрипт setup-server.sh обновлён на Node.js 20
3. ✅ Создан скрипт для обновления Node.js на существующем сервере

---

## 🚀 ЧТО ДЕЛАТЬ

### Шаг 1: Обновите Node.js на сервере (ВАЖНО!)

Если у вас уже установлен Node.js 18 на сервере, обновите его:

```bash
# Подключитесь к серверу
ssh ваш-пользователь@ваш-IP

# Вариант А: Автоматический скрипт
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Проверьте версию
node --version  # Должно быть v20.x.x

# Если PM2 уже запущен, перезапустите приложение
pm2 restart apartment-project
```

**ИЛИ используйте наш скрипт:**

```bash
# На сервере
cd /opt/apartment-project
curl -o update-nodejs.sh https://raw.githubusercontent.com/YOUR_USERNAME/apartment-project/main/scripts/update-nodejs.sh
chmod +x update-nodejs.sh
./update-nodejs.sh
```

---

### Шаг 2: Закоммитьте изменения

```bash
# На вашем компьютере
cd c:\Users\vadim\Downloads\apartment-project

git add .
git commit -m "Fix: Update to Node.js 20 for all environments"
git push origin dev
```

---

### Шаг 3: Проверка

После push в GitHub:

1. Перейдите в **Actions** на GitHub
2. Workflow "CI - Build & Test" должен пройти успешно ✅
3. Workflow "Deploy to Production" также должен быть успешным ✅

На сервере:

```bash
ssh user@server
node --version  # v20.x.x
pm2 logs apartment-project
```

---

## 📋 Быстрые команды

### На сервере (обновить Node.js):
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version
pm2 restart apartment-project
```

### На компьютере (коммит):
```bash
cd c:\Users\vadim\Downloads\apartment-project
git add .
git commit -m "Fix: Update to Node.js 20"
git push origin dev
```

---

## ✅ После исправления

Всё должно работать:
- ✅ GitHub Actions собирает проект
- ✅ Деплой проходит успешно
- ✅ Приложение работает на сервере

---

## 🆘 Если всё ещё не работает

### Проблема: GitHub Actions всё ещё падает

Проверьте логи в GitHub Actions - возможно другая ошибка.

### Проблема: Приложение не запускается на сервере

```bash
# Проверьте версию Node.js
ssh user@server 'node --version'

# Должно быть v20.x.x, если нет:
ssh user@server 'curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt-get install -y nodejs'

# Перезапустите приложение
ssh user@server 'pm2 restart apartment-project'
```

---

**Сначала обновите Node.js на сервере, потом сделайте push!** 🚀
