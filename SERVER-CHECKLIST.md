# Чеклист при деплое на сервер

## 1. Ошибка "client reference manifest for route does not exist"

Это баг Next.js с route groups `(public)`. Решение: **чистая пересборка**.

На сервере перед деплоем:

```bash
cd /opt/apartment-project
rm -rf .next
npm run build
# затем ваш deploy-standalone или копирование
pm2 restart apartment-project --update-env
```

Если ошибка остаётся — обновите Next.js: `npm install next@latest`.

---

## 2. Ошибка "The requested resource isn't a valid image" (logos.png, sales.jpg)

Сервер не находит файлы из `public/images/`. Нужно, чтобы на сервере были:

- `public/images/logos.png`
- `public/images/hero/sales.jpg` (и при необходимости `main-hero.jpg`)

**Вариант А:** Добавить эти файлы в репозиторий в `public/images/` и `public/images/hero/`, затем задеплоить.

**Вариант Б:** Скопировать вручную на сервер:

```bash
# на сервере
mkdir -p /opt/apartment-project/public/images/hero
# скопировать logos.png в public/images/
# скопировать sales.jpg в public/images/hero/
```

После деплоя проверьте:

```bash
ls -la /opt/apartment-project/public/images/
ls -la /opt/apartment-project/public/images/hero/
```

---

## 3. 500.html / глобальные ошибки

Добавлен `app/global-error.tsx` — при необработанной ошибке показывается страница «שגיאה» с кнопкой «נסה שוב» вместо падения.

---

## 4. Фото из админки (404 на /uploads/properties/xxx.png)

**Сделано в коде:** nginx больше не раздаёт `/uploads/` с диска — запросы проксируются в Next.js. Приложение само и сохраняет, и отдаёт файлы из одной папки (нет рассинхрона путей).

**На сервере:**

1. **В `.env` задать (чтобы всё было в одной папке и не терялось при деплое):**
   ```bash
   UPLOADS_DIR=/opt/apartment-project/public/uploads
   ```

2. **Права на каталог** (под пользователем PM2, например `root` или `www-data`):
   ```bash
   mkdir -p /opt/apartment-project/public/uploads/properties
   chown -R $(whoami) /opt/apartment-project/public/uploads
   chmod -R 755 /opt/apartment-project/public/uploads
   ```

3. **Применить новый nginx.conf** (проксирование `/uploads/` в Next.js):
   ```bash
   sudo nginx -t && sudo systemctl reload nginx
   ```

4. **Перезапуск приложения:**
   ```bash
   pm2 restart apartment-project --update-env
   ```

После загрузки картинки в админке в логах будет строка вида `baseDir: ...` и `uploadDir: ...` — по ним видно, куда реально пишется файл.

---

## 5. Удалённая папка `public` внутри uploads/properties

Команда `rm -rf public` в каталоге `.../public/uploads/properties/` удалила подпапку `public` внутри `properties` (если она там была). На загрузку новых фото это не влияет. Структура должна быть: `public/uploads/properties/*.jpg`, без вложенной `public`.
