<?php

use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Auth\PasswordForgetController;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\ImageController;
use App\Http\Controllers\Api\PdfController;
use App\Http\Controllers\Auth\EmailVerificationController;
use App\Http\Controllers\Auth\IsAuthenticatedController;
use App\Http\Controllers\Auth\VerificationResendController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return ["message" => "test response"];
});

Route::get('/email/verify/{id}/{hash}', EmailVerificationController::class)->middleware(['signed.custom'])
    ->name('verification.verify');

// Resend verification email
Route::get('/email/resend-verification', VerificationResendController::class)
    ->middleware(['auth', 'throttle:6,1'])
    ->name('verification.send');

// Reset password
Route::post('/forgot-password', PasswordForgetController::class)
    ->middleware('guest')->name('password.forgot');

Route::post('/reset-password', PasswordResetController::class)
    ->middleware('guest')->name('password.reset');

// User data
Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::get('/user', [UserController::class, 'show']);
    Route::put('/user', [UserController::class, 'update']);
    Route::delete('/user', [UserController::class, 'destroy']);
});

// check auth state
Route::get('/check-auth-state', IsAuthenticatedController::class);

// Document
Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::get('/document/', [DocumentController::class, 'index']);
    Route::post('/document', [DocumentController::class, 'store']);
    Route::get('/document/{id}', [DocumentController::class, 'show']);
    Route::put('/document/{id}', [DocumentController::class, 'update']);
    Route::delete('/document/{id}', [DocumentController::class, 'destroy']);
});

// Image
Route::get('/image/{id}/{name}', [ImageController::class, 'show']);
Route::post('/image', [ImageController::class, 'store'])->middleware(['throttle:image']);
Route::delete('/image/{id}', [ImageController::class, 'destroy']);

// PDF
Route::post('/html-to-pdf', PdfController::class);
