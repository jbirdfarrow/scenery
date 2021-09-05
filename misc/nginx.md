```server {
    listen 443 ssl http2;
    include    /etc/nginx/allow-cloudflare-only.conf;
    server_name scenery.cx;
    ssl_certificate     /etc/letsencrypt/live/scenery.cx/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/scenery.cx/privkey.pem;

    location /images/ {
        root /home/scenery/public;
        expires 30d;
    }

    location /thumbnails/ {
        root /home/scenery/public;
        expires 30d;
    }

    location /_next/static/ {
        root /home/scenery;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location / {
        proxy_pass http://127.0.0.1:5555;
    }
}
```
