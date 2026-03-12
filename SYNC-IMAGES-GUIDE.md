# 📸 Руководство по синхронизации изображений

## Проблема

Файлы загружаются через админ-панель на **сервер**, но при деплое они **удаляются** или не синхронизируются. База данных содержит ссылки на файлы, которых больше нет.

---

## ✅ Правильный процесс

### **Шаг 1: Проверить какие файлы отсутствуют**

#### На сервере:
```bash
ssh root@your-server-ip
cd /opt/apartment-project
npm run check:images
```

Это покажет список отсутствующих файлов **БЕЗ удаления** из БД.

#### Локально:
```bash
npm run check:images
```

---

### **Шаг 2: Выбрать стратегию**

#### **Вариант A: Файлы есть на сервере (скачать)**

Если файлы загружались на сервер через админку:

```bash
# На локальной машине (Git Bash)
bash scripts/download-from-server.sh
```

Или вручную:
```bash
rsync -avz --progress root@your-server-ip:/opt/apartment-project/public/uploads/ ./public/uploads/
```

Потом закоммитить файлы в git:
```bash
git add public/uploads/
git commit -m "sync: download images from server"
git push
```

---

#### **Вариант B: Файлы есть локально (загрузить)**

Если файлы есть у вас локально:

```bash
# На локальной машине (Git Bash)
bash scripts/sync-uploads.sh
# Выбрать "2" - загрузить на сервер
```

Или вручную:
```bash
rsync -avz --progress ./public/uploads/ root@your-server-ip:/opt/apartment-project/public/uploads/
```

---

#### **Вариант C: Файлов нигде нет (очистить БД)**

Если файлы потеряны и их нельзя восстановить:

**На сервере:**
```bash
ssh root@your-server-ip
cd /opt/apartment-project
npm run clean:images
pm2 restart apartment-project
```

**Локально:**
```bash
npm run clean:images
```

---

## 🔄 Автоматизация на будущее

### **Вариант 1: Git LFS (рекомендуется для малых проектов)**

Хранить файлы в Git с использованием Git LFS:

```bash
# Один раз настроить
git lfs install
git lfs track "public/uploads/**/*"
git add .gitattributes

# Потом файлы будут автоматически синхронизироваться
git add public/uploads/
git commit -m "add uploaded images"
git push
```

---

### **Вариант 2: Облачное хранилище (рекомендуется для production)**

Использовать сервисы:
- **Cloudinary** (бесплатно до 25GB)
- **AWS S3**
- **DigitalOcean Spaces**

Преимущества:
- ✅ Автоматическая синхронизация
- ✅ CDN для быстрой загрузки
- ✅ Автоматическая оптимизация изображений
- ✅ Не теряются при деплое

---

### **Вариант 3: Скрипт синхронизации в CI/CD**

Добавить в процесс деплоя:

```bash
# В скрипте деплоя перед git pull
rsync -avz $SERVER:/opt/apartment-project/public/uploads/ ./public/uploads/
git add public/uploads/
git commit -m "sync: backup uploads before deploy" || true

# После git pull
rsync -avz ./public/uploads/ $SERVER:/opt/apartment-project/public/uploads/
```

---

## 📋 Быстрые команды

### Проверка
```bash
npm run check:images    # Показать отсутствующие файлы
```

### Скачать с сервера
```bash
rsync -avz root@IP:/opt/apartment-project/public/uploads/ ./public/uploads/
```

### Загрузить на сервер
```bash
rsync -avz ./public/uploads/ root@IP:/opt/apartment-project/public/uploads/
ssh root@IP "pm2 restart apartment-project"
```

### Очистить БД (если файлов нет)
```bash
npm run clean:images    # Удалить ссылки на отсутствующие файлы
```

---

## ⚠️ Важно

1. **Перед деплоем** всегда синхронизируйте папку `public/uploads/`
2. **После загрузки файлов через админку** на сервере - скачайте их локально
3. **Не запускайте** `npm run clean:images` если файлы можно восстановить!
4. **Рассмотрите** переход на облачное хранилище для production
