#!/bin/bash
# Quick fix script for missing .next build directory
# Run this on your server to fix the "Could not find a production build" error

set -e

APP_DIR="/opt/apartment-project"
APP_NAME="apartment-project"

echo "🔧 Fixing missing .next build directory..."
echo ""

cd $APP_DIR

# Check if standalone build exists
if [ ! -d ".next/standalone" ]; then
  echo "❌ Error: .next/standalone directory not found!"
  echo ""
  echo "💡 Solutions:"
  echo "1. Redeploy the project through GitHub Actions"
  echo "2. Or build locally and deploy manually"
  echo "3. Or build on server (requires all source files)"
  exit 1
fi

echo "✓ Found .next/standalone directory"

# Create proper .next directory structure
echo "📦 Setting up .next directory structure..."

# Create .next directory if it doesn't exist
mkdir -p .next

# Copy server files from standalone if they exist
if [ -d ".next/standalone/.next/server" ]; then
  echo "Copying server files from standalone..."
  mkdir -p .next/server
  cp -r .next/standalone/.next/server/. .next/server/ 2>/dev/null || true
fi

# Ensure static directory exists
if [ ! -d ".next/static" ]; then
  echo "⚠️  Warning: .next/static not found, creating..."
  mkdir -p .next/static
else
  echo "✓ .next/static exists"
fi

# Create BUILD_ID file if it doesn't exist
if [ ! -f ".next/BUILD_ID" ]; then
  if [ -f ".next/standalone/.next/BUILD_ID" ]; then
    cp .next/standalone/.next/BUILD_ID .next/BUILD_ID
    echo "✓ Copied BUILD_ID"
  else
    # Generate a BUILD_ID
    echo "$(date +%s)" > .next/BUILD_ID
    echo "✓ Created BUILD_ID"
  fi
else
  echo "✓ BUILD_ID exists"
fi

# For standalone mode, we need to ensure server.js is in the right place
if [ -f "server.js" ]; then
  echo "✓ server.js exists"
else
  if [ -f ".next/standalone/server.js" ]; then
    cp .next/standalone/server.js .
    echo "✓ Copied server.js from standalone"
  else
    echo "❌ Error: server.js not found!"
    exit 1
  fi
fi

# Verify structure
echo ""
echo "📋 Verifying structure:"
if [ -d ".next" ]; then
  echo "✓ .next directory exists"
fi
if [ -d ".next/static" ]; then
  echo "✓ .next/static exists"
fi
if [ -f ".next/BUILD_ID" ]; then
  echo "✓ .next/BUILD_ID exists"
fi
if [ -f "server.js" ]; then
  echo "✓ server.js exists"
fi

echo ""
echo "🔄 Restarting application..."
pm2 restart $APP_NAME || pm2 start server.js --name $APP_NAME --update-env
pm2 save

echo ""
echo "✅ Fix applied! Check logs with: pm2 logs $APP_NAME"

