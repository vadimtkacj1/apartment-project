#!/bin/bash

# Deploy script for Next.js standalone output
# This script properly copies all necessary files for standalone build

set -e  # Exit on error

echo "🚀 Deploying Next.js standalone build..."
echo ""

# Build the application
echo "📦 Building application..."
npm run build

# Check if build succeeded
if [ ! -d ".next/standalone" ]; then
  echo "❌ Error: .next/standalone directory not found!"
  echo "   Make sure output: 'standalone' is set in next.config.ts"
  exit 1
fi

echo "✅ Build complete!"
echo ""

# Copy public folder to standalone (excluding uploads - they go to separate data directory)
echo "📁 Copying public folder to standalone..."
if [ -d "public" ]; then
  mkdir -p .next/standalone/public
  if command -v rsync &> /dev/null; then
    rsync -av --exclude 'uploads' public/ .next/standalone/public/
  else
    # Use find to copy all files except uploads directory
    (cd public && find . -type f ! -path './uploads/*' -exec sh -c 'mkdir -p "../.next/standalone/public/$(dirname "{}")" && cp "{}" "../.next/standalone/public/{}"' \;)
  fi
  echo "✅ Public folder copied (excluding uploads)!"
else
  echo "⚠️  Warning: public folder not found"
fi

# Create uploads directory in standalone root (for production data)
echo "📁 Creating uploads directory for production..."
mkdir -p .next/standalone/uploads
if [ -d "public/uploads" ]; then
  # Copy existing uploads structure
  cp -r public/uploads/* .next/standalone/uploads/ 2>/dev/null || true
  echo "✅ Uploads directory created and populated!"
else
  mkdir -p .next/standalone/uploads/properties
  mkdir -p .next/standalone/uploads/owners
  mkdir -p .next/standalone/uploads/team
  echo "✅ Uploads directory structure created!"
fi
echo ""

# Copy .next/static to standalone
echo "📁 Copying .next/static to standalone..."
if [ -d ".next/static" ]; then
  mkdir -p .next/standalone/.next/static
  cp -r .next/static/* .next/standalone/.next/static/
  echo "✅ Static files copied!"
else
  echo "❌ Error: .next/static not found!"
  exit 1
fi
echo ""

# Show structure
echo "📋 Standalone structure:"
ls -la .next/standalone/
echo ""

echo "✨ Deployment preparation complete!"
echo ""
echo "💡 Next steps:"
echo "   1. Make sure PM2 is starting from .next/standalone/"
echo "   2. Run: pm2 restart apartment-project"
echo ""
