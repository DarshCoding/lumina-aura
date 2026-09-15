<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeeType extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    public $timestamps = false;

    protected $primaryKey = 'code';

    protected $fillable = ['code', 'label', 'amount', 'effective_from'];

    protected $casts = [
        'amount' => 'float',
        'effective_from' => 'datetime',
    ];
}
