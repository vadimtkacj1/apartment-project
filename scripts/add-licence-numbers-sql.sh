#!/bin/bash

# Direct SQL approach - no Node.js needed
# Reads DATABASE_URL from .env

set -e

# Read DATABASE_URL from .env
if [ -f .env ]; then
    DB_URL=$(grep "^DATABASE_URL=" .env | cut -d'=' -f2 | tr -d '"')
    DB_PATH=$(echo "$DB_URL" | sed 's|file:||')
else
    echo "Error: .env file not found"
    exit 1
fi

echo "Database: $DB_PATH"
echo "Adding licence numbers..."
echo ""

# Install sqlite3 if not present
if ! command -v sqlite3 &> /dev/null; then
    echo "Installing sqlite3..."
    apt-get update && apt-get install -y sqlite3
fi

# Create backup first
echo "Creating backup..."
BACKUP_DIR="backups"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
mkdir -p "$BACKUP_DIR"
cp "$DB_PATH" "$BACKUP_DIR/dev.db.backup-$TIMESTAMP"
echo "✓ Backup created: $BACKUP_DIR/dev.db.backup-$TIMESTAMP"
echo ""

# Check which table has the people
echo "Checking TeamMember table..."
sqlite3 "$DB_PATH" "SELECT id, name FROM TeamMember WHERE name LIKE '%חיים%' OR name LIKE '%רם%' OR name LIKE '%תומר%';"

echo ""
echo "Checking Owner table..."
sqlite3 "$DB_PATH" "SELECT id, name FROM Owner WHERE name LIKE '%חיים%' OR name LIKE '%רם%' OR name LIKE '%תומר%';"

echo ""
echo "Ready to update. Press Enter to continue or Ctrl+C to cancel..."
read

# Update licence numbers based on names
echo "Updating licence numbers..."

# Try TeamMember first
sqlite3 "$DB_PATH" "UPDATE TeamMember SET licenceNumber = '3164492' WHERE name LIKE '%חיים%';"
sqlite3 "$DB_PATH" "UPDATE TeamMember SET licenceNumber = '3019640' WHERE name LIKE '%רם%';"
sqlite3 "$DB_PATH" "UPDATE TeamMember SET licenceNumber = '3082916' WHERE name LIKE '%תומר%';"

# Then try Owner
sqlite3 "$DB_PATH" "UPDATE Owner SET licenceNumber = '3164492' WHERE name LIKE '%חיים%';"
sqlite3 "$DB_PATH" "UPDATE Owner SET licenceNumber = '3019640' WHERE name LIKE '%רם%';"
sqlite3 "$DB_PATH" "UPDATE Owner SET licenceNumber = '3082916' WHERE name LIKE '%תומר%';"

echo "✓ Licence numbers updated!"
echo ""

# Verify
echo "Verification:"
echo "TeamMember:"
sqlite3 "$DB_PATH" "SELECT name, licenceNumber FROM TeamMember WHERE licenceNumber IS NOT NULL;"
echo ""
echo "Owner:"
sqlite3 "$DB_PATH" "SELECT name, licenceNumber FROM Owner WHERE licenceNumber IS NOT NULL;"

echo ""
echo "Restarting application..."
pm2 restart apartment-project

echo ""
echo "✓ Done! Check the website."
