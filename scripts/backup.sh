#!/bin/bash

# Quick backup script

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="backups"

echo "📦 Creating backup..."
echo ""

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
if [ -f "dev.db" ]; then
  cp dev.db $BACKUP_DIR/dev.db.$DATE.backup
  echo "✅ Database backed up: $BACKUP_DIR/dev.db.$DATE.backup"
else
  echo "⚠️  dev.db not found"
fi

# Backup uploads
if [ -d "public/uploads" ]; then
  tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz public/uploads/
  echo "✅ Uploads backed up: $BACKUP_DIR/uploads_$DATE.tar.gz"
else
  echo "⚠️  public/uploads not found"
fi

# Backup .env
if [ -f ".env" ]; then
  cp .env $BACKUP_DIR/.env.$DATE.backup
  echo "✅ .env backed up: $BACKUP_DIR/.env.$DATE.backup"
fi

echo ""
echo "✨ Backup complete!"
echo ""

# Show backup size
du -sh $BACKUP_DIR
ls -lh $BACKUP_DIR | tail -5
