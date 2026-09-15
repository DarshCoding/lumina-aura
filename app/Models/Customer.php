<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Customer extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    public $timestamps = false;

    protected $fillable = ['id', 'name', 'email', 'phone'];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function billings(): HasMany
    {
        return $this->hasMany(Billing::class);
    }

    public function giftHampers(): HasMany
    {
        return $this->hasMany(GiftHamper::class);
    }

    public static function findOrCreateFromInput(string $name, ?string $email, ?string $phone): self
    {
        $name = trim($name);
        $email = $email !== null && $email !== '' ? trim(strtolower($email)) : null;
        $phone = $phone !== null && $phone !== '' ? trim($phone) : null;

        $query = static::query()->where('name', $name);
        if ($email) {
            $query->whereRaw('LOWER(email) = ?', [$email]);
        } else {
            $query->whereNull('email');
        }

        $existing = $query->first();
        if ($existing) {
            if ($phone && $existing->phone !== $phone) {
                $existing->phone = $phone;
                $existing->save();
            }

            return $existing;
        }

        return static::query()->create([
            'id' => (string) str()->uuid(),
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'created_at' => now(),
        ]);
    }
}
