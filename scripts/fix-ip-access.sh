#!/bin/bash
# Quick Fix Script for IP Access Issues
# Run this on your server to fix common issues preventing IP access

set -e

echo "🔧 Fixing IP access issues..."
echo ""

# 1. Check if app is running
echo "1️⃣ Checking if application is running..."
if pm2 list | grep -q "apartment-project"; then
    echo "✅ Application is running in PM2"
    pm2 restart apartment-project
else
    echo "❌ Application NOT running"
    echo "Starting application..."
    cd /opt/apartment-project
    pm2 start server.js --name apartment-project
    pm2 save
fi
echo ""

# 2. Install and configure Nginx if missing
echo "2️⃣ Checking Nginx..."
if ! command -v nginx &> /dev/null; then
    echo "Installing Nginx..."
    sudo apt update
    sudo apt install -y nginx
else
    echo "✅ Nginx is installed"
fi
echo ""

# 3. Configure Nginx
echo "3️⃣ Configuring Nginx..."
sudo tee /etc/nginx/sites-available/apartment-project > /dev/null << 'NGINXEOF'
server {
    listen 80;
    listen [::]:80;
    server_name _;

    access_log /var/log/nginx/apartment-access.log;
    error_log /var/log/nginx/apartment-error.log;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINXEOF

sudo ln -sf /etc/nginx/sites-available/apartment-project /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
echo "✅ Nginx configured"
echo ""

# 4. Test and restart Nginx
echo "4️⃣ Testing Nginx configuration..."
sudo nginx -t
echo ""
echo "Restarting Nginx..."
sudo systemctl restart nginx
sudo systemctl enable nginx
echo "✅ Nginx restarted"
echo ""

# 5. Configure firewall
echo "5️⃣ Configuring firewall..."
if command -v ufw &> /dev/null; then
    sudo ufw allow 22/tcp
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    sudo ufw --force enable
    echo "✅ Firewall configured"
    sudo ufw status
else
    echo "⚠️ UFW not found, skipping firewall setup"
fi
echo ""

# 6. Final checks
echo "6️⃣ Running final checks..."
echo ""
echo "Application status:"
pm2 status
echo ""
echo "Nginx status:"
sudo systemctl status nginx --no-pager | head -10
echo ""
echo "Port bindings:"
sudo netstat -tlnp | grep -E '(:80|:3000)' || sudo ss -tlnp | grep -E '(:80|:3000)'
echo ""

# 7. Test connectivity
echo "7️⃣ Testing connectivity..."
echo "Local test:"
curl -I http://localhost 2>&1 | head -5
echo ""

# Get server IP
SERVER_IP=$(ip addr show | grep "inet " | grep -v "127.0.0.1" | awk '{print $2}' | cut -d'/' -f1 | head -1)
echo "Your server IP: $SERVER_IP"
echo ""
echo "✅ Fix completed!"
echo ""
echo "📝 Try accessing your site:"
echo "   http://$SERVER_IP"
echo ""
echo "🔍 If still not working, check:"
echo "1. Cloud provider firewall (AWS Security Groups, etc.)"
echo "2. Application logs: pm2 logs apartment-project"
echo "3. Nginx logs: sudo tail -f /var/log/nginx/apartment-error.log"
