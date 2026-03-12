#!/bin/bash

# Auto-copy files after build for standalone output
# This runs automatically via postbuild hook

if [ ! -d ".next/standalone" ]; then
  echo "⚠️  Not a standalone build, skipping file copy"
  exit 0
fi

echo "📦 Copying files to standalone output..."

# Copy public folder (excluding uploads - they go to separate data directory)
if [ -d "public" ]; then
  mkdir -p .next/standalone/public
  # Copy all public files except uploads
  rsync -av --exclude 'uploads' public/ .next/standalone/public/ 2>/dev/null || cp -r public/* .next/standalone/public/ 2>/dev/null || true
  echo "✅ Public files copied"
fi

# Create uploads directory in standalone root (for production data)
mkdir -p .next/standalone/uploads
# Copy existing uploads if they exist
if [ -d "public/uploads" ]; then
  cp -r public/uploads/* .next/standalone/uploads/ 2>/dev/null || true
  echo "✅ Uploads directory created and populated"
fi

# Copy .next/static
if [ -d ".next/static" ]; then
  mkdir -p .next/standalone/.next/static
  cp -r .next/static/* .next/standalone/.next/static/
  echo "✅ Static files copied"
fi

echo "✨ Standalone build ready!"
