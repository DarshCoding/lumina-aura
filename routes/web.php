<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BillingController;
use App\Http\Controllers\Api\HamperController;
use App\Http\Controllers\Api\InventoryController;
use App\Http\Controllers\Api\PageContentController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\StatsController;
use App\Http\Controllers\Api\UploadController;
use Illuminate\Support\Facades\Route;

Route::prefix('api')->group(function () {
    Route::post('auth', [AuthController::class, 'store']);

    Route::get('products', [ProductController::class, 'index']);
    Route::post('products', [ProductController::class, 'store'])->middleware('admin.auth');
    Route::get('products/{id}', [ProductController::class, 'show']);
    Route::match(['put', 'patch'], 'products/{id}', [ProductController::class, 'update'])->middleware('admin.auth');
    Route::delete('products/{id}', [ProductController::class, 'destroy'])->middleware('admin.auth');

    Route::patch('inventory/{id}', [InventoryController::class, 'update'])->middleware('admin.auth');

    Route::get('billings', [BillingController::class, 'index'])->middleware('admin.auth');
    Route::post('billings', [BillingController::class, 'store'])->middleware('admin.auth');

    Route::get('hampers', [HamperController::class, 'index'])->middleware('admin.auth');
    Route::get('hamper-options', [HamperController::class, 'options']);
    Route::post('hampers', [HamperController::class, 'store']);
    Route::post('hampers/upload', [UploadController::class, 'hamperLogo']);

    Route::get('stats', [StatsController::class, 'index'])->middleware('admin.auth');

    Route::get('page-sections', [PageContentController::class, 'index']);
    Route::put('page-sections/{id}', [PageContentController::class, 'update'])->middleware('admin.auth');
    Route::put('page-sections', [PageContentController::class, 'bulkUpdate'])->middleware('admin.auth');

    Route::post('upload', [UploadController::class, 'store'])->middleware('admin.auth');
});

Route::view('/{any?}', 'app')->where('any', '^(?!api).*$');
