<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('page_sections', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('page', 64);
            $table->string('section_key', 64);
            $table->string('label');
            $table->string('eyebrow')->nullable();
            $table->string('title')->nullable();
            $table->text('body')->nullable();
            $table->text('body_secondary')->nullable();
            $table->string('image_url')->nullable();
            $table->string('cta_label')->nullable();
            $table->string('cta_href')->nullable();
            $table->string('cta_secondary_label')->nullable();
            $table->string('cta_secondary_href')->nullable();
            $table->json('meta')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->unique(['page', 'section_key']);
            $table->index(['page', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('page_sections');
    }
};
