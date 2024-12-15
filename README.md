# Boiler Monitor (boiler-monitor)

A fkn Boiler Monitor

## TODO
- Warnings IndexPage
- Dynamic URL from js location..
- History time line

## Development

### Install the dependencies
```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
yarn quasar dev

# powershell with environment variables
$env:API_URL="http://temperaturepi.fritz.box:8000"; yarn quasar dev
```

### Lint the files
```bash
yarn lint
# or
npm run lint
```

### Format the files
```bash
yarn format
# or
npm run format
```

### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).

## Serving the App on the Raspberry Pi

It's always a good idea to start with a
```
apt update
apt upgrade
```

Install nginx
```
apt install nginx
```

Download App (Use latest version)
```
mkdir ~/boiler-watch-gui
cd ~/boiler-watch-gui
wget https://github.com/flxkrmr/boiler-watch-gui/releases/download/0.1.0/boiler-watch-gui.zip
unzip boiler-watch-gui.zip
rm boiler-watch-gui.zip
```

Edit the nginx default site under
```
/etc/nginx/sites-enabled/default
```

Replace the default server block with this one
```
server {
        listen 80 default_server;
        listen [::]:80 default_server;


        server_name _;
        root /home/pi/boiler-watch-gui/;

        add_header X-Frame-Options "SAMEORIGIN";
        add_header X-XSS-Protection "1; mode=block";
        add_header X-Content-Type-Options "nosniff";

        index index.html;

        charset utf-8;

        location / {
                try_files $uri $uri/ /index.html;
        }

        location = /robots.txt  { access_log off; log_not_found off; }

        access_log off;
        error_log  /var/log/nginx/boiler-watch-gui-error.log error;

        location ~ /\.(?!well-known).* {
                deny all;
        }

}
```

Reload nginx
```
systemctl reload nginx
```
