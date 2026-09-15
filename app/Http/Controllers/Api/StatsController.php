<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Billing;
use App\Models\GiftHamper;
use App\Models\Product;
use App\Support\Pricing;
use Illuminate\Http\JsonResponse;

class StatsController extends Controller
{
    public function index(): JsonResponse
    {
        $products = Product::query()->with(['category', 'images'])->get();
        $lowStock = $products->filter(fn (Product $p) => $p->stock <= 10)->values();
        $totalStock = $products->sum('stock');

        $billings = Billing::query()->with(['customer', 'items'])->get();
        $onlineSales = $billings->where('channel', 'online')->sum('total');
        $offlineSales = $billings->where('channel', 'offline')->sum('total');

        $recentBillings = Billing::query()
            ->with(['customer', 'items'])
            ->orderByDesc('created_at')
            ->limit(5)
            ->get()
            ->map(fn (Billing $b) => $b->toApiArray());

        return response()->json([
            'productCount' => $products->count(),
            'totalStock' => (int) $totalStock,
            'lowStockCount' => $lowStock->count(),
            'billingCount' => $billings->count(),
            'hamperCount' => GiftHamper::query()->count(),
            'onlineSales' => Pricing::roundMoney((float) $onlineSales),
            'offlineSales' => Pricing::roundMoney((float) $offlineSales),
            'totalSales' => Pricing::roundMoney((float) ($onlineSales + $offlineSales)),
            'recentBillings' => $recentBillings,
            'lowStock' => $lowStock->map(fn (Product $p) => $p->toApiArray())->values(),
        ]);
    }
}
