#!/bin/bash
# Script to check if all required files exist for building on server

APP_DIR="/opt/apartment-project"

echo "🔍 Checking required files for build..."
echo ""

cd $APP_DIR

# Check critical files
MISSING_FILES=0

echo "Checking source files:"
if [ ! -f "src/components/AccessibilityWidget.tsx" ]; then
  echo "❌ Missing: src/components/AccessibilityWidget.tsx"
  MISSING_FILES=$((MISSING_FILES + 1))
else
  echo "✓ src/components/AccessibilityWidget.tsx"
fi

if [ ! -f "src/components/Providers.tsx" ]; then
  echo "❌ Missing: src/components/Providers.tsx"
  MISSING_FILES=$((MISSING_FILES + 1))
else
  echo "✓ src/components/Providers.tsx"
fi

echo ""
echo "Checking configuration files:"
if [ ! -f "tsconfig.json" ]; then
  echo "❌ Missing: tsconfig.json"
  MISSING_FILES=$((MISSING_FILES + 1))
else
  echo "✓ tsconfig.json"
fi

if [ ! -f "next.config.ts" ] && [ ! -f "next.config.js" ]; then
  echo "❌ Missing: next.config.ts or next.config.js"
  MISSING_FILES=$((MISSING_FILES + 1))
else
  echo "✓ next.config.*"
fi

if [ ! -f "middleware.ts" ]; then
  echo "⚠️  Missing: middleware.ts (optional)"
else
  echo "✓ middleware.ts"
fi

echo ""
echo "Checking package files:"
if [ ! -f "package.json" ]; then
  echo "❌ Missing: package.json"
  MISSING_FILES=$((MISSING_FILES + 1))
else
  echo "✓ package.json"
fi

echo ""
if [ $MISSING_FILES -gt 0 ]; then
  echo "❌ Found $MISSING_FILES missing file(s)"
  echo ""
  echo "💡 Solution:"
  echo "1. If you're trying to build on server, make sure all source files are deployed"
  echo "2. If project is already built, use 'npm start' or PM2 instead of 'npm run build'"
  echo "3. Check if files exist in deployment package"
  exit 1
else
  echo "✅ All required files are present!"
  echo ""
  echo "💡 Note: If project is already built (.next/standalone exists),"
  echo "   you should use 'npm start' or PM2 instead of 'npm run build'"
fi

