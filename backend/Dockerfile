FROM composer:2 AS composer_binary

FROM php:8.3-apache-bookworm

ENV APACHE_DOCUMENT_ROOT=/var/www/backend/public \
    COMPOSER_ALLOW_SUPERUSER=1

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        git unzip libfreetype6-dev libjpeg62-turbo-dev libpng-dev \
        libwebp-dev libicu-dev libonig-dev libzip-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install -j"$(nproc)" \
        pdo_mysql gd intl mbstring zip bcmath opcache \
    && a2enmod rewrite \
    && sed -ri 's!/var/www/html!/var/www/backend/public!g' /etc/apache2/sites-available/*.conf \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer_binary /usr/bin/composer /usr/local/bin/composer
COPY backend/docker/apache.conf /etc/apache2/conf-available/bp-sport.conf
COPY backend/docker/php.ini /usr/local/etc/php/conf.d/bp-sport.ini
RUN a2enconf bp-sport

WORKDIR /var/www/backend

COPY backend/composer.json backend/composer.lock ./
RUN composer install --no-dev --prefer-dist --no-interaction --no-progress \
    --no-scripts --no-autoloader

COPY backend/ ./
COPY backend/docker/entrypoint.sh /usr/local/bin/bp-sport-entrypoint

RUN mkdir -p bootstrap/cache storage/app/private storage/app/public \
        storage/framework/cache/data storage/framework/sessions \
        storage/framework/views storage/logs \
    && composer dump-autoload --no-dev --optimize --no-interaction \
    && chown -R www-data:www-data storage bootstrap/cache \
    && sed -i 's/\r$//' /usr/local/bin/bp-sport-entrypoint \
    && chmod +x /usr/local/bin/bp-sport-entrypoint

EXPOSE 80
ENTRYPOINT ["bp-sport-entrypoint"]
CMD ["apache2-foreground"]
