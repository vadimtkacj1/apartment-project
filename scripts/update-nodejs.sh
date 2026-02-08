#!/bin/bash
# Update Node.js to version 20 on server
# Запустите этот скрипт на сервере для обновления Node.js

set -e

echo "🔄 Updating Node.js to version 20..."
echo ""

# Check current version
CURRENT_VERSION=$(node --version 2>/dev/null || echo "not installed")
echo "Current Node.js version: $CURRENT_VERSION"

# Check if we need to update
if [[ "$CURRENT_VERSION" == v20* ]]; then
    echo "✅ Node.js 20 already installed!"
    exit 0
fi

echo ""
echo "📦 Installing Node.js 20 LTS..."

# Remove old Node.js repository if exists
sudo rm -f /etc/apt/sources.list.d/nodesource.list

# Add Node.js 20 repository
echo "Adding Node.js 20 repository..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js
echo "Installing Node.js 20..."
sudo apt-get install -y nodejs

# Verify installation
NEW_VERSION=$(node --version)
NPM_VERSION=$(npm --version)

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Node.js updated successfully!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Node.js version: $NEW_VERSION"
echo "npm version: $NPM_VERSION"
echo ""

# Restart PM2 processes if they exist
if command -v pm2 &> /dev/null; then
    echo "🔄 Restarting PM2 processes..."
    pm2 restart all || echo "No PM2 processes to restart"
    echo "✅ PM2 processes restarted"
fi

echo ""
echo "✅ Done! Node.js 20 is now installed and ready."
