# 🔄 Backup & Restore Guide

## 📦 Что нужно бэкапить

1. **База данных SQLite** - `dev.db`
2. **Загруженные файлы** - `public/uploads/`
3. **Переменные окружения** - `.env`

---

## ✅ Создание Backup

### **1. Backup базы данных:**

```bash
# На сервере
cd /opt/apartment-project

# Создать папку для backups
mkdir -p backups

# Backup с датой
cp dev.db backups/dev.db.$(date +%Y%m%d_%H%M%S).backup

# Или простой backup
cp dev.db backups/dev.db.backup

# Проверить
ls -lh backups/
```

### **2. Backup uploads:**

```bash
# На сервере
cd /opt/apartment-project

# Создать архив uploads
tar -czf backups/uploads_$(date +%Y%m%d_%H%M%S).tar.gz public/uploads/

# Проверить
ls -lh backups/
```

### **3. Backup .env:**

```bash
# На сервере
cp .env backups/.env.backup
```

### **4. Полный backup (всё сразу):**

```bash
# На сервере
cd /opt/apartment-project

DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p backups/full_$DATE

cp dev.db backups/full_$DATE/
cp .env backups/full_$DATE/
cp -r public/uploads backups/full_$DATE/

# Создать архив
tar -czf backups/full_backup_$DATE.tar.gz backups/full_$DATE/
rm -rf backups/full_$DATE/

echo "✅ Full backup created: backups/full_backup_$DATE.tar.gz"
```

---

## 🔄 Восстановление из Backup

### **1. Restore базы данных:**

```bash
# На сервере
cd /opt/apartment-project

# Остановить приложение
pm2 stop apartment-project

# Создать backup текущей БД (на всякий случай)
cp dev.db dev.db.before_restore

# Восстановить из backup
cp backups/dev.db.backup dev.db

# Или из конкретного файла
cp backups/dev.db.20250312_143000.backup dev.db

# Перезапустить
pm2 start apartment-project
```

### **2. Restore uploads:**

```bash
# На сервере
cd /opt/apartment-project

# Создать backup текущих uploads (на всякий случай)
tar -czf backups/uploads_before_restore.tar.gz public/uploads/

# Восстановить из архива
tar -xzf backups/uploads_20250312_143000.tar.gz -C public/

# Или скопировать напрямую из другого сервера
rsync -avz root@backup-server:/backups/uploads/ public/uploads/
```

### **3. Restore .env:**

```bash
# На сервере
cp backups/.env.backup .env

# Перезапустить приложение
pm2 restart apartment-project
```

### **4. Полное восстановление:**

```bash
# На сервере
cd /opt/apartment-project

# Остановить приложение
pm2 stop apartment-project

# Распаковать backup
tar -xzf backups/full_backup_20250312_143000.tar.gz

# Восстановить файлы
cp backups/full_20250312_143000/dev.db ./
cp backups/full_20250312_143000/.env ./
cp -r backups/full_20250312_143000/uploads public/

# Перезапустить
pm2 restart apartment-project
```

---

## 💾 Скачать backup с сервера

### **На локальную машину:**

```bash
# Скачать БД
scp root@your-server:/opt/apartment-project/dev.db ./dev.db.backup

# Скачать uploads
rsync -avz root@your-server:/opt/apartment-project/public/uploads/ ./backups/uploads/

# Скачать всё
rsync -avz root@your-server:/opt/apartment-project/backups/ ./backups/
```

---

## 📤 Загрузить backup на сервер

### **С локальной машины:**

```bash
# Загрузить БД
scp ./dev.db.backup root@your-server:/opt/apartment-project/backups/

# Загрузить uploads
rsync -avz ./public/uploads/ root@your-server:/opt/apartment-project/public/uploads/
```

---

## 🤖 Автоматический backup (Cron)

### **Создать скрипт автобэкапа:**

```bash
# На сервере
nano /opt/apartment-project/scripts/auto-backup.sh
```

Содержимое:
```bash
#!/bin/bash

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/apartment-project/backups"
PROJECT_DIR="/opt/apartment-project"

# Создать папку
mkdir -p $BACKUP_DIR

# Backup БД
cp $PROJECT_DIR/dev.db $BACKUP_DIR/dev.db.$DATE.backup

# Backup uploads (только если есть изменения)
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz $PROJECT_DIR/public/uploads/

# Удалить старые backups (старше 7 дней)
find $BACKUP_DIR -name "*.backup" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "✅ Backup completed: $DATE"
```

Сделать исполняемым:
```bash
chmod +x /opt/apartment-project/scripts/auto-backup.sh
```

### **Настроить Cron (каждый день в 3:00):**

```bash
crontab -e
```

Добавить:
```
0 3 * * * /opt/apartment-project/scripts/auto-backup.sh >> /opt/apartment-project/backups/backup.log 2>&1
```

---

## 🔍 Проверка backup

```bash
# Проверить размер backup
ls -lh backups/

# Проверить содержимое архива
tar -tzf backups/uploads_20250312_143000.tar.gz | head -20

# Проверить БД
sqlite3 backups/dev.db.backup "SELECT COUNT(*) FROM Property;"
```

---

## 📋 Quick Commands

### Создать backup сейчас:
```bash
DATE=$(date +%Y%m%d_%H%M%S)
cp dev.db backups/dev.db.$DATE.backup
tar -czf backups/uploads_$DATE.tar.gz public/uploads/
```

### Восстановить последний backup:
```bash
pm2 stop apartment-project
cp backups/$(ls -t backups/*.backup | head -1) dev.db
pm2 start apartment-project
```

### Скачать всё с сервера:
```bash
rsync -avz root@your-server:/opt/apartment-project/backups/ ./local-backups/
```
