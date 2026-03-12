#!/bin/bash

# Quick restore script

echo "🔄 Available backups:"
echo ""

# List database backups
echo "📊 Database backups:"
ls -lht backups/*.backup 2>/dev/null | head -5 || echo "  No database backups found"
echo ""

# List uploads backups
echo "📁 Uploads backups:"
ls -lht backups/*.tar.gz 2>/dev/null | head -5 || echo "  No uploads backups found"
echo ""

# Ask which backup to restore
echo "Choose what to restore:"
echo "1) Latest database backup"
echo "2) Latest uploads backup"
echo "3) Specific backup (enter filename)"
echo "4) Cancel"
read -p "Enter choice (1-4): " choice

case $choice in
  1)
    LATEST_DB=$(ls -t backups/*.backup 2>/dev/null | head -1)
    if [ -z "$LATEST_DB" ]; then
      echo "❌ No database backup found"
      exit 1
    fi

    echo "⚠️  WARNING: This will overwrite current database!"
    read -p "Continue? (yes/no): " confirm

    if [ "$confirm" = "yes" ]; then
      # Backup current DB first
      cp dev.db dev.db.before_restore_$(date +%Y%m%d_%H%M%S)

      # Restore
      cp $LATEST_DB dev.db
      echo "✅ Database restored from: $LATEST_DB"
      echo "💡 Restart app: pm2 restart apartment-project"
    else
      echo "❌ Cancelled"
    fi
    ;;

  2)
    LATEST_UPLOADS=$(ls -t backups/*.tar.gz 2>/dev/null | head -1)
    if [ -z "$LATEST_UPLOADS" ]; then
      echo "❌ No uploads backup found"
      exit 1
    fi

    echo "⚠️  WARNING: This will overwrite current uploads!"
    read -p "Continue? (yes/no): " confirm

    if [ "$confirm" = "yes" ]; then
      # Backup current uploads first
      tar -czf backups/uploads_before_restore_$(date +%Y%m%d_%H%M%S).tar.gz public/uploads/

      # Restore
      tar -xzf $LATEST_UPLOADS -C .
      echo "✅ Uploads restored from: $LATEST_UPLOADS"
    else
      echo "❌ Cancelled"
    fi
    ;;

  3)
    read -p "Enter backup filename (from backups/): " filename

    if [ ! -f "backups/$filename" ]; then
      echo "❌ File not found: backups/$filename"
      exit 1
    fi

    if [[ $filename == *.backup ]]; then
      cp dev.db dev.db.before_restore_$(date +%Y%m%d_%H%M%S)
      cp backups/$filename dev.db
      echo "✅ Database restored"
      echo "💡 Restart app: pm2 restart apartment-project"
    elif [[ $filename == *.tar.gz ]]; then
      tar -czf backups/uploads_before_restore_$(date +%Y%m%d_%H%M%S).tar.gz public/uploads/
      tar -xzf backups/$filename -C .
      echo "✅ Uploads restored"
    else
      echo "❌ Unknown file type"
    fi
    ;;

  4)
    echo "❌ Cancelled"
    exit 0
    ;;

  *)
    echo "❌ Invalid choice"
    exit 1
    ;;
esac
