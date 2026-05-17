---
title: PHP 컨테이너화(Dockerize)하는 방법
description: PHP 7.4 + CodeIgniter 4 컨테이너화하는 벙법을 설명합니다.
date: 2024-06-12
category: Frontend
tags:
  - "php"
  - "docker"
  - "code-igniter"
draft: false
lang: ko
thumbnail: "https://images.unsplash.com/photo-1605745341112-85968b19335b?q=80&w=3871&auto=format&fit=crop&ixlib=rb-4.0.3"
---

도커(Docker)를 사용하여 PHP 7.4와 CodeIgniter 4를 컨테이너화하는 방법을 단계별로 설명드리겠습니다. 다음은 기본적인 설정과 실행 과정을 설명한 것입니다.

### 1. 프로젝트 디렉토리 구조 설정
먼저 프로젝트의 기본 디렉토리 구조를 설정합니다.

```
my-codeigniter-project/
├── app/
├── public/
├── writable/
├── .env
├── composer.json
├── composer.lock
└── Dockerfile
```

### 2. Dockerfile 작성
`Dockerfile`을 프로젝트 루트 디렉토리에 작성합니다.

```Dockerfile
# 베이스 이미지 설정 (PHP 7.4 및 Apache)
FROM php:7.4-apache

# 필요한 패키지 설치 및 시스템 업데이트
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    zip \
    unzip \
    git \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd \
    && docker-php-ext-install mysqli pdo pdo_mysql \
    && a2enmod rewrite

# Composer 설치
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 프로젝트 파일 복사
COPY . /var/www/html

# Apache 설정 파일 복사
COPY ./apache.conf /etc/apache2/sites-available/000-default.conf

# 환경 변수 설정
ENV APACHE_DOCUMENT_ROOT /var/www/html/public

# 권한 설정
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Apache 재시작
RUN service apache2 restart
```

### 3. Apache 설정 파일 작성
`apache.conf` 파일을 프로젝트 루트 디렉토리에 작성합니다.

```ApacheConf
<VirtualHost *:80>
    DocumentRoot /var/www/html/public
    <Directory /var/www/html/public>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```

### 4. Docker Compose 파일 작성
프로젝트의 루트 디렉토리에 `docker-compose.yml` 파일을 작성합니다.

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
    ports:
      - "8080:80"
    volumes:
      - .:/var/www/html
    networks:
      - app-network

  db:
    image: mysql:5.7
    container_name: mysql
    restart: unless-stopped
    environment:
      MYSQL_DATABASE: codeigniter
      MYSQL_USER: user
      MYSQL_PASSWORD: password
      MYSQL_ROOT_PASSWORD: root_password
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  db_data:
```

### 5. CodeIgniter 4 설정 파일 업데이트
`app/Config/Database.php` 파일을 수정하여 데이터베이스 설정을 Docker 환경에 맞게 조정합니다.

```php
public $default = [
    'DSN'      => '',
    'hostname' => 'db',
    'username' => 'user',
    'password' => 'password',
    'database' => 'codeigniter',
    'DBDriver' => 'MySQLi',
    'DBPrefix' => '',
    'pConnect' => false,
    'DBDebug'  => (ENVIRONMENT !== 'production'),
    'cacheOn'  => false,
    'cacheDir' => '',
    'charset'  => 'utf8',
    'DBCollat' => 'utf8_general_ci',
    'swapPre'  => '',
    'encrypt'  => false,
    'compress' => false,
    'strictOn' => false,
    'failover' => [],
    'port'     => 3306,
];
```

### 6. Docker 컨테이너 빌드 및 실행
이제 터미널을 열고 프로젝트 루트 디렉토리로 이동한 후, 다음 명령어를 실행하여 Docker 컨테이너를 빌드하고 실행합니다.

```sh
docker-compose up --build
```

### 7. 웹 브라우저에서 확인
브라우저를 열고 `http://localhost:8080`에 접속하여 CodeIgniter 4 기본 페이지가 보이는지 확인합니다.

이제 PHP 7.4와 CodeIgniter 4가 Docker를 통해 설정되고 실행되었습니다. 필요에 따라 추가적인 설정이나 커스터마이징을 할 수 있습니다.
