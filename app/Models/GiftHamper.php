<?php

namespace App\Models;

use App\Support\Pricing;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GiftHamper extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    public $timestamps = false;

    protected $fillable = [
        'id',
        'reference',
        'customer_id',
        'candle_product_id',
        'fragrance_option_id',
        'color_option_id',
        'flower_option_id',
        'logo_url',
        'packaging_fee',
        'logo_fee',
        'total',
        'notes',
        'status',
        'created_at',
        'candle_price_charged',
        'fragrance_price_charged',
        'color_price_charged',
        'flower_price_charged',
    ];

    protected $casts = [
        'packaging_fee' => 'float',
        'logo_fee' => 'float',
        'total' => 'float',
        'candle_price_charged' => 'float',
        'fragrance_price_charged' => 'float',
        'color_price_charged' => 'float',
        'flower_price_charged' => 'float',
        'created_at' => 'datetime',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function candleProduct(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'candle_product_id');
    }

    public function fragranceOption(): BelongsTo
    {
        return $this->belongsTo(HamperOption::class, 'fragrance_option_id');
    }

    public function colorOption(): BelongsTo
    {
        return $this->belongsTo(HamperOption::class, 'color_option_id');
    }

    public function flowerOption(): BelongsTo
    {
        return $this->belongsTo(HamperOption::class, 'flower_option_id');
    }

    public function toApiArray(): array
    {
        $this->loadMissing(['customer', 'candleProduct', 'fragranceOption', 'colorOption', 'flowerOption']);

        $candle = $this->candleProduct;

        return [
            'id' => $this->id,
            'reference' => $this->reference,
            'customerName' => $this->customer?->name ?? '',
            'customerEmail' => $this->customer?->email ?? '',
            'customerPhone' => $this->customer?->phone,
            'candle' => [
                'productId' => $this->candle_product_id,
                'id' => $this->candle_product_id,
                'label' => $candle?->title ?? '',
                'price' => Pricing::roundMoney((float) $this->candle_price_charged),
            ],
            'fragrance' => [
                'id' => $this->fragrance_option_id,
                'label' => $this->fragranceOption?->label ?? '',
                'price' => Pricing::roundMoney((float) $this->fragrance_price_charged),
            ],
            'color' => [
                'id' => $this->color_option_id,
                'label' => $this->colorOption?->label ?? '',
                'price' => Pricing::roundMoney((float) $this->color_price_charged),
            ],
            'flower' => [
                'id' => $this->flower_option_id,
                'label' => $this->flowerOption?->label ?? '',
                'price' => Pricing::roundMoney((float) $this->flower_price_charged),
            ],
            'logoUrl' => $this->logo_url,
            'packagingFee' => Pricing::roundMoney((float) $this->packaging_fee),
            'logoFee' => Pricing::roundMoney((float) $this->logo_fee),
            'total' => Pricing::roundMoney((float) $this->total),
            'notes' => $this->notes,
            'status' => $this->status,
            'createdAt' => $this->created_at?->toIso8601String(),
        ];
    }
}
