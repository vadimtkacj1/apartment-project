#!/bin/bash

# Auto-copy files after build for standalone output
# This runs automatically via postbuild hook

if [ ! -d ".next/standalone" ]; then
  echo "⚠️  Not a standalone build, skipping file copy"
  exit 0
fi

echo "📦 Copying files to standalone output..."

# Copy public folder
if [ -d "public" ]; then
  mkdir -p .next/standalone/public
  cp -r public/* .next/standalone/public/
  echo "✅ Public files copied"
fi

# Copy .next/static
if [ -d ".next/static" ]; then
  mkdir -p .next/standalone/.next/static
  cp -r .next/static/* .next/standalone/.next/static/
  echo "✅ Static files copied"
fi

echo "✨ Standalone build ready!"
