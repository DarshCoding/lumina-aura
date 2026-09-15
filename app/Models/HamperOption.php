<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HamperOption extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    public $timestamps = false;

    protected $fillable = [
        'id',
        'option_type',
        'label',
        'price',
        'description',
        'swatch_hex',
        'active',
    ];

    protected $casts = [
        'price' => 'float',
        'active' => 'boolean',
    ];

    public function toApiArray(): array
    {
        return [
            'id' => $this->id,
            'label' => $this->label,
            'price' => (float) $this->price,
            'description' => $this->description,
            'swatch' => $this->swatch_hex,
        ];
    }
}
