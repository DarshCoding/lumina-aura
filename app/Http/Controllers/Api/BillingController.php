<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Billing;
use App\Models\BillingItem;
use App\Models\Customer;
use App\Models\Product;
use App\Support\Pricing;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BillingController extends Controller
{
    public function index(): JsonResponse
    {
        $billings = Billing::query()
            ->with(['customer', 'items'])
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (Billing $b) => $b->toApiArray());

        return response()->json($billings);
    }

    public function store(Request $request): JsonResponse
    {
        if (! $request->input('customerName') || ! $request->input('channel') || ! count($request->input('items', []))) {
            return response()->json(['error' => 'Customer, channel, and items are required'], 400);
        }

        try {
            $billing = DB::transaction(function () use ($request) {
                $itemsInput = $request->input('items', []);
                $lineRows = [];
                $subtotal = 0;
                $discountTotal = 0;

                foreach ($itemsInput as $line) {
                    $product = Product::query()->lockForUpdate()->find($line['productId'] ?? null);
                    if (! $product) {
                        throw new \RuntimeException('Product not found: '.($line['productId'] ?? ''));
                    }

                    $quantity = (int) ($line['quantity'] ?? 0);
                    if ($quantity <= 0) {
                        throw new \RuntimeException('Invalid quantity for '.$product->title);
                    }

                    if ($product->stock < $quantity) {
                        throw new \RuntimeException('Insufficient stock for '.$product->title);
                    }

                    $unitPrice = Pricing::roundMoney((float) $product->sale_price);
                    $lineTotal = Pricing::roundMoney($unitPrice * $quantity);
                    $listLine = Pricing::roundMoney((float) $product->list_price * $quantity);

                    $lineRows[] = [
                        'product' => $product,
                        'quantity' => $quantity,
                        'unit_price' => $unitPrice,
                        'line_total' => $lineTotal,
                    ];

                    $subtotal += $listLine;
                    $discountTotal += $listLine - $lineTotal;

                    $product->update([
                        'stock' => $product->stock - $quantity,
                    ]);
                }

                $customer = Customer::findOrCreateFromInput(
                    $request->input('customerName'),
                    $request->input('customerEmail'),
                    $request->input('customerPhone')
                );

                $count = Billing::query()->count() + 1;
                $channel = $request->input('channel') === 'online' ? 'ON' : 'OFF';

                $billing = Billing::query()->create([
                    'id' => (string) str()->uuid(),
                    'invoice_number' => sprintf('LA-%s-%04d', $channel, $count),
                    'channel' => $request->input('channel'),
                    'customer_id' => $customer->id,
                    'subtotal' => Pricing::roundMoney($subtotal),
                    'discount_total' => Pricing::roundMoney($discountTotal),
                    'total' => Pricing::roundMoney($subtotal - $discountTotal),
                    'notes' => $request->input('notes'),
                    'created_at' => now(),
                ]);

                foreach ($lineRows as $row) {
                    /** @var Product $product */
                    $product = $row['product'];
                    BillingItem::query()->create([
                        'id' => (string) str()->uuid(),
                        'billing_id' => $billing->id,
                        'product_id' => $product->id,
                        'quantity' => $row['quantity'],
                        'unit_price' => $row['unit_price'],
                        'line_total' => $row['line_total'],
                        'product_title' => $product->title,
                        'product_code' => $product->code,
                    ]);
                }

                return $billing->fresh(['customer', 'items']);
            });
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }

        return response()->json($billing->toApiArray(), 201);
    }
}
