<?php

namespace App\Support;

use App\Models\FeeType;
use App\Models\HamperOption;

class HamperPricing
{
    public static function packagingBaseFee(): float
    {
        return (float) (FeeType::query()->where('code', 'packaging_base')->value('amount') ?? 199);
    }

    public static function logoPackagingFee(): float
    {
        return (float) (FeeType::query()->where('code', 'logo_packaging')->value('amount') ?? 249);
    }

    public static function calculateHamperPrice(
        float $candlePrice,
        HamperOption $fragrance,
        HamperOption $color,
        HamperOption $flower,
        bool $hasLogo
    ): array {
        $packaging = self::packagingBaseFee();
        $logo = $hasLogo ? self::logoPackagingFee() : 0;
        $candle = Pricing::roundMoney($candlePrice);
        $fragrancePrice = Pricing::roundMoney((float) $fragrance->price);
        $colorPrice = Pricing::roundMoney((float) $color->price);
        $flowerPrice = Pricing::roundMoney((float) $flower->price);
        $total = Pricing::roundMoney($candle + $fragrancePrice + $colorPrice + $flowerPrice + $packaging + $logo);

        return [
            'candle' => $candle,
            'fragrance' => $fragrancePrice,
            'color' => $colorPrice,
            'flower' => $flowerPrice,
            'packaging' => Pricing::roundMoney($packaging),
            'logo' => Pricing::roundMoney($logo),
            'total' => $total,
        ];
    }
}
