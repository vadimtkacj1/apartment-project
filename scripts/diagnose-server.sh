#!/bin/bash
# Server Diagnostic Script
# Run this on your server to diagnose why the site isn't accessible

echo "🔍 Running server diagnostics..."
echo ""

# Check Node.js
echo "=== Node.js ==="
node --version 2>/dev/null || echo "❌ Node.js not found"
npm --version 2>/dev/null || echo "❌ npm not found"
echo ""

# Check PM2
echo "=== PM2 Status ==="
pm2 status 2>/dev/null || echo "❌ PM2 not found or no processes"
echo ""

# Check if app is running locally
echo "=== Local Health Check (localhost:3000) ==="
if curl -sf http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Application is responding on localhost:3000"
else
    echo "❌ Application is NOT responding on localhost:3000"
    echo "Check PM2 logs: pm2 logs apartment-project"
fi
echo ""

# Check Nginx
echo "=== Nginx Status ==="
if command -v nginx &> /dev/null; then
    echo "Nginx version:"
    nginx -v
    echo ""
    sudo systemctl status nginx --no-pager | head -10
    echo ""
    echo "Nginx configuration test:"
    sudo nginx -t
else
    echo "❌ Nginx is not installed"
fi
echo ""

# Check port bindings
echo "=== Port Bindings ==="
echo "Listening on port 80 (HTTP):"
sudo netstat -tlnp | grep :80 || sudo ss -tlnp | grep :80 || echo "❌ Nothing listening on port 80"
echo ""
echo "Listening on port 3000 (Next.js):"
sudo netstat -tlnp | grep :3000 || sudo ss -tlnp | grep :3000 || echo "❌ Nothing listening on port 3000"
echo ""

# Check firewall
echo "=== Firewall Status ==="
if command -v ufw &> /dev/null; then
    sudo ufw status
else
    echo "⚠️ UFW not found"
    if command -v iptables &> /dev/null; then
        echo "Checking iptables..."
        sudo iptables -L -n | grep -E '(80|443|3000)'
    fi
fi
echo ""

# Check Nginx configuration
echo "=== Nginx Configuration Files ==="
ls -la /etc/nginx/sites-enabled/ 2>/dev/null || echo "❌ Sites-enabled directory not found"
echo ""
if [ -f /etc/nginx/sites-enabled/apartment-project ]; then
    echo "✅ apartment-project config exists"
    cat /etc/nginx/sites-enabled/apartment-project
else
    echo "❌ apartment-project config NOT found in sites-enabled"
fi
echo ""

# Check Nginx logs
echo "=== Recent Nginx Errors ==="
sudo tail -20 /var/log/nginx/apartment-error.log 2>/dev/null || echo "❌ No error log found"
echo ""

# Check PM2 logs
echo "=== Recent PM2 Logs ==="
pm2 logs apartment-project --lines 20 --nostream 2>/dev/null || echo "❌ No PM2 logs found"
echo ""

# Network test
echo "=== Network Connectivity ==="
echo "Server IP addresses:"
ip addr show | grep "inet " | grep -v "127.0.0.1"
echo ""
echo "Testing HTTP on localhost:"
curl -I http://localhost 2>&1 | head -5
echo ""

echo "=== Diagnostics Complete ==="
echo ""
echo "📋 Common fixes:"
echo "1. If app not running: pm2 restart apartment-project"
echo "2. If Nginx not running: sudo systemctl start nginx"
echo "3. If port 80 blocked: sudo ufw allow 80/tcp"
echo "4. If Nginx config missing: run setup-server.sh"
echo "5. View detailed logs: pm2 logs apartment-project --lines 50"
