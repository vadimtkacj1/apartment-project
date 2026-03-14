# PowerShell скрипт для синхронизации папки uploads между dev и production

# Настройки
$SERVER = "root@your-server-ip"
$SERVER_PATH = "/opt/apartment-project/public/uploads/"
$LOCAL_PATH = ".\public\uploads\"

Write-Host "`n📦 Синхронизация uploads`n" -ForegroundColor Yellow

# Меню
Write-Host "Выберите действие:"
Write-Host "1) Скачать файлы с сервера (server → local)"
Write-Host "2) Загрузить файлы на сервер (local → server)"
Write-Host "3) Показать различия"
$choice = Read-Host "Ваш выбор (1/2/3)"

switch ($choice) {
    "1" {
        Write-Host "`n⬇️  Скачивание файлов с сервера..." -ForegroundColor Yellow

        # Используем scp или rsync (если установлен Git Bash / WSL)
        if (Get-Command rsync -ErrorAction SilentlyContinue) {
            rsync -avz --progress --delete "${SERVER}:${SERVER_PATH}" $LOCAL_PATH
        } else {
            Write-Host "❌ rsync не найден. Используйте Git Bash или WSL:" -ForegroundColor Red
            Write-Host "   bash scripts/sync-uploads.sh" -ForegroundColor Cyan
            exit 1
        }

        Write-Host "✅ Готово!" -ForegroundColor Green
    }
    "2" {
        Write-Host "`n⚠️  ВНИМАНИЕ: Это перезапишет файлы на сервере!" -ForegroundColor Red
        $confirm = Read-Host "Вы уверены? (yes/no)"

        if ($confirm -eq "yes") {
            Write-Host "`n⬆️  Загрузка файлов на сервер..." -ForegroundColor Yellow

            if (Get-Command rsync -ErrorAction SilentlyContinue) {
                rsync -avz --progress $LOCAL_PATH "${SERVER}:${SERVER_PATH}"

                # Перезапустить приложение
                Write-Host "`n🔄 Перезапуск приложения на сервере..." -ForegroundColor Yellow
                ssh $SERVER "cd /opt/apartment-project && pm2 restart apartment-project"
                Write-Host "✅ Приложение перезапущено!" -ForegroundColor Green
            } else {
                Write-Host "❌ rsync не найден. Используйте Git Bash:" -ForegroundColor Red
                Write-Host "   bash scripts/sync-uploads.sh" -ForegroundColor Cyan
                exit 1
            }

            Write-Host "✅ Готово!" -ForegroundColor Green
        } else {
            Write-Host "❌ Отменено" -ForegroundColor Yellow
        }
    }
    "3" {
        Write-Host "`n🔍 Проверка различий..." -ForegroundColor Yellow

        if (Get-Command rsync -ErrorAction SilentlyContinue) {
            rsync -avz --dry-run --itemize-changes $LOCAL_PATH "${SERVER}:${SERVER_PATH}"
        } else {
            Write-Host "❌ rsync не найден. Используйте Git Bash:" -ForegroundColor Red
            Write-Host "   bash scripts/sync-uploads.sh" -ForegroundColor Cyan
            exit 1
        }
    }
    default {
        Write-Host "❌ Неверный выбор" -ForegroundColor Red
        exit 1
    }
}
