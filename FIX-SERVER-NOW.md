# 🚨 СРОЧНОЕ ИСПРАВЛЕНИЕ - Ошибки изображений на сервере

## Что случилось?

В базе данных есть ссылки на изображения, которых нет на сервере.
Это вызывает ошибки:
```
⨯ The requested resource isn't a valid image for /uploads/properties/...
```

## ✅ ЧТО НУЖНО СДЕЛАТЬ ПРЯМО СЕЙЧАС

### Шаг 1: Обновить код на сервере

```bash
# На локальной машине - закоммитить и запушить изменения
git add .
git commit -m "fix: add image validation and cleanup script"
git push origin main

# Подключиться к серверу
ssh root@your-server-ip

# Перейти в папку проекта
cd /opt/apartment-project

# Обновить код
git pull origin main

# Установить зависимости (если нужно)
npm install
```

### Шаг 2: Запустить скрипт очистки на сервере

```bash
# Находясь на сервере в /opt/apartment-project
npm run clean:images
```

Скрипт:
- ✅ Проверит все свойства в БД
- ✅ Удалит ссылки на несуществующие файлы
- ✅ Оставит только файлы, которые реально есть на диске

### Шаг 3: Пересобрать и перезапустить приложение

```bash
# На сервере
npm run build
pm2 restart apartment-project

# Проверить логи
pm2 logs apartment-project --lines 50
```

### Шаг 4: Проверить результат

Откройте сайт в браузере и проверьте консоль (F12).
Ошибок `The requested resource isn't a valid image` быть не должно!

---

## 📋 ПОЛНЫЕ КОМАНДЫ (скопировать и выполнить)

### На локальной машине (Windows):

```bash
# В папке проекта (Git Bash или PowerShell)
git add .
git commit -m "fix: add image validation and cleanup script"
git push origin main
```

### На сервере (через SSH):

```bash
# Подключиться
ssh root@your-server-ip

# Выполнить все команды одной строкой
cd /opt/apartment-project && \
git pull origin main && \
npm install && \
npm run clean:images && \
npm run build && \
pm2 restart apartment-project && \
pm2 logs apartment-project --lines 20
```

---

## 🔄 Что изменилось?

1. **API теперь автоматически фильтрует несуществующие изображения**
   - Клиент никогда не получит ссылки на несуществующие файлы
   - Предотвращает ошибки Next.js Image Optimizer

2. **Скрипт очистки базы данных** (`npm run clean:images`)
   - Удаляет ссылки на отсутствующие файлы
   - Можно запускать периодически

3. **Убран конфликтный rewrite в next.config.ts**
   - Файлы теперь обслуживаются напрямую из `public/uploads/`
   - Исправлены 400 ошибки от Image Optimizer

---

## 📝 На будущее

Чтобы проблема не повторялась:

1. **Перед деплоем** синхронизировать папку uploads:
   ```bash
   # Из локальной машины
   bash scripts/sync-uploads.sh
   # Выбрать "2" - загрузить на сервер
   ```

2. **Периодически запускать очистку** на сервере:
   ```bash
   npm run clean:images
   ```

3. **Рассмотреть переход на облачное хранилище** (S3, Cloudinary)
   - Файлы не потеряются при деплое
   - Автоматическая оптимизация изображений
   - CDN для быстрой загрузки
