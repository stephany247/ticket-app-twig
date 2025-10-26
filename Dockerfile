# Use PHP 8.0 with Apache
FROM php:8.0-apache

# Enable URL rewriting for routing
RUN a2enmod rewrite

# Allow .htaccess overrides
RUN echo '<Directory /var/www/html/public>\n\
    AllowOverride All\n\
</Directory>' > /etc/apache2/conf-available/allow-htaccess.conf \
    && a2enconf allow-htaccess

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set working directory inside the container
WORKDIR /var/www/html

# Copy project files into container
COPY . .

# Install dependencies via Composer (no interaction)
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# Set proper Apache DocumentRoot to /var/www/html/public
RUN sed -i 's#/var/www/html#/var/www/html/public#g' /etc/apache2/sites-available/000-default.conf

# Expose HTTP port
EXPOSE 80

# Start Apache in the foreground
CMD ["apache2-foreground"]
