<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\ProgramController;
use Inertia\Inertia;

Route::middleware(['auth', 'redirect.usertype', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get(
            '/dashboard',
            fn() =>
            Inertia::render('admin/dashboard')
        )->name('dashboard');

        Route::resource('/program', ProgramController::class);
    });
