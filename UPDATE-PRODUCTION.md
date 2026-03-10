# Инструкция по обновлению продакшн сайта

## Шаг 1: Подготовка файлов для сервера

Нужно загрузить обновленную базу данных на сервер:

```bash
# На локальной машине - создать резервную копию для сервера
cp dev.db dev-updated.db
```

## Шаг 2: Подключение к серверу

```bash
ssh vadim@95.179.150.195
```

## Шаг 3: Остановить сайт

```bash
cd /var/www/apartment-project
pm2 stop apartment-project
```

## Шаг 4: Создать резервную копию текущей БД

```bash
cp dev.db dev-backup-$(date +%Y%m%d-%H%M%S).db
```

## Шаг 5: Загрузить новую БД

На локальной машине:
```bash
scp dev-updated.db vadim@95.179.150.195:/var/www/apartment-project/dev.db
```

## Шаг 6: Подтянуть изменения кода с Git

На сервере:
```bash
cd /var/www/apartment-project
git pull origin main
```

## Шаг 7: Пересобрать проект

```bash
npm run build
```

## Шаг 8: Перезапустить сайт

```bash
pm2 restart apartment-project
pm2 save
```

## Шаг 9: Проверить логи

```bash
pm2 logs apartment-project --lines 50
```

## Быстрая команда (всё в одной строке)

На сервере после загрузки БД:
```bash
cd /var/www/apartment-project && git pull origin main && npm run build && pm2 restart apartment-project && pm2 logs apartment-project --lines 20
```

## Откат (если что-то пошло не так)

```bash
# Восстановить старую БД
cp dev-backup-YYYYMMDD-HHMMSS.db dev.db
pm2 restart apartment-project
```
