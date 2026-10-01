<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CollarController;
use App\Http\Controllers\Api\DesignController;
use App\Http\Controllers\Api\MaterialController;
use App\Http\Controllers\Api\PricingPackageController;
use App\Http\Controllers\Api\SiteSettingController;
use App\Http\Controllers\Api\TestimonialController;
use Illuminate\Support\Facades\Route;

Route::get('categories', [CategoryController::class, 'index']);
Route::get('categories/{category:slug}', [CategoryController::class, 'show']);
Route::get('designs', [DesignController::class, 'index']);
Route::get('designs/{design:slug}', [DesignController::class, 'show']);
Route::get('pricing-packages', [PricingPackageController::class, 'index']);
Route::get('pricing-packages/{pricingPackage:slug}', [PricingPackageController::class, 'show']);
Route::get('materials', [MaterialController::class, 'index']);
Route::get('materials/{material:slug}', [MaterialController::class, 'show']);
Route::get('collars', [CollarController::class, 'index']);
Route::get('collars/{collar:slug}', [CollarController::class, 'show']);
Route::get('testimonials', [TestimonialController::class, 'index']);
Route::get('testimonials/{testimonial}', [TestimonialController::class, 'show']);
Route::get('site-settings', [SiteSettingController::class, 'show']);
Route::prefix('admin')->name('admin.')->middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::apiResource('categories', CategoryController::class)->parameters(['categories' => 'category']);
    Route::apiResource('designs', DesignController::class)->parameters(['designs' => 'design']);
    Route::apiResource('pricing-packages', PricingPackageController::class)->parameters(['pricing-packages' => 'pricingPackage']);
    Route::apiResource('materials', MaterialController::class)->parameters(['materials' => 'material']);
    Route::apiResource('collars', CollarController::class)->parameters(['collars' => 'collar']);
    Route::apiResource('testimonials', TestimonialController::class)->parameters(['testimonials' => 'testimonial']);
    Route::match(['put', 'patch'], 'site-settings', [SiteSettingController::class, 'update'])->name('site-settings.update');
});
