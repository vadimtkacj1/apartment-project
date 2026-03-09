#!/bin/bash

# Database restore script
# Restores database from a backup file

# Configuration
DB_PATH="prisma/dev.db"
BACKUP_DIR="backups"

# Check if backup file is provided
if [ -z "$1" ]; then
    echo "Usage: $0 <backup-file>"
    echo ""
    echo "Available backups:"
    ls -lh $BACKUP_DIR/dev.db.backup-* 2>/dev/null || echo "  No backups found"
    exit 1
fi

BACKUP_FILE="$1"

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo "Error: Backup file not found: $BACKUP_FILE"
    exit 1
fi

# Create a safety backup of current database
if [ -f "$DB_PATH" ]; then
    SAFETY_BACKUP="$DB_PATH.before-restore-$(date +%Y%m%d-%H%M%S)"
    echo "Creating safety backup of current database: $SAFETY_BACKUP"
    cp "$DB_PATH" "$SAFETY_BACKUP"
fi

# Restore backup
echo "Restoring database from: $BACKUP_FILE"
cp "$BACKUP_FILE" "$DB_PATH"

if [ $? -eq 0 ]; then
    echo "✓ Database restored successfully"
    echo "⚠ Remember to restart the application: pm2 restart apartment-project"
    exit 0
else
    echo "✗ Error: Restore failed"
    exit 1
fi
