#!/bin/bash
# Fix "Failed to find Server Action" error
# This script clears Next.js cache and forces a fresh restart

set -e

APP_DIR="/opt/apartment-project"
APP_NAME="apartment-project"

echo "🔧 Fixing Server Action errors..."
echo ""

cd $APP_DIR

# Stop the application first
echo "⏹️  Stopping application..."
pm2 stop $APP_NAME || true

# Clear Next.js cache
echo "🗑️  Clearing Next.js cache..."
rm -rf .next/cache

# Clear PM2 logs to make debugging easier
echo "🗑️  Clearing old PM2 logs..."
pm2 flush $APP_NAME || true

# Option 1: If we have a standalone build, ensure it's properly set up
if [ -d ".next/standalone" ]; then
    echo "📦 Using existing standalone build..."

    # Ensure proper directory structure
    mkdir -p .next

    # Copy server files from standalone
    if [ -d ".next/standalone/.next/server" ]; then
        echo "   Copying server files..."
        rm -rf .next/server
        cp -r .next/standalone/.next/server .next/
    fi

    # Ensure static directory exists
    if [ ! -d ".next/static" ]; then
        echo "   Creating static directory..."
        mkdir -p .next/static
    fi

    # Update BUILD_ID
    if [ -f ".next/standalone/.next/BUILD_ID" ]; then
        cp .next/standalone/.next/BUILD_ID .next/BUILD_ID
        echo "   ✓ Updated BUILD_ID"
    fi

    # Ensure server.js is in the right place
    if [ -f ".next/standalone/server.js" ] && [ ! -f "server.js" ]; then
        cp .next/standalone/server.js .
        echo "   ✓ Copied server.js"
    fi
fi

# Option 2: If source files exist, we can rebuild on server
if [ -d "src" ] && [ -f "package.json" ] && [ ! -d ".next/standalone" ]; then
    echo "⚠️  No standalone build found. Attempting to rebuild..."
    echo "   This may take a few minutes..."

    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo "   Installing dependencies..."
        npm ci --production=false
    fi

    # Build the application
    echo "   Building application..."
    npm run build

    echo "   ✓ Build completed"
fi

# Verify critical files exist
echo ""
echo "📋 Verifying files..."
if [ ! -f "server.js" ]; then
    echo "❌ Error: server.js not found!"
    echo "   Please redeploy the application."
    exit 1
fi
if [ ! -d ".next" ]; then
    echo "❌ Error: .next directory not found!"
    echo "   Please redeploy the application."
    exit 1
fi
echo "   ✓ All critical files present"

# Start the application with fresh environment
echo ""
echo "▶️  Starting application..."
pm2 delete $APP_NAME || true
pm2 start server.js --name $APP_NAME --update-env
pm2 save

# Wait for startup
echo "⏳ Waiting for application to start..."
sleep 5

# Check status
echo ""
echo "📊 Application status:"
pm2 status $APP_NAME

# Health check
echo ""
echo "🏥 Running health check..."
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Application is running!"
    echo ""
    echo "🎉 Server Action errors should be fixed!"
else
    echo "⚠️  Warning: Health check failed"
    echo "   Check logs with: pm2 logs $APP_NAME"
fi

echo ""
echo "📋 Useful commands:"
echo "   View logs:    pm2 logs $APP_NAME"
echo "   Check status: pm2 status"
echo "   Restart:      pm2 restart $APP_NAME"
