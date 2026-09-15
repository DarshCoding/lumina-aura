# Lummina Aura

Handcrafted candle portfolio and shop — **Laravel 10 API + React (Vite)** SPA with MySQL.

## Stack

- **Backend:** Laravel 10, Eloquent, session auth for admin
- **Frontend:** React 19, React Router, Tailwind CSS
- **Database:** MySQL / MariaDB (normalized schema)

## Requirements

- PHP 8.1+, Composer
- Node.js 18+, npm
- MySQL / MariaDB

## Setup

```bash
# Install PHP deps
composer install

# Install JS deps
npm install

# Configure environment
cp .env.example .env   # if needed
php artisan key:generate

# Create database then set DB_* in .env
mysql -u root -e "CREATE DATABASE IF NOT EXISTS lumina_aura"

# Migrate & seed catalogue, hamper options, sample orders
php artisan migrate:fresh --seed

# Build frontend (production) OR run Vite in another terminal for HMR
npm run build
# npm run dev
```

## Run

```bash
php artisan serve
```

Open [http://127.0.0.1:8000](http://127.0.0.1:8000).

For Vite HMR during development, run both:

```bash
php artisan serve
npm run dev
```

## Admin

- URL: [http://127.0.0.1:8000/admin](http://127.0.0.1:8000/admin)
- Login: `admin` / `lummina2024`

## Features

- Public portfolio (home, collection, product detail, about, contact)
- Custom gift hamper builder with live pricing and logo upload
- Admin: products, inventory, online/offline billings, gift hampers, dashboard stats
- Auto discount % ↔ sale price calculation

## API (same-origin)

| Method | Path | Auth |
|--------|------|------|
| GET/POST | `/api/products` | POST requires admin |
| GET/PUT/DELETE | `/api/products/{id}` | write requires admin |
| PATCH | `/api/inventory/{id}` | admin |
| GET/POST | `/api/billings` | admin |
| GET/POST | `/api/hampers` | GET admin; POST public |
| POST | `/api/hampers/upload` | public (logo) |
| POST | `/api/upload` | admin |
| GET | `/api/stats` | admin |
| POST | `/api/auth` | login / logout |

## Project layout

```
app/Http/Controllers/Api/   # REST API
app/Models/                 # Eloquent models
database/migrations/        # MySQL schema
database/seeders/           # Catalogue seed
database/sql/               # Reference SQL docs (PostgreSQL original)
resources/js/               # React SPA
resources/views/app.blade.php
public/images/              # Candle SVG assets
docs/                       # Database normalization notes
```

Demo product images live under `public/images/` as local SVG placeholders.
