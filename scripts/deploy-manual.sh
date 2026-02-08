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

# Copy standalone build
cp -r .next/standalone/. deploy/

# Copy static files (CRITICAL for Next.js)
mkdir -p deploy/.next/static
cp -r .next/static/. deploy/.next/static/

# Copy public files
if [ -d "public" ]; then
    mkdir -p deploy/public
    cp -r public/. deploy/public/
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
sudo mkdir -p $APP_DIR
sudo chown $USER:$USER $APP_DIR

cd $APP_DIR
tar -xzf /tmp/deploy.tar.gz
cp -r deploy/* .
rm -rf deploy

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    cat > .env << EOF
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
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
