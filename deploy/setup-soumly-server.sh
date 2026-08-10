#!/usr/bin/env bash
set -euo pipefail

SOUMLY_DOMAIN="${SOUMLY_DOMAIN:-soumly.online}"
SOUMLY_EMAIL="${SOUMLY_EMAIL:-admin@${SOUMLY_DOMAIN}}"
SOUMLY_APP_DIR="${SOUMLY_APP_DIR:-/opt/soumly}"
SOUMLY_APP_USER="${SOUMLY_APP_USER:-soumly}"
SOUMLY_PORT="${SOUMLY_PORT:-5173}"

if [[ "${EUID}" -ne 0 ]]; then
  echo "Run this script as root." >&2
  exit 1
fi
if [[ ! -f "${SOUMLY_APP_DIR}/package.json" ]]; then
  echo "No Soumly project found in ${SOUMLY_APP_DIR}." >&2
  exit 1
fi
if ! id "${SOUMLY_APP_USER}" >/dev/null 2>&1; then
  useradd --system --create-home --shell /usr/sbin/nologin "${SOUMLY_APP_USER}"
fi

apt-get update -y
apt-get install -y nginx certbot python3-certbot-nginx curl

if ! command -v node >/dev/null 2>&1 || [[ "$(node -p 'Number(process.versions.node.split(".")[0])')" -lt 22 ]]; then
  echo "Node.js 22 or newer is required." >&2
  exit 1
fi

chown -R "${SOUMLY_APP_USER}:${SOUMLY_APP_USER}" "${SOUMLY_APP_DIR}"
runuser -u "${SOUMLY_APP_USER}" -- bash -lc "cd '${SOUMLY_APP_DIR}' && npm ci && npm run build"

cat > /etc/systemd/system/soumly.service <<SERVICE
[Unit]
Description=Soumly price comparison website
After=network.target

[Service]
Type=simple
User=${SOUMLY_APP_USER}
Group=${SOUMLY_APP_USER}
WorkingDirectory=${SOUMLY_APP_DIR}
Environment=NODE_ENV=production
Environment=HOST=127.0.0.1
Environment=PORT=${SOUMLY_PORT}
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
SERVICE

cat > /etc/nginx/sites-available/soumly <<NGINX
server {
    listen 80;
    server_name ${SOUMLY_DOMAIN} www.${SOUMLY_DOMAIN};
    location / {
        proxy_pass http://127.0.0.1:${SOUMLY_PORT};
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
NGINX

ln -sf /etc/nginx/sites-available/soumly /etc/nginx/sites-enabled/soumly
if [[ -L /etc/nginx/sites-enabled/default ]]; then
  unlink /etc/nginx/sites-enabled/default
fi
nginx -t
systemctl daemon-reload
systemctl enable --now soumly nginx
certbot --nginx -d "${SOUMLY_DOMAIN}" -d "www.${SOUMLY_DOMAIN}" --non-interactive --agree-tos -m "${SOUMLY_EMAIL}" --redirect

if command -v ufw >/dev/null 2>&1; then
  ufw allow 80/tcp
  ufw allow 443/tcp
fi

echo "Soumly is running at https://${SOUMLY_DOMAIN}"
