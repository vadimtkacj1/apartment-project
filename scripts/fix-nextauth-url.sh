#!/bin/bash
# Quick fix script for NEXTAUTH_URL error
# Run this on your server to fix the ERR_INVALID_URL error

set -e

APP_DIR="/opt/apartment-project"
APP_NAME="apartment-project"

echo "🔧 Fixing NEXTAUTH_URL error..."
echo ""

cd $APP_DIR

# Check if .env exists
if [ ! -f ".env" ]; then
  echo "❌ .env file not found!"
  exit 1
fi

# Get current NEXTAUTH_URL from .env
CURRENT_URL=$(grep "^NEXTAUTH_URL=" .env | cut -d'=' -f2 | tr -d '"' || echo "")

# Determine correct NEXTAUTH_URL
if [ -z "$CURRENT_URL" ] || [ "$CURRENT_URL" = "" ]; then
  # Try to get server IP
  SERVER_IP=$(hostname -I | awk '{print $1}' 2>/dev/null || echo "")
  
  if [ -n "$SERVER_IP" ]; then
    NEW_URL="http://${SERVER_IP}"
  else
    # Try to get from nginx config or use localhost
    NEW_URL="http://localhost:3000"
  fi
  
  echo "🔗 Setting NEXTAUTH_URL to: $NEW_URL"
  
  # Update .env file
  if grep -q "^NEXTAUTH_URL=" .env; then
    sed -i "s|^NEXTAUTH_URL=.*|NEXTAUTH_URL=\"${NEW_URL}\"|" .env
  else
    echo "NEXTAUTH_URL=\"${NEW_URL}\"" >> .env
  fi
else
  echo "✓ NEXTAUTH_URL is already set: $CURRENT_URL"
  NEW_URL="$CURRENT_URL"
fi

# Verify .env file
echo ""
echo "📋 Current .env file:"
grep -E "^(NODE_ENV|PORT|HOSTNAME|DATABASE_URL|NEXTAUTH_SECRET|NEXTAUTH_URL)=" .env | sed 's/=.*/=***/' || true

# Restart PM2
echo ""
echo "🔄 Restarting application..."
pm2 restart $APP_NAME || pm2 start server.js --name $APP_NAME --update-env
pm2 save

echo ""
echo "✅ Fix applied! Check logs with: pm2 logs $APP_NAME"

