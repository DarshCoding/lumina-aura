<?php

namespace App\Support;

class Pricing
{
    public static function roundMoney(float $value): float
    {
        return round($value + 1e-9, 2);
    }

    public static function calcFromPercent(float $price, float $discountPercent): array
    {
        $pct = min(100, max(0, $discountPercent));
        $discountPrice = self::roundMoney($price * (1 - $pct / 100));

        return [
            'discountPercent' => self::roundMoney($pct),
            'discountPrice' => $discountPrice,
        ];
    }

    public static function calcFromDiscountPrice(float $price, float $discountPrice): array
    {
        if ($price <= 0) {
            return ['discountPercent' => 0, 'discountPrice' => self::roundMoney($discountPrice)];
        }

        $dp = min($price, max(0, $discountPrice));
        $discountPercent = self::roundMoney((($price - $dp) / $price) * 100);

        return ['discountPercent' => $discountPercent, 'discountPrice' => self::roundMoney($dp)];
    }
}
