#!/bin/bash

# Auto-copy files after build for standalone output
# This runs automatically via postbuild hook

if [ ! -d ".next/standalone" ]; then
  echo "⚠️  Not a standalone build, skipping file copy"
  exit 0
fi

echo "📦 Copying files to standalone output..."

# Copy public folder INCLUDING uploads - API uses public/uploads for consistency
if [ -d "public" ]; then
  mkdir -p .next/standalone/public
  if command -v rsync &> /dev/null; then
    rsync -av public/ .next/standalone/public/
  else
    cp -r public/* .next/standalone/public/ 2>/dev/null || true
  fi
  echo "✅ Public files copied (including uploads)"
fi

# Copy .next/static
if [ -d ".next/static" ]; then
  mkdir -p .next/standalone/.next/static
  cp -r .next/static/* .next/standalone/.next/static/
  echo "✅ Static files copied"
fi

echo "✨ Standalone build ready!"
