#!/bin/bash

echo "🔍 Checking server structure..."
echo ""

# Check standalone build
echo "📦 Standalone build:"
ls -la .next/standalone/.next/ 2>/dev/null || echo "  ❌ .next/standalone/.next/ not found"
echo ""

# Check public files
echo "📁 Public files in standalone:"
ls -la .next/standalone/public/ 2>/dev/null || echo "  ❌ .next/standalone/public/ not found"
echo ""

# Check static files
echo "📁 Static files:"
ls -la .next/static/ 2>/dev/null || echo "  ❌ .next/static/ not found"
echo ""

# Check actual public folder
echo "📁 Root public folder:"
ls -la public/images/ | head -10
echo ""
ls -la public/uploads/properties/ | head -10
echo ""

# Check if files need to be copied
echo "💡 For standalone output, you need to manually copy:"
echo "   1. public/ → .next/standalone/public/"
echo "   2. .next/static/ → .next/standalone/.next/static/"
