<?php

namespace App\Models;

use App\Support\Pricing;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Billing extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    public $timestamps = false;

    protected $fillable = [
        'id',
        'invoice_number',
        'channel',
        'customer_id',
        'subtotal',
        'discount_total',
        'total',
        'notes',
        'created_at',
    ];

    protected $casts = [
        'subtotal' => 'float',
        'discount_total' => 'float',
        'total' => 'float',
        'created_at' => 'datetime',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(BillingItem::class);
    }

    public function toApiArray(): array
    {
        $this->loadMissing(['customer', 'items']);

        return [
            'id' => $this->id,
            'invoiceNumber' => $this->invoice_number,
            'channel' => $this->channel,
            'customerName' => $this->customer?->name ?? '',
            'customerEmail' => $this->customer?->email,
            'customerPhone' => $this->customer?->phone,
            'items' => $this->items->map(fn (BillingItem $item) => $item->toApiArray())->values()->all(),
            'subtotal' => Pricing::roundMoney((float) $this->subtotal),
            'discountTotal' => Pricing::roundMoney((float) $this->discount_total),
            'total' => Pricing::roundMoney((float) $this->total),
            'notes' => $this->notes,
            'createdAt' => $this->created_at?->toIso8601String(),
        ];
    }
}
