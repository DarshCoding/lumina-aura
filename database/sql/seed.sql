-- Seed data aligned with data/store.json and src/lib/hamper.ts
-- Run after schema.sql: psql -d lumina_aura -f database/seed.sql

BEGIN;

-- Categories from product.category strings
INSERT INTO categories (id, name) VALUES
  ('a1000001-0000-4000-8000-000000000001', 'Signature'),
  ('a1000001-0000-4000-8000-000000000002', 'Floral'),
  ('a1000001-0000-4000-8000-000000000003', 'Woody'),
  ('a1000001-0000-4000-8000-000000000004', 'Fresh'),
  ('a1000001-0000-4000-8000-000000000005', 'Gourmand');

INSERT INTO products (
  id, title, description, code, list_price, discount_percent, stock,
  category_id, scent, burn_time, featured, created_at, updated_at
) VALUES
  (
    'p-aurora', 'Aurora Ember',
    'A soft amber glow with notes of sandalwood and warm vanilla. Hand-poured in small batches for a calm evening ritual.',
    'LA-AE-001', 1899, 15, 42,
    'a1000001-0000-4000-8000-000000000001', 'Sandalwood · Vanilla', '45 hours', TRUE,
    '2026-01-10T10:00:00.000Z', '2026-01-10T10:00:00.000Z'
  ),
  (
    'p-nocturne', 'Nocturne Bloom',
    'Night-blooming jasmine wrapped in soft musk. A quiet, luminous presence for late hours and reading corners.',
    'LA-NB-002', 2199, 10, 28,
    'a1000001-0000-4000-8000-000000000002', 'Jasmine · Musk', '50 hours', TRUE,
    '2026-01-12T10:00:00.000Z', '2026-01-12T10:00:00.000Z'
  ),
  (
    'p-solstice', 'Solstice Cedar',
    'Crisp cedarwood and smoked tea for grounded interiors. Designed for long, steady burns through winter evenings.',
    'LA-SC-003', 2499, 0, 17,
    'a1000001-0000-4000-8000-000000000003', 'Cedar · Smoked Tea', '55 hours', TRUE,
    '2026-02-01T10:00:00.000Z', '2026-09-11T09:29:41.010Z'
  ),
  (
    'p-linen', 'Linen Hour',
    'Fresh linen and pale citrus — light, clean, and airy. Ideal for morning rituals and open studios.',
    'LA-LH-004', 1599, 20, 55,
    'a1000001-0000-4000-8000-000000000004', 'Linen · Citrus', '40 hours', FALSE,
    '2026-02-08T10:00:00.000Z', '2026-02-08T10:00:00.000Z'
  ),
  (
    'p-velvet', 'Velvet Ember',
    'Deep cocoa and soft spice in a matte vessel. A richer profile for intimate gatherings and cooler nights.',
    'LA-VE-005', 2799, 12, 14,
    'a1000001-0000-4000-8000-000000000005', 'Cocoa · Spice', '60 hours', TRUE,
    '2026-02-15T10:00:00.000Z', '2026-02-15T10:00:00.000Z'
  ),
  (
    'p-mist', 'Coastal Mist',
    'Sea salt, driftwood, and a whisper of bergamot. Evokes open windows and quiet shorelines.',
    'LA-CM-006', 1999, 5, 32,
    'a1000001-0000-4000-8000-000000000004', 'Sea Salt · Bergamot', '48 hours', FALSE,
    '2026-03-01T10:00:00.000Z', '2026-09-11T09:28:11.097Z'
  );

