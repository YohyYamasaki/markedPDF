FROM php:8.1-apache

RUN apt-get update && apt-get install -y \
  bash \
  git \
  g++ \
  libicu-dev \
  libpq-dev \
  libzip-dev \
  zip \
  zlib1g-dev \
  libonig-dev \
  nano \
  curl \
  libgd-dev \
  libmagickwand-dev \
  ca-certificates \
  gnupg \
  && a2enmod rewrite \
  && docker-php-ext-install pdo_mysql mysqli intl opcache pdo mbstring gd

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# This environment variable ensures that the composer global bin directory is in the system PATH
ENV PATH="~/.composer/vendor/bin:~/.config/composer/vendor/bin:${PATH}"
ENV PATH="/usr/local/bin:${PATH}"

# Set Node.js to use less memory
ENV NODE_OPTIONS=--max_old_space_size=512
ENV NODE_MAJOR=18

# Install Node.js
RUN mkdir -p /etc/apt/keyrings
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list
RUN apt-get update
RUN apt-get install nodejs -y


#install redis
RUN pecl install redis && docker-php-ext-enable redis

#install imagick
RUN pecl install imagick && docker-php-ext-enable imagick

#Place .ini and .conf files in the container
COPY php.ini /usr/local/etc/php/
COPY 000-default.conf /etc/apache2/sites-enabled/000-default.conf

#Set the working directory
WORKDIR /var/www/html

# Install Laravel installer
RUN composer global require laravel/installer

# Create a new Laravel application
RUN composer create-project --prefer-dist laravel/laravel laravel-app

# Go into the Laravel application directory
WORKDIR /var/www/html/laravel-app