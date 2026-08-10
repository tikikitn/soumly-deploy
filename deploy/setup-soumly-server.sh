#!/usr/bin/env bash
# ============================================================
#  Soumly.online - production server setup (RUN AS ROOT)
#  Usage:  sudo bash setup-soumly-server.sh
#  Prereq: domain A record -> this VPS IP already set in DNS.
# ============================================================
set -euo pipefail

DOMAIN="soumly.online"
APP_DIR="/opt/data/soumly"
PORT=5173
EMAIL="admin@soumly.online"

echo "[1/6] OS deps + nginx"
apt-get update -y
apt-get install -y nginx certbot python3-certbot-nginx

echo "[2/6] nginx site config"
cat > /etc/nginx/sites-available/soumly <<NGINX
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};
    location / {
        proxy_pass http://127.0.0.1:${PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 60s;
    }
}
NGINX
ln -sf /etc/nginx/sites-available/soumly /etc/nginx/sites-enabled/soumly
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
systemctl enable nginx

echo "[3/6] Let us Encrypt HTTPS"
certbot --nginx -d ${DOMAIN} -d www.${DOMAIN} --non-interactive --agree-tos -m ${EMAIL} --redirect

echo "[4/6] ensure app running as hermes user"
sudo -u hermes bash -c "cd ${APP_DIR} && nohup npm run dev > ${APP_DIR}/dev.log 2>&1 &"

echo "[5/6] open firewall"
ufw allow 80/tcp 2>/dev/null || true
ufw allow 443/tcp 2>/dev/null || true

echo "[6/6] DONE. Visit https://${DOMAIN}"
