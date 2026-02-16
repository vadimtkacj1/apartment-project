#!/bin/bash
# Fix better-sqlite3 native module compilation issue
# Run this on the server

set -e

APP_DIR="/opt/apartment-project"
cd $APP_DIR

echo "🔧 Fixing better-sqlite3 native module..."
echo ""

# Install build tools
echo "1️⃣ Installing build tools..."
sudo apt-get update -qq
sudo apt-get install -y python3 make g++ || echo "⚠️ Build tools may already be installed"
echo ""

# Rebuild better-sqlite3
echo "2️⃣ Rebuilding better-sqlite3..."
npm rebuild better-sqlite3
echo ""

# Verify installation
echo "3️⃣ Verifying better-sqlite3..."
if [ -f "node_modules/better-sqlite3/build/Release/better_sqlite3.node" ]; then
    echo "✅ better-sqlite3 compiled successfully"
else
    echo "❌ better-sqlite3 compilation failed"
    echo "Trying alternative: npm install better-sqlite3 --build-from-source"
    npm install better-sqlite3 --build-from-source
fi
echo ""

# Restart PM2
echo "4️⃣ Restarting application..."
pm2 restart apartment-project || pm2 start server.js --name apartment-project
pm2 save
echo ""

echo "✅ Fix complete!"
echo ""
echo "📋 Test the fix:"
echo "  npm run seed:admin"
echo "  pm2 logs apartment-project --lines 20"




