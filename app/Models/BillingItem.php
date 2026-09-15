<?php

namespace App\Models;

use App\Support\Pricing;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BillingItem extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    public $timestamps = false;

    protected $fillable = [
        'id',
        'billing_id',
        'product_id',
        'quantity',
        'unit_price',
        'line_total',
        'product_title',
        'product_code',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'unit_price' => 'float',
        'line_total' => 'float',
    ];

    public function billing(): BelongsTo
    {
        return $this->belongsTo(Billing::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function toApiArray(): array
    {
        return [
            'productId' => $this->product_id,
            'productTitle' => $this->product_title,
            'productCode' => $this->product_code,
            'quantity' => (int) $this->quantity,
            'unitPrice' => Pricing::roundMoney((float) $this->unit_price),
            'lineTotal' => Pricing::roundMoney((float) $this->line_total),
        ];
    }
}
