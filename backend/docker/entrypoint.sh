#!/bin/sh
set -eu

if [ -z "${APP_KEY:-}" ]; then
    echo "APP_KEY kosong. Buat APP_KEY di backend/.env sebelum menjalankan container." >&2
    exit 1
fi

cd /var/www/backend
mkdir -p bootstrap/cache storage/app/private storage/app/public \
    storage/framework/cache/data storage/framework/sessions \
    storage/framework/views storage/logs
chown -R www-data:www-data storage bootstrap/cache

php artisan config:clear --no-ansi
if [ ! -L public/storage ]; then
    php artisan storage:link --no-ansi
fi

exec "$@"
