#!/bin/bash
# Script to rebuild better-sqlite3 on the server

cd /opt/apartment-project

echo "🔧 Rebuilding better-sqlite3..."
npm rebuild better-sqlite3

echo "✅ Rebuild complete!"
echo ""
echo "Now you can run: npm run seed:admin"

