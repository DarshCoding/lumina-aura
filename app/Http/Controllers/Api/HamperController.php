<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\GiftHamper;
use App\Models\HamperOption;
use App\Models\Product;
use App\Support\HamperPricing;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HamperController extends Controller
{
    public function index(): JsonResponse
    {
        $hampers = GiftHamper::query()
            ->with(['customer', 'candleProduct', 'fragranceOption', 'colorOption', 'flowerOption'])
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (GiftHamper $h) => $h->toApiArray());

        return response()->json($hampers);
    }

    public function options(): JsonResponse
    {
        $options = HamperOption::query()
            ->where('active', true)
            ->orderBy('option_type')
            ->orderBy('price')
            ->orderBy('label')
            ->get()
            ->groupBy('option_type');

        return response()->json([
            'fragrances' => ($options->get('fragrance') ?? collect())->values()->map->toApiArray()->all(),
            'colors' => ($options->get('color') ?? collect())->values()->map->toApiArray()->all(),
            'flowers' => ($options->get('flower') ?? collect())->values()->map->toApiArray()->all(),
            'packagingFee' => HamperPricing::packagingBaseFee(),
            'logoFee' => HamperPricing::logoPackagingFee(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $name = trim((string) $request->input('customerName', ''));
        $email = trim((string) $request->input('customerEmail', ''));

        if (! $name || ! $email || ! $request->input('candleProductId') || ! $request->input('fragranceId')
            || ! $request->input('colorId') || ! $request->input('flowerId')) {
            return response()->json([
                'error' => 'Name, email, candle, fragrance, color, and flower are required',
            ], 400);
        }

        if (! filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return response()->json(['error' => 'Please enter a valid email'], 400);
        }

        try {
            $hamper = DB::transaction(function () use ($request, $name, $email) {
                $product = Product::query()->lockForUpdate()->find($request->input('candleProductId'));
                if (! $product) {
                    throw new \RuntimeException('Candle not found');
                }
                if ($product->stock < 1) {
                    throw new \RuntimeException($product->title.' is out of stock');
                }

                $fragrance = HamperOption::query()->where('id', $request->input('fragranceId'))->where('active', true)->first();
                $color = HamperOption::query()->where('id', $request->input('colorId'))->where('active', true)->first();
                $flower = HamperOption::query()->where('id', $request->input('flowerId'))->where('active', true)->first();

                if (! $fragrance) {
                    throw new \RuntimeException('Invalid fragrance selection');
                }
                if (! $color) {
                    throw new \RuntimeException('Invalid color selection');
                }
                if (! $flower) {
                    throw new \RuntimeException('Invalid flower selection');
                }

                $logoUrl = $request->input('logoUrl');
                $hasLogo = ! empty($logoUrl);

                $breakdown = HamperPricing::calculateHamperPrice(
                    (float) $product->sale_price,
                    $fragrance,
                    $color,
                    $flower,
                    $hasLogo
                );

                $product->update(['stock' => $product->stock - 1]);

                $customer = Customer::findOrCreateFromInput(
                    $name,
                    $email,
                    $request->input('customerPhone')
                );

                $count = GiftHamper::query()->count() + 1;

                return GiftHamper::query()->create([
                    'id' => (string) str()->uuid(),
                    'reference' => sprintf('LA-GH-%04d', $count),
                    'customer_id' => $customer->id,
                    'candle_product_id' => $product->id,
                    'fragrance_option_id' => $fragrance->id,
                    'color_option_id' => $color->id,
                    'flower_option_id' => $flower->id,
                    'logo_url' => $hasLogo ? $logoUrl : null,
                    'packaging_fee' => $breakdown['packaging'],
                    'logo_fee' => $breakdown['logo'],
                    'total' => $breakdown['total'],
                    'notes' => $request->input('notes') ? trim((string) $request->input('notes')) : null,
                    'status' => 'pending',
                    'created_at' => now(),
                    'candle_price_charged' => $breakdown['candle'],
                    'fragrance_price_charged' => $breakdown['fragrance'],
                    'color_price_charged' => $breakdown['color'],
                    'flower_price_charged' => $breakdown['flower'],
                ])->fresh(['customer', 'candleProduct', 'fragranceOption', 'colorOption', 'flowerOption']);
            });
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }

        return response()->json($hamper->toApiArray(), 201);
    }
}
