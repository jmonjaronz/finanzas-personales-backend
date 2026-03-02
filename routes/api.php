<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AccountController;
use App\Http\Controllers\Api\TransactionChannelController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\PersonController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\TransferController;
use App\Http\Controllers\Api\DashboardSummaryController;

Route::post('/register', [AuthController::class , 'register']);
Route::post('/login', [AuthController::class , 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class , 'logout']);
    Route::get('/me', [AuthController::class , 'me']);

    Route::get('/dashboard/summary', [DashboardSummaryController::class , 'summary']);

    Route::apiResource('accounts', AccountController::class);
    Route::apiResource('transaction-channels', TransactionChannelController::class);
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('people', PersonController::class);
    Route::apiResource('transactions', TransactionController::class);
    Route::apiResource('transfers', TransferController::class);
});
