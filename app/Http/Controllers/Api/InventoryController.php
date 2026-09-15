<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    public function update(Request $request, string $id): JsonResponse
    {
        $stock = $request->input('stock');
        if ($stock === null || ! is_numeric($stock)) {
            return response()->json(['error' => 'Invalid stock'], 400);
        }

        $product = Product::query()->with(['category', 'images'])->find($id);
        if (! $product) {
            return response()->json(['error' => 'Not found'], 404);
        }

        $product->update(['stock' => max(0, (int) floor((float) $stock))]);

        return response()->json($product->fresh(['category', 'images'])->toApiArray());
    }
}
