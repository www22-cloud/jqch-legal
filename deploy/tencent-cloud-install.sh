#!/usr/bin/env bash
set -euo pipefail
if [[ ${EUID:-$(id -u)} -ne 0 ]]; then
  echo "请使用 sudo 运行：sudo bash tencent-cloud-install.sh" >&2
  exit 1
fi
APP_DIR=/opt/jqch-legal
TARBALL=https://api.github.com/repos/www22-cloud/jqch-legal/tarball/main

apt-get update
apt-get install -y curl ca-certificates tar nginx

if ! command -v node >/dev/null 2>&1 || [[ $(node -v | sed 's/^v//' | cut -d. -f1) -lt 18 ]]; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi

mkdir -p "$APP_DIR"
curl -fsSL "$TARBALL" -o /tmp/jqch-legal.tar.gz
rm -rf /tmp/jqch-legal-main
tar -xzf /tmp/jqch-legal.tar.gz -C /tmp
rm -rf "$APP_DIR"/*
cp -a /tmp/jqch-legal-main/. "$APP_DIR"/
rm -rf "$APP_DIR/.git" "$APP_DIR/.vercel" "$APP_DIR/.env.local" "$APP_DIR/.hallmark"

if [[ ! -f /etc/jqch-legal.env ]]; then
  if [[ -n "${DEEPSEEK_API_KEY:-}" ]]; then
    KEY="$DEEPSEEK_API_KEY"
  else
    read -rsp "请输入 DeepSeek API Key: " KEY
    echo
  fi
  printf 'DEEPSEEK_API_KEY=%s\nPORT=8080\n' "$KEY" > /etc/jqch-legal.env
  chmod 600 /etc/jqch-legal.env
fi

cat > /etc/systemd/system/jqch-legal.service <<'EOF'
[Unit]
Description=JQCH Legal Risk Website
After=network.target

[Service]
Type=simple
WorkingDirectory=/opt/jqch-legal
EnvironmentFile=/etc/jqch-legal.env
ExecStart=/usr/bin/node /opt/jqch-legal/local-server.cjs
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

cat > /etc/nginx/sites-available/jqch-legal <<'EOF'
server {
  listen 80 default_server;
  listen [::]:80 default_server;
  server_name _;
  client_max_body_size 20m;

  location / {
    proxy_pass http://127.0.0.1:8080;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_read_timeout 120s;
  }
}
EOF

ln -sf /etc/nginx/sites-available/jqch-legal /etc/nginx/sites-enabled/jqch-legal
rm -f /etc/nginx/sites-enabled/default
systemctl daemon-reload
systemctl enable --now jqch-legal
nginx -t
systemctl restart nginx

PUBLIC_IP=$(curl -fsS https://api.ipify.org 2>/dev/null || hostname -I | awk '{print $1}')
echo
echo "部署完成：http://${PUBLIC_IP}/"
echo "服务状态：systemctl status jqch-legal"
echo "如需绑定域名和 HTTPS，请把域名解析到 ${PUBLIC_IP} 后安装 certbot。"