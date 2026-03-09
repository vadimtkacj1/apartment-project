#!/bin/bash

# Setup cron job for automatic database backups

PROJECT_DIR=$(pwd)

echo "======================================="
echo "  Database Backup - Cron Setup"
echo "======================================="
echo ""
echo "Select backup interval:"
echo ""
echo "  1) Every 2 hours (recommended for production)"
echo "  2) Every 4 hours"
echo "  3) Every 6 hours"
echo "  4) Every 12 hours"
echo "  5) Once daily at 2:00 AM"
echo ""

# If argument provided, use it, otherwise ask user
if [ -n "$1" ]; then
    CHOICE=$1
else
    read -p "Enter choice [1-5] (default: 3): " CHOICE
    CHOICE=${CHOICE:-3}
fi

# Set cron schedule based on choice
case $CHOICE in
    1)
        CRON_SCHEDULE="0 */2 * * *"
        DESCRIPTION="Every 2 hours"
        ;;
    2)
        CRON_SCHEDULE="0 */4 * * *"
        DESCRIPTION="Every 4 hours"
        ;;
    3)
        CRON_SCHEDULE="0 */6 * * *"
        DESCRIPTION="Every 6 hours"
        ;;
    4)
        CRON_SCHEDULE="0 */12 * * *"
        DESCRIPTION="Every 12 hours"
        ;;
    5)
        CRON_SCHEDULE="0 2 * * *"
        DESCRIPTION="Daily at 2:00 AM"
        ;;
    *)
        echo "Invalid choice. Using default: Every 6 hours"
        CRON_SCHEDULE="0 */6 * * *"
        DESCRIPTION="Every 6 hours"
        ;;
esac

CRON_JOB="$CRON_SCHEDULE cd $PROJECT_DIR && bash scripts/backup-db.sh >> logs/backup.log 2>&1"

echo ""
echo "Selected: $DESCRIPTION"
echo "Cron schedule: $CRON_SCHEDULE"
echo ""

# Create logs directory if it doesn't exist
mkdir -p logs

# Check if cron job already exists
if crontab -l 2>/dev/null | grep -q "scripts/backup-db.sh"; then
    echo "⚠ Cron job already exists."
    echo ""
    echo "Current backup schedule:"
    crontab -l | grep "backup-db.sh"
    echo ""
    read -p "Replace with new schedule? [y/N]: " REPLACE

    if [[ $REPLACE =~ ^[Yy]$ ]]; then
        # Remove old cron job and add new one
        (crontab -l 2>/dev/null | grep -v "scripts/backup-db.sh"; echo "$CRON_JOB") | crontab -
        echo "✓ Cron job updated successfully"
    else
        echo "Keeping existing schedule"
        exit 0
    fi
else
    # Add cron job
    (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
    echo "✓ Cron job added successfully"
fi

echo ""
echo "======================================="
echo "  Backup Configuration"
echo "======================================="
echo "  Schedule: $DESCRIPTION"
echo "  Storage: backups/"
echo "  Logs: logs/backup.log"
echo "  Retention: Last 30 backups"
echo "======================================="
echo ""
echo "Useful commands:"
echo "  View schedule:  crontab -l"
echo "  View logs:      tail -f logs/backup.log"
echo "  Remove cron:    crontab -e"
echo "  Manual backup:  bash scripts/backup-db.sh"
echo ""
