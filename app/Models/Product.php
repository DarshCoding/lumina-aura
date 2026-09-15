<?php

namespace App\Models;

use App\Support\Pricing;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'title',
        'description',
        'code',
        'list_price',
        'discount_percent',
        'stock',
        'category_id',
        'scent',
        'burn_time',
        'featured',
    ];

    protected $casts = [
        'list_price' => 'float',
        'discount_percent' => 'float',
        'sale_price' => 'float',
        'stock' => 'integer',
        'featured' => 'boolean',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    public function toApiArray(): array
    {
        $this->loadMissing(['category', 'images']);

        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'code' => $this->code,
            'images' => $this->images->pluck('url')->values()->all(),
            'price' => Pricing::roundMoney((float) $this->list_price),
            'discountPercent' => Pricing::roundMoney((float) $this->discount_percent),
            'discountPrice' => Pricing::roundMoney((float) $this->sale_price),
            'stock' => (int) $this->stock,
            'category' => $this->category?->name ?? '',
            'scent' => $this->scent,
            'burnTime' => $this->burn_time,
            'featured' => (bool) $this->featured,
            'createdAt' => $this->created_at?->toIso8601String(),
            'updatedAt' => $this->updated_at?->toIso8601String(),
        ];
    }
}
