<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Auth\SignupController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::post('/auth/login', LoginController::class)->name('login');
Route::post('/auth/logout', LogoutController::class)->name('logout');
Route::post('/auth/signup', SignupController::class)->name('signup');
