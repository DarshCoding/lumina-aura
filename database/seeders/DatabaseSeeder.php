<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Customer;
use App\Models\GiftHamper;
use App\Models\HamperOption;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {
            DB::table('sale_channels')->insert([
                ['code' => 'online', 'label' => 'Online store'],
                ['code' => 'offline', 'label' => 'In-person / studio'],
            ]);

            DB::table('hamper_statuses')->insert([
                ['code' => 'pending', 'label' => 'Pending review'],
                ['code' => 'confirmed', 'label' => 'Confirmed'],
                ['code' => 'fulfilled', 'label' => 'Fulfilled'],
                ['code' => 'cancelled', 'label' => 'Cancelled'],
            ]);

            DB::table('hamper_option_types')->insert([
                ['code' => 'fragrance', 'label' => 'Fragrance add-on'],
                ['code' => 'color', 'label' => 'Vessel / wax color'],
                ['code' => 'flower', 'label' => 'Floral accompaniment'],
            ]);

            DB::table('fee_types')->insert([
                ['code' => 'packaging_base', 'label' => 'Gift box packaging', 'amount' => 199.00, 'effective_from' => now()],
                ['code' => 'logo_packaging', 'label' => 'Custom logo on packaging', 'amount' => 249.00, 'effective_from' => now()],
            ]);

            $categories = [
                ['id' => 'a1000001-0000-4000-8000-000000000001', 'name' => 'Signature'],
                ['id' => 'a1000001-0000-4000-8000-000000000002', 'name' => 'Floral'],
                ['id' => 'a1000001-0000-4000-8000-000000000003', 'name' => 'Woody'],
                ['id' => 'a1000001-0000-4000-8000-000000000004', 'name' => 'Fresh'],
                ['id' => 'a1000001-0000-4000-8000-000000000005', 'name' => 'Gourmand'],
            ];

            foreach ($categories as $category) {
                Category::query()->create([
                    'id' => $category['id'],
                    'name' => $category['name'],
                    'created_at' => now(),
                ]);
            }

            $products = [
                [
                    'id' => 'p-aurora', 'title' => 'Aurora Ember',
                    'description' => 'A soft amber glow with notes of sandalwood and warm vanilla. Hand-poured in small batches for a calm evening ritual.',
                    'code' => 'LA-AE-001', 'list_price' => 1899, 'discount_percent' => 15, 'stock' => 42,
                    'category_id' => 'a1000001-0000-4000-8000-000000000001', 'scent' => 'Sandalwood · Vanilla', 'burn_time' => '45 hours', 'featured' => true,
                    'created_at' => '2026-01-10 10:00:00', 'updated_at' => '2026-01-10 10:00:00',
                ],
                [
                    'id' => 'p-nocturne', 'title' => 'Nocturne Bloom',
                    'description' => 'Night-blooming jasmine wrapped in soft musk. A quiet, luminous presence for late hours and reading corners.',
                    'code' => 'LA-NB-002', 'list_price' => 2199, 'discount_percent' => 10, 'stock' => 28,
                    'category_id' => 'a1000001-0000-4000-8000-000000000002', 'scent' => 'Jasmine · Musk', 'burn_time' => '50 hours', 'featured' => true,
                    'created_at' => '2026-01-12 10:00:00', 'updated_at' => '2026-01-12 10:00:00',
                ],
                [
                    'id' => 'p-solstice', 'title' => 'Solstice Cedar',
                    'description' => 'Crisp cedarwood and smoked tea for grounded interiors. Designed for long, steady burns through winter evenings.',
                    'code' => 'LA-SC-003', 'list_price' => 2499, 'discount_percent' => 0, 'stock' => 17,
                    'category_id' => 'a1000001-0000-4000-8000-000000000003', 'scent' => 'Cedar · Smoked Tea', 'burn_time' => '55 hours', 'featured' => true,
                    'created_at' => '2026-02-01 10:00:00', 'updated_at' => '2026-09-11 09:29:41',
                ],
                [
                    'id' => 'p-linen', 'title' => 'Linen Hour',
                    'description' => 'Fresh linen and pale citrus — light, clean, and airy. Ideal for morning rituals and open studios.',
                    'code' => 'LA-LH-004', 'list_price' => 1599, 'discount_percent' => 20, 'stock' => 55,
                    'category_id' => 'a1000001-0000-4000-8000-000000000004', 'scent' => 'Linen · Citrus', 'burn_time' => '40 hours', 'featured' => false,
                    'created_at' => '2026-02-08 10:00:00', 'updated_at' => '2026-02-08 10:00:00',
                ],
                [
                    'id' => 'p-velvet', 'title' => 'Velvet Ember',
                    'description' => 'Deep cocoa and soft spice in a matte vessel. A richer profile for intimate gatherings and cooler nights.',
                    'code' => 'LA-VE-005', 'list_price' => 2799, 'discount_percent' => 12, 'stock' => 14,
                    'category_id' => 'a1000001-0000-4000-8000-000000000005', 'scent' => 'Cocoa · Spice', 'burn_time' => '60 hours', 'featured' => true,
                    'created_at' => '2026-02-15 10:00:00', 'updated_at' => '2026-02-15 10:00:00',
                ],
                [
                    'id' => 'p-mist', 'title' => 'Coastal Mist',
                    'description' => 'Sea salt, driftwood, and a whisper of bergamot. Evokes open windows and quiet shorelines.',
                    'code' => 'LA-CM-006', 'list_price' => 1999, 'discount_percent' => 5, 'stock' => 32,
                    'category_id' => 'a1000001-0000-4000-8000-000000000004', 'scent' => 'Sea Salt · Bergamot', 'burn_time' => '48 hours', 'featured' => false,
                    'created_at' => '2026-03-01 10:00:00', 'updated_at' => '2026-09-11 09:28:11',
                ],
            ];

            foreach ($products as $row) {
                Product::query()->create($row);
            }

            $images = [
                ['p-aurora', '/images/candle-1.svg', 0],
                ['p-aurora', '/images/candle-1-b.svg', 1],
                ['p-nocturne', '/images/candle-2.svg', 0],
                ['p-nocturne', '/images/candle-2-b.svg', 1],
                ['p-solstice', '/images/candle-3.svg', 0],
                ['p-solstice', '/images/candle-3-b.svg', 1],
                ['p-linen', '/images/candle-4.svg', 0],
                ['p-linen', '/images/candle-4-b.svg', 1],
                ['p-velvet', '/images/candle-5.svg', 0],
                ['p-velvet', '/images/candle-5-b.svg', 1],
                ['p-mist', '/images/candle-6.svg', 0],
                ['p-mist', '/images/candle-6-b.svg', 1],
            ];

            foreach ($images as [$productId, $url, $sortOrder]) {
                ProductImage::query()->create([
                    'id' => (string) str()->uuid(),
                    'product_id' => $productId,
                    'url' => $url,
                    'sort_order' => $sortOrder,
                ]);
            }

            $options = [
                ['frag-sandalwood', 'fragrance', 'Sandalwood & Vanilla', 0, 'Warm amber base — included with signature pours', null],
                ['frag-jasmine', 'fragrance', 'Night Jasmine', 149, 'Soft floral musk for evening rooms', null],
                ['frag-cedar', 'fragrance', 'Cedar & Smoked Tea', 199, 'Grounded woody profile', null],
                ['frag-linen', 'fragrance', 'Linen Citrus', 129, 'Clean, airy morning scent', null],
                ['frag-cocoa', 'fragrance', 'Velvet Cocoa', 249, 'Deep gourmand with soft spice', null],
                ['color-ivory', 'color', 'Ivory', 0, 'Natural unpigmented wax', '#F5F0E8'],
                ['color-blush', 'color', 'Blush', 99, 'Soft rose tint', '#E8C4B8'],
                ['color-sage', 'color', 'Sage', 99, 'Muted botanical green', '#A8B5A0'],
                ['color-amber', 'color', 'Amber Glow', 149, 'Warm honey tone', '#C4956A'],
                ['color-ink', 'color', 'Charcoal', 149, 'Matte deep charcoal vessel', '#2C2C2C'],
                ['flower-none', 'flower', 'No flowers', 0, 'Candle and packaging only', null],
                ['flower-lavender', 'flower', 'Dried lavender', 299, 'A quiet botanical sprig', null],
                ['flower-rose', 'flower', 'Preserved rose buds', 449, 'Soft blush roses in tissue', null],
                ['flower-eucalyptus', 'flower', 'Eucalyptus bundle', 349, 'Fresh greenery for the box', null],
                ['flower-mixed', 'flower', 'Seasonal mixed posy', 599, 'Studio-selected seasonal blooms', null],
            ];

            foreach ($options as [$id, $type, $label, $price, $description, $swatch]) {
                HamperOption::query()->create([
                    'id' => $id,
                    'option_type' => $type,
                    'label' => $label,
                    'price' => $price,
                    'description' => $description,
                    'swatch_hex' => $swatch,
                    'active' => true,
                ]);
            }

            Customer::query()->create([
                'id' => '7a627349-2221-4be8-bdf8-b36cf255970f',
                'name' => 'test name',
                'email' => 'test@email.com',
                'phone' => '1234567890',
                'created_at' => '2026-09-11 09:28:11',
            ]);

            Customer::query()->create([
                'id' => 'f5906529-e15e-4a4a-953f-4186e3feff50',
                'name' => 'this another',
                'email' => 'test@test.com',
                'phone' => '123456789',
                'created_at' => '2026-09-11 09:29:41',
            ]);

            GiftHamper::query()->create([
                'id' => '7a627349-2221-4be8-bdf8-b36cf255970f',
                'reference' => 'LA-GH-0001',
                'customer_id' => '7a627349-2221-4be8-bdf8-b36cf255970f',
                'candle_product_id' => 'p-mist',
                'fragrance_option_id' => 'frag-jasmine',
                'color_option_id' => 'color-ink',
                'flower_option_id' => 'flower-eucalyptus',
                'logo_url' => null,
                'packaging_fee' => 199,
                'logo_fee' => 0,
                'total' => 2745,
                'notes' => 'Test gift note',
                'status' => 'pending',
                'created_at' => '2026-09-11 09:28:11',
                'candle_price_charged' => 1899,
                'fragrance_price_charged' => 149,
                'color_price_charged' => 149,
                'flower_price_charged' => 349,
            ]);

            GiftHamper::query()->create([
                'id' => 'f5906529-e15e-4a4a-953f-4186e3feff50',
                'reference' => 'LA-GH-0002',
                'customer_id' => 'f5906529-e15e-4a4a-953f-4186e3feff50',
                'candle_product_id' => 'p-solstice',
                'fragrance_option_id' => 'frag-cocoa',
                'color_option_id' => 'color-blush',
                'flower_option_id' => 'flower-none',
                'logo_url' => null,
                'packaging_fee' => 199,
                'logo_fee' => 0,
                'total' => 3046,
                'notes' => 'This is new note with hearts',
                'status' => 'pending',
                'created_at' => '2026-09-11 09:29:41',
                'candle_price_charged' => 2499,
                'fragrance_price_charged' => 249,
                'color_price_charged' => 99,
                'flower_price_charged' => 0,
            ]);
        });

        $this->call(PageSectionSeeder::class);
    }
}
