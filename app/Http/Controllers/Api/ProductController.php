<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Support\Pricing;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    public function index(): JsonResponse
    {
        $products = Product::query()
            ->with(['category', 'images'])
            ->orderByDesc('updated_at')
            ->get()
            ->map(fn (Product $p) => $p->toApiArray());

        return response()->json($products);
    }

    public function show(string $id): JsonResponse
    {
        $product = Product::query()->with(['category', 'images'])->find($id);
        if (! $product) {
            return response()->json(['error' => 'Not found'], 404);
        }

        return response()->json($product->toApiArray());
    }

    public function store(Request $request): JsonResponse
    {
        if (! $request->input('title') || ! $request->input('code') || $request->input('price') === null) {
            return response()->json(['error' => 'Missing required fields'], 400);
        }

        $product = DB::transaction(function () use ($request) {
            $category = $this->resolveCategory($request->input('category', 'Signature'));
            $listPrice = Pricing::roundMoney((float) $request->input('price'));
            $discountPercent = Pricing::roundMoney((float) ($request->input('discountPercent') ?? 0));

            if ($request->has('discountPrice') && $request->input('discountPrice') !== null) {
                $calc = Pricing::calcFromDiscountPrice($listPrice, (float) $request->input('discountPrice'));
                $discountPercent = $calc['discountPercent'];
            }

            $product = Product::query()->create([
                'id' => (string) str()->uuid(),
                'title' => $request->input('title'),
                'description' => $request->input('description', ''),
                'code' => $request->input('code'),
                'list_price' => $listPrice,
                'discount_percent' => $discountPercent,
                'stock' => max(0, (int) floor((float) ($request->input('stock') ?? 0))),
                'category_id' => $category->id,
                'scent' => $request->input('scent'),
                'burn_time' => $request->input('burnTime'),
                'featured' => (bool) $request->input('featured'),
            ]);

            $this->syncImages($product, $request->input('images', []));

            return $product->fresh(['category', 'images']);
        });

        return response()->json($product->toApiArray(), 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $product = Product::query()->find($id);
        if (! $product) {
            return response()->json(['error' => 'Not found'], 404);
        }

        $product = DB::transaction(function () use ($request, $product) {
            $updates = [];

            foreach (['title', 'description', 'code', 'scent'] as $field) {
                if ($request->has($field)) {
                    $updates[$field] = $request->input($field);
                }
            }

            if ($request->has('burnTime')) {
                $updates['burn_time'] = $request->input('burnTime');
            }

            if ($request->has('featured')) {
                $updates['featured'] = (bool) $request->input('featured');
            }

            if ($request->has('stock')) {
                $updates['stock'] = max(0, (int) floor((float) $request->input('stock')));
            }

            if ($request->has('category')) {
                $updates['category_id'] = $this->resolveCategory($request->input('category'))->id;
            }

            $listPrice = (float) $product->list_price;
            if ($request->has('price')) {
                $listPrice = Pricing::roundMoney((float) $request->input('price'));
                $updates['list_price'] = $listPrice;
            }

            $discountPercent = (float) $product->discount_percent;
            if ($request->has('discountPercent')) {
                $discountPercent = Pricing::roundMoney((float) $request->input('discountPercent'));
            }

            if ($request->has('discountPrice')) {
                $calc = Pricing::calcFromDiscountPrice($listPrice, (float) $request->input('discountPrice'));
                $discountPercent = $calc['discountPercent'];
            } elseif ($request->has('discountPercent') || $request->has('price')) {
                Pricing::calcFromPercent($listPrice, $discountPercent);
            }

            if ($request->has('discountPercent') || $request->has('discountPrice') || $request->has('price')) {
                $updates['discount_percent'] = $discountPercent;
            }

            if ($updates) {
                $product->update($updates);
            }

            if ($request->has('images')) {
                $this->syncImages($product, $request->input('images', []));
            }

            return $product->fresh(['category', 'images']);
        });

        return response()->json($product->toApiArray());
    }

    public function destroy(string $id): JsonResponse
    {
        $product = Product::query()->find($id);
        if (! $product) {
            return response()->json(['error' => 'Not found'], 404);
        }

        $product->delete();

        return response()->json(['ok' => true]);
    }

    private function resolveCategory(string $name): Category
    {
        $name = trim($name) ?: 'Signature';

        return Category::query()->firstOrCreate(
            ['name' => $name],
            ['id' => (string) str()->uuid()]
        );
    }

    private function syncImages(Product $product, mixed $images): void
    {
        $urls = is_array($images) ? array_values(array_filter($images)) : [];
        ProductImage::query()->where('product_id', $product->id)->delete();

        foreach ($urls as $index => $url) {
            ProductImage::query()->create([
                'id' => (string) str()->uuid(),
                'product_id' => $product->id,
                'url' => $url,
                'sort_order' => $index,
            ]);
        }
    }
}
