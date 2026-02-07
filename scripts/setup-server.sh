#!/bin/bash
# Server Setup Script for Ubuntu/Debian
# Run this script on your server to prepare for deployment

set -e

echo "🚀 Setting up server for deployment..."

# Update system
echo "📦 Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install Node.js 18 (LTS)
echo "📦 Installing Node.js..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install build tools
echo "📦 Installing build essentials..."
sudo apt-get install -y build-essential

# Install PM2
echo "📦 Installing PM2..."
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
fi

# Setup PM2 startup
echo "⚙️ Configuring PM2 startup..."
pm2 startup | tail -n 1 | sudo bash || true

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /opt/apartment-project
sudo chown $USER:$USER /opt/apartment-project

# Setup Nginx (optional)
read -p "Do you want to setup Nginx reverse proxy? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📦 Installing Nginx..."
    sudo apt-get install -y nginx

    # Create Nginx config
    sudo tee /etc/nginx/sites-available/apartment-project > /dev/null << 'EOF'
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

    # Enable site
    sudo ln -sf /etc/nginx/sites-available/apartment-project /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
    sudo nginx -t
    sudo systemctl restart nginx
    sudo systemctl enable nginx

    echo "✅ Nginx configured successfully"
fi

# Setup firewall
read -p "Do you want to setup UFW firewall? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔥 Setting up firewall..."
    sudo ufw allow ssh
    sudo ufw allow 80
    sudo ufw allow 443
    sudo ufw --force enable
    echo "✅ Firewall configured"
fi

# Display information
echo ""
echo "✅ Server setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Add GitHub Actions secrets to your repository:"
echo "   - SSH_HOST: Your server IP address"
echo "   - SSH_USER: Your SSH username (current: $USER)"
echo "   - SSH_PRIVATE_KEY: Your SSH private key"
echo "   - SSH_PORT: Your SSH port (default: 22)"
echo "   - DEPLOYMENT_URL: Your domain or IP (for health checks)"
echo ""
echo "2. Generate SSH key pair for GitHub Actions:"
echo "   ssh-keygen -t ed25519 -C 'github-actions' -f ~/.ssh/github-actions"
echo "   cat ~/.ssh/github-actions.pub >> ~/.ssh/authorized_keys"
echo "   cat ~/.ssh/github-actions  # Copy this to SSH_PRIVATE_KEY secret"
echo ""
echo "3. Push to main/master branch to trigger deployment"
echo ""
echo "Server details:"
echo "- Node.js version: $(node --version)"
echo "- npm version: $(npm --version)"
echo "- PM2 version: $(pm2 --version)"
echo "- Application directory: /opt/apartment-project"
echo "- Application port: 3000"
if command -v nginx &> /dev/null; then
    echo "- Nginx status: $(systemctl is-active nginx)"
fi
