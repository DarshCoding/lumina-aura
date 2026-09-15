<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sale_channels', function (Blueprint $table) {
            $table->string('code')->primary();
            $table->string('label');
        });

        Schema::create('hamper_statuses', function (Blueprint $table) {
            $table->string('code')->primary();
            $table->string('label');
        });

        Schema::create('hamper_option_types', function (Blueprint $table) {
            $table->string('code')->primary();
            $table->string('label');
        });

        Schema::create('fee_types', function (Blueprint $table) {
            $table->string('code')->primary();
            $table->string('label');
            $table->decimal('amount', 10, 2);
            $table->timestamp('effective_from')->useCurrent();
        });

        Schema::create('categories', function (Blueprint $table) {
            $table->char('id', 36)->primary();
            $table->string('name')->unique();
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('products', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('title');
            $table->text('description');
            $table->string('code')->unique();
            $table->decimal('list_price', 10, 2);
            $table->decimal('discount_percent', 5, 2)->default(0);
            $table->integer('stock')->default(0);
            $table->char('category_id', 36);
            $table->string('scent')->nullable();
            $table->string('burn_time')->nullable();
            $table->boolean('featured')->default(false);
            $table->timestamps();

            $table->foreign('category_id')->references('id')->on('categories');
            $table->index('category_id');
            $table->index('featured');
        });

        DB::statement(
            'ALTER TABLE products ADD sale_price DECIMAL(10,2) AS (ROUND(list_price * (1 - discount_percent / 100), 2)) STORED'
        );

        Schema::create('product_images', function (Blueprint $table) {
            $table->char('id', 36)->primary();
            $table->string('product_id');
            $table->string('url');
            $table->smallInteger('sort_order')->default(0);

            $table->foreign('product_id')->references('id')->on('products')->cascadeOnDelete();
            $table->unique(['product_id', 'sort_order']);
            $table->index('product_id');
        });

        Schema::create('hamper_options', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('option_type');
            $table->string('label');
            $table->decimal('price', 10, 2)->default(0);
            $table->text('description')->nullable();
            $table->char('swatch_hex', 7)->nullable();
            $table->boolean('active')->default(true);

            $table->foreign('option_type')->references('code')->on('hamper_option_types');
            $table->index('option_type');
        });

        Schema::create('customers', function (Blueprint $table) {
            $table->char('id', 36)->primary();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index('email');
        });

        Schema::create('billings', function (Blueprint $table) {
            $table->char('id', 36)->primary();
            $table->string('invoice_number')->unique();
            $table->string('channel');
            $table->char('customer_id', 36);
            $table->decimal('subtotal', 10, 2);
            $table->decimal('discount_total', 10, 2)->default(0);
            $table->decimal('total', 10, 2);
            $table->text('notes')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('channel')->references('code')->on('sale_channels');
            $table->foreign('customer_id')->references('id')->on('customers');
            $table->index('created_at');
            $table->index('channel');
        });

        Schema::create('billing_items', function (Blueprint $table) {
            $table->char('id', 36)->primary();
            $table->char('billing_id', 36);
            $table->string('product_id');
            $table->integer('quantity');
            $table->decimal('unit_price', 10, 2);
            $table->decimal('line_total', 10, 2);
            $table->string('product_title');
            $table->string('product_code');

            $table->foreign('billing_id')->references('id')->on('billings')->cascadeOnDelete();
            $table->foreign('product_id')->references('id')->on('products');
            $table->index('billing_id');
            $table->index('product_id');
        });

        Schema::create('gift_hampers', function (Blueprint $table) {
            $table->char('id', 36)->primary();
            $table->string('reference')->unique();
            $table->char('customer_id', 36);
            $table->string('candle_product_id');
            $table->string('fragrance_option_id');
            $table->string('color_option_id');
            $table->string('flower_option_id');
            $table->string('logo_url')->nullable();
            $table->decimal('packaging_fee', 10, 2);
            $table->decimal('logo_fee', 10, 2)->default(0);
            $table->decimal('total', 10, 2);
            $table->text('notes')->nullable();
            $table->string('status')->default('pending');
            $table->timestamp('created_at')->useCurrent();
            $table->decimal('candle_price_charged', 10, 2);
            $table->decimal('fragrance_price_charged', 10, 2);
            $table->decimal('color_price_charged', 10, 2);
            $table->decimal('flower_price_charged', 10, 2);

            $table->foreign('customer_id')->references('id')->on('customers');
            $table->foreign('candle_product_id')->references('id')->on('products');
            $table->foreign('fragrance_option_id')->references('id')->on('hamper_options');
            $table->foreign('color_option_id')->references('id')->on('hamper_options');
            $table->foreign('flower_option_id')->references('id')->on('hamper_options');
            $table->foreign('status')->references('code')->on('hamper_statuses');
            $table->index('status');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gift_hampers');
        Schema::dropIfExists('billing_items');
        Schema::dropIfExists('billings');
        Schema::dropIfExists('customers');
        Schema::dropIfExists('hamper_options');
        Schema::dropIfExists('product_images');
        Schema::dropIfExists('products');
        Schema::dropIfExists('categories');
        Schema::dropIfExists('fee_types');
        Schema::dropIfExists('hamper_option_types');
        Schema::dropIfExists('hamper_statuses');
        Schema::dropIfExists('sale_channels');
    }
};
