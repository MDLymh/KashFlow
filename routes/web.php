<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ReceiptController;
use App\Http\Controllers\ReceiptAnalysisController;
use App\Http\Controllers\CategoryController;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Transactions
    Route::resource('transactions', TransactionController::class);
    
    // Reports
    Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('reports/export', [ReportController::class, 'export'])->name('reports.export');
    Route::get('reports/monthly', [ReportController::class, 'monthly'])->name('reports.monthly');
    Route::get('reports/yearly', [ReportController::class, 'yearly'])->name('reports.yearly');
    
    // Receipts
    Route::post('receipts/upload', [ReceiptController::class, 'upload'])->name('receipts.upload');
    Route::post('receipts/analyze', [ReceiptAnalysisController::class, 'analyze'])->name('receipts.analyze');
    Route::get('receipts', [ReceiptController::class, 'index'])->name('receipts.index');
    Route::get('receipts/{receipt}/download', [ReceiptController::class, 'downloadFile'])->name('receipts.download');
    Route::get('receipts/{receipt}', [ReceiptController::class, 'show'])->name('receipts.show')->middleware('can:view,receipt');
    Route::delete('receipts/{receipt}', [ReceiptController::class, 'destroy'])->name('receipts.destroy')->middleware('can:delete,receipt');
    
    // Categories
    Route::resource('categories', CategoryController::class);
});

require __DIR__.'/settings.php';