INSERT INTO product_images (product_id, url, sort_order) VALUES
  ('p-aurora', '/images/candle-1.svg', 0),
  ('p-aurora', '/images/candle-1-b.svg', 1),
  ('p-nocturne', '/images/candle-2.svg', 0),
  ('p-nocturne', '/images/candle-2-b.svg', 1),
  ('p-solstice', '/images/candle-3.svg', 0),
  ('p-solstice', '/images/candle-3-b.svg', 1),
  ('p-linen', '/images/candle-4.svg', 0),
  ('p-linen', '/images/candle-4-b.svg', 1),
  ('p-velvet', '/images/candle-5.svg', 0),
  ('p-velvet', '/images/candle-5-b.svg', 1),
  ('p-mist', '/images/candle-6.svg', 0),
  ('p-mist', '/images/candle-6-b.svg', 1);

INSERT INTO hamper_options (id, option_type, label, price, description, swatch_hex) VALUES
  ('frag-sandalwood', 'fragrance', 'Sandalwood & Vanilla', 0, 'Warm amber base — included with signature pours', NULL),
  ('frag-jasmine', 'fragrance', 'Night Jasmine', 149, 'Soft floral musk for evening rooms', NULL),
  ('frag-cedar', 'fragrance', 'Cedar & Smoked Tea', 199, 'Grounded woody profile', NULL),
  ('frag-linen', 'fragrance', 'Linen Citrus', 129, 'Clean, airy morning scent', NULL),
  ('frag-cocoa', 'fragrance', 'Velvet Cocoa', 249, 'Deep gourmand with soft spice', NULL),
  ('color-ivory', 'color', 'Ivory', 0, 'Natural unpigmented wax', '#F5F0E8'),
  ('color-blush', 'color', 'Blush', 99, 'Soft rose tint', '#E8C4B8'),
  ('color-sage', 'color', 'Sage', 99, 'Muted botanical green', '#A8B5A0'),
  ('color-amber', 'color', 'Amber Glow', 149, 'Warm honey tone', '#C4956A'),
  ('color-ink', 'color', 'Charcoal', 149, 'Matte deep charcoal vessel', '#2C2C2C'),
  ('flower-none', 'flower', 'No flowers', 0, 'Candle and packaging only', NULL),
  ('flower-lavender', 'flower', 'Dried lavender', 299, 'A quiet botanical sprig', NULL),
  ('flower-rose', 'flower', 'Preserved rose buds', 449, 'Soft blush roses in tissue', NULL),
  ('flower-eucalyptus', 'flower', 'Eucalyptus bundle', 349, 'Fresh greenery for the box', NULL),
  ('flower-mixed', 'flower', 'Seasonal mixed posy', 599, 'Studio-selected seasonal blooms', NULL);

INSERT INTO customers (id, name, email, phone, created_at) VALUES
  ('7a627349-2221-4be8-bdf8-b36cf255970f', 'test name', 'test@email.com', '1234567890', '2026-09-11T09:28:11.098Z'),
  ('f5906529-e15e-4a4a-953f-4186e3feff50', 'this another', 'test@test.com', '123456789', '2026-09-11T09:29:41.010Z');

INSERT INTO gift_hampers (
  id, reference, customer_id, candle_product_id,
  fragrance_option_id, color_option_id, flower_option_id,
  logo_url, packaging_fee, logo_fee, total, notes, status, created_at,
  candle_price_charged, fragrance_price_charged, color_price_charged, flower_price_charged
) VALUES
  (
    '7a627349-2221-4be8-bdf8-b36cf255970f', 'LA-GH-0001',
    '7a627349-2221-4be8-bdf8-b36cf255970f', 'p-mist',
    'frag-jasmine', 'color-ink', 'flower-eucalyptus',
    NULL, 199, 0, 2745, 'Test gift note', 'pending', '2026-09-11T09:28:11.098Z',
    1899, 149, 149, 349
  ),
  (
    'f5906529-e15e-4a4a-953f-4186e3feff50', 'LA-GH-0002',
    'f5906529-e15e-4a4a-953f-4186e3feff50', 'p-solstice',
    'frag-cocoa', 'color-blush', 'flower-none',
    NULL, 199, 0, 3046, 'This is new note with hearts', 'pending', '2026-09-11T09:29:41.010Z',
    2499, 249, 99, 0
  );

COMMIT;
