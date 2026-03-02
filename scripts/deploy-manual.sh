#!/bin/bash
# Manual Deployment Script
# Use this for manual deployments without GitHub Actions

set -e

# Configuration
SERVER_USER="${SSH_USER:-root}"
SERVER_HOST="${SSH_HOST}"
SERVER_PORT="${SSH_PORT:-22}"
APP_DIR="/opt/apartment-project"
APP_NAME="apartment-project"

# Check if server details are provided
if [ -z "$SERVER_HOST" ]; then
    echo "❌ Error: SERVER_HOST not set"
    echo "Usage: SSH_HOST=your-server.com SSH_USER=user ./scripts/deploy-manual.sh"
    exit 1
fi

echo "🚀 Manual deployment starting..."
echo "Server: $SERVER_USER@$SERVER_HOST:$SERVER_PORT"
echo ""

# Build locally
echo "📦 Building application..."
npm run build

# Verify standalone build
if [ ! -d ".next/standalone" ]; then
    echo "❌ Error: .next/standalone not found"
    echo "Make sure next.config.ts has output: 'standalone'"
    exit 1
fi

# Create deployment package
echo "📦 Creating deployment package..."
rm -rf deploy deploy.tar.gz
mkdir -p deploy

# Copy standalone build (excluding database files)
echo "📦 Copying standalone build (excluding .db files)..."
rsync -av --exclude='*.db' --exclude='*.db-*' .next/standalone/ deploy/ || {
    echo "⚠️ rsync not available, using cp with find..."
    cp -r .next/standalone/. deploy/
    find deploy -name "*.db" -o -name "*.db-*" | xargs rm -f 2>/dev/null || true
}

# Copy static files (CRITICAL for Next.js)
mkdir -p deploy/.next/static
cp -r .next/static/. deploy/.next/static/

# Copy public files
if [ -d "public" ]; then
    mkdir -p deploy/public
    cp -r public/. deploy/public/
fi

# Copy src directory (CRITICAL for rebuilding if needed)
if [ -d "src" ]; then
    echo "📦 Copying source files..."
    mkdir -p deploy/src
    cp -r src/. deploy/src/
fi

# Copy TypeScript config if exists
if [ -f "tsconfig.json" ]; then
    cp tsconfig.json deploy/
fi

# Copy middleware if exists
if [ -f "middleware.ts" ]; then
    cp middleware.ts deploy/
fi

# Create production package.json
cat > deploy/package.json << EOF
{
  "name": "apartment-project-production",
  "version": "1.0.0",
  "scripts": {
    "start": "node server.js"
  }
}
EOF

# Create tarball
tar -czf deploy.tar.gz deploy/
echo "✅ Deployment package created"

# Upload to server
echo "📤 Uploading to server..."
scp -P $SERVER_PORT deploy.tar.gz $SERVER_USER@$SERVER_HOST:/tmp/

# Deploy on server
echo "🚀 Deploying on server..."
ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST << 'ENDSSH'
set -e

APP_DIR="/opt/apartment-project"
APP_NAME="apartment-project"

echo "📦 Extracting deployment..."
sudo mkdir -p $APP_DIR /var/lib/apartment-project
sudo chown $USER:$USER $APP_DIR /var/lib/apartment-project

# Backup existing .env if it exists
if [ -f "$APP_DIR/.env" ]; then
    echo "💾 Backing up existing .env..."
    cp $APP_DIR/.env /tmp/.env.backup
fi

cd $APP_DIR
# Extract and exclude database files to prevent overwriting production DB
tar -xzf /tmp/deploy.tar.gz --exclude='*.db' --exclude='*.db-*'
cp -r deploy/* .
rm -rf deploy

# Restore .env if it was backed up, otherwise create new one
if [ -f "/tmp/.env.backup" ]; then
    echo "♻️ Restoring existing .env..."
    cp /tmp/.env.backup $APP_DIR/.env
    rm /tmp/.env.backup
elif [ ! -f .env ]; then
    echo "📝 Creating new .env file..."
    echo "⚠️  Please update it with production values!"
    cat > .env << EOF
NODE_ENV=production
PORT=80
HOSTNAME=0.0.0.0
DATABASE_URL="file:/var/lib/apartment-project/dev.db"
NEXTAUTH_SECRET="B3343XqwugRRtMcOtWa9Zh6hGfu2/A1YZS+AdMyd0g4="
NEXTAUTH_URL="https://ram-haim.co.il"
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="AIzaSyB6oN3zxg47erF-pXJqC1fyvC1fC1IHnsU"
EMAIL_SERVER_HOST=mail.privateemail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=info@ram-haim.co.il
EMAIL_SERVER_PASSWORD=123456789!Qq
EMAIL_TO=vadim.tkach1378@gmail.com,misha.kaspler@gmail.com
EOF
fi

# Stop existing process
pm2 stop $APP_NAME || true
pm2 delete $APP_NAME || true

# Start application
echo "▶️ Starting application..."
pm2 start server.js --name $APP_NAME --update-env
pm2 save

# Wait and check
sleep 5
pm2 status

# Health check
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Deployment successful!"
else
    echo "⚠️ Warning: Health check failed"
    pm2 logs $APP_NAME --lines 20
fi

# Cleanup
rm -f /tmp/deploy.tar.gz
ENDSSH

# Cleanup local files
rm -rf deploy deploy.tar.gz

echo ""
echo "✅ Deployment completed!"
echo ""
echo "📋 Useful commands:"
echo "  Check status: ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST 'pm2 status'"
echo "  View logs: ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST 'pm2 logs $APP_NAME'"
echo "  Restart: ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST 'pm2 restart $APP_NAME'"
