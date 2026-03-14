#!/bin/bash

# Migration script with automatic backup
# Creates a backup before running database migrations

echo "==================================="
echo "Database Migration with Auto-Backup"
echo "==================================="
echo ""

# Step 1: Create backup
echo "Step 1: Creating backup..."
bash scripts/backup-db.sh

if [ $? -ne 0 ]; then
    echo "✗ Backup failed. Aborting migration."
    exit 1
fi

echo ""
echo "Step 2: Running database migration..."

# Step 2: Run Prisma migration
npx prisma db push

if [ $? -eq 0 ]; then
    echo "✓ Migration completed successfully"

    # Step 3: Regenerate Prisma client
    echo ""
    echo "Step 3: Regenerating Prisma client..."
    npx prisma generate

    if [ $? -eq 0 ]; then
        echo "✓ Prisma client regenerated"

        # Step 4: Restart application
        echo ""
        echo "Step 4: Restarting application..."
        pm2 restart apartment-project

        echo ""
        echo "==================================="
        echo "✓ Migration completed successfully!"
        echo "==================================="
        exit 0
    else
        echo "✗ Error regenerating Prisma client"
        exit 1
    fi
else
    echo "✗ Migration failed"
    echo "⚠ Database backup is available in backups/ directory"
    exit 1
fi
