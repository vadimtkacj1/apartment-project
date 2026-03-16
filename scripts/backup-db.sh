#!/bin/bash

# Database backup script
# Creates automatic backups of the SQLite database

# Read DATABASE_URL from .env and extract the file path
if [ -f .env ]; then
    DB_URL=$(grep "^DATABASE_URL=" .env | cut -d'=' -f2 | tr -d '"')
    DB_PATH=$(echo "$DB_URL" | sed 's|file:||')
else
    echo "Error: .env file not found"
    exit 1
fi

# Configuration
BACKUP_DIR="backups"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_FILE="$BACKUP_DIR/dev.db.backup-$TIMESTAMP"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Check if database exists
if [ ! -f "$DB_PATH" ]; then
    echo "Error: Database file not found at $DB_PATH"
    exit 1
fi

# Create backup
echo "Creating backup: $BACKUP_FILE"
cp "$DB_PATH" "$BACKUP_FILE"

# Verify backup was created
if [ -f "$BACKUP_FILE" ]; then
    echo "✓ Backup created successfully: $BACKUP_FILE"

    # Keep only last 30 backups (delete older ones)
    ls -t $BACKUP_DIR/dev.db.backup-* | tail -n +31 | xargs -r rm
    echo "✓ Old backups cleaned up (keeping last 30)"

    # Show backup info
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo "  Size: $BACKUP_SIZE"

    exit 0
else
    echo "✗ Error: Backup failed"
    exit 1
fi
