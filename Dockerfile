# Use PHP 8.0 + Apache
FROM php:8.0-apache

# Enable mod_rewrite (needed for pretty URLs)
RUN a2enmod rewrite

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html/

# Copy project files
COPY . /var/www/html/

# Install dependencies
RUN composer install

# Expose Apache port
EXPOSE 80
