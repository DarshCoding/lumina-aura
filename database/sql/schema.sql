-- Lumina Aura — normalized relational schema (PostgreSQL 14+)
-- Run: psql -f database/schema.sql (after creating database `lumina_aura`)

BEGIN;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- Lookup / reference tables (3NF: remove repeating domain values)
-- ---------------------------------------------------------------------------

CREATE TABLE sale_channels (
  code        TEXT PRIMARY KEY,
  label       TEXT NOT NULL
);

INSERT INTO sale_channels (code, label) VALUES
  ('online',  'Online store'),
  ('offline', 'In-person / studio');

CREATE TABLE hamper_statuses (
  code        TEXT PRIMARY KEY,
  label       TEXT NOT NULL
);

INSERT INTO hamper_statuses (code, label) VALUES
  ('pending',   'Pending review'),
  ('confirmed', 'Confirmed'),
  ('fulfilled', 'Fulfilled'),
  ('cancelled', 'Cancelled');

CREATE TABLE hamper_option_types (
  code        TEXT PRIMARY KEY,
  label       TEXT NOT NULL
);

INSERT INTO hamper_option_types (code, label) VALUES
  ('fragrance', 'Fragrance add-on'),
  ('color',     'Vessel / wax color'),
  ('flower',    'Floral accompaniment');

CREATE TABLE fee_types (
  code        TEXT PRIMARY KEY,
  label       TEXT NOT NULL,
  amount      NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
  effective_from TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO fee_types (code, label, amount) VALUES
  ('packaging_base', 'Gift box packaging', 199.00),
  ('logo_packaging', 'Custom logo on packaging', 249.00);

-- ---------------------------------------------------------------------------
-- Catalog (products were denormalized: category string, images array)
-- ---------------------------------------------------------------------------

CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL UNIQUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE products (
  id                TEXT PRIMARY KEY,
  title             TEXT NOT NULL,
  description       TEXT NOT NULL,
  code              TEXT NOT NULL UNIQUE,
  list_price        NUMERIC(10, 2) NOT NULL CHECK (list_price >= 0),
  discount_percent  NUMERIC(5, 2) NOT NULL DEFAULT 0
                      CHECK (discount_percent >= 0 AND discount_percent <= 100),
  -- Derived from list_price + discount_percent (3NF: no update anomaly on discount price)
  sale_price        NUMERIC(10, 2) GENERATED ALWAYS AS (
                      ROUND((list_price * (1 - discount_percent / 100))::numeric, 2)
                    ) STORED,
  stock             INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  category_id       UUID NOT NULL REFERENCES categories (id),
  scent             TEXT,
  burn_time         TEXT,
  featured          BOOLEAN NOT NULL DEFAULT FALSE,
  created_at        TIMESTAMPTZ NOT NULL,
  updated_at        TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_products_category ON products (category_id);
CREATE INDEX idx_products_featured ON products (featured) WHERE featured = TRUE;

-- 1NF: one row per image URL (was JSON array on product)
CREATE TABLE product_images (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  TEXT NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  sort_order  SMALLINT NOT NULL DEFAULT 0,
  UNIQUE (product_id, sort_order)
);

CREATE INDEX idx_product_images_product ON product_images (product_id);

-- ---------------------------------------------------------------------------
-- Hamper configuration (was hard-coded in hamper.ts)
-- ---------------------------------------------------------------------------

CREATE TABLE hamper_options (
  id              TEXT PRIMARY KEY,
  option_type     TEXT NOT NULL REFERENCES hamper_option_types (code),
  label           TEXT NOT NULL,
  price           NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (price >= 0),
  description     TEXT,
  swatch_hex      CHAR(7) CHECK (swatch_hex IS NULL OR swatch_hex ~ '^#[0-9A-Fa-f]{6}$'),
  active          BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_hamper_options_type ON hamper_options (option_type);

-- ---------------------------------------------------------------------------
-- Parties (customer data was duplicated on every billing / hamper)
-- ---------------------------------------------------------------------------

CREATE TABLE customers (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  email       TEXT,
  phone       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_customers_email ON customers (lower(email)) WHERE email IS NOT NULL;

-- ---------------------------------------------------------------------------
-- Sales invoices (billings + nested items in store.json)
-- ---------------------------------------------------------------------------

CREATE TABLE billings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number  TEXT NOT NULL UNIQUE,
  channel         TEXT NOT NULL REFERENCES sale_channels (code),
  customer_id     UUID NOT NULL REFERENCES customers (id),
  subtotal        NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
  discount_total  NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (discount_total >= 0),
  total           NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_billings_created ON billings (created_at DESC);
CREATE INDEX idx_billings_channel ON billings (channel);

CREATE TABLE billing_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  billing_id      UUID NOT NULL REFERENCES billings (id) ON DELETE CASCADE,
  product_id      TEXT NOT NULL REFERENCES products (id),
  quantity        INTEGER NOT NULL CHECK (quantity > 0),
  unit_price      NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
  line_total      NUMERIC(10, 2) NOT NULL CHECK (line_total >= 0),
  -- Invoice snapshot (intentional denormalization — see docs/DATABASE-NORMALIZATION.md)
  product_title   TEXT NOT NULL,
  product_code    TEXT NOT NULL
);

CREATE INDEX idx_billing_items_billing ON billing_items (billing_id);
CREATE INDEX idx_billing_items_product ON billing_items (product_id);

-- ---------------------------------------------------------------------------
-- Custom gift hampers (nested candle/fragrance/color/flower objects in JSON)
-- ---------------------------------------------------------------------------

CREATE TABLE gift_hampers (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference             TEXT NOT NULL UNIQUE,
  customer_id           UUID NOT NULL REFERENCES customers (id),
  candle_product_id     TEXT NOT NULL REFERENCES products (id),
  fragrance_option_id   TEXT NOT NULL REFERENCES hamper_options (id),
  color_option_id       TEXT NOT NULL REFERENCES hamper_options (id),
  flower_option_id      TEXT NOT NULL REFERENCES hamper_options (id),
  logo_url              TEXT,
  packaging_fee         NUMERIC(10, 2) NOT NULL CHECK (packaging_fee >= 0),
  logo_fee              NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (logo_fee >= 0),
  total                 NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
  notes                 TEXT,
  status                TEXT NOT NULL DEFAULT 'pending' REFERENCES hamper_statuses (code),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Price snapshots at order time (3NF: depend only on hamper PK)
  candle_price_charged    NUMERIC(10, 2) NOT NULL,
  fragrance_price_charged NUMERIC(10, 2) NOT NULL,
  color_price_charged     NUMERIC(10, 2) NOT NULL,
  flower_price_charged    NUMERIC(10, 2) NOT NULL
  -- Option type (fragrance / color / flower) enforced via hamper_options.option_type + app/trigger
);

CREATE INDEX idx_gift_hampers_status ON gift_hampers (status);
CREATE INDEX idx_gift_hampers_created ON gift_hampers (created_at DESC);

COMMIT;
