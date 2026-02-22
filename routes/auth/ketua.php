<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'redirect.usertype', 'ketua'])
    ->prefix('ketua')
    ->name('ketua.')
    ->group(function () {
        Route::get('/dashboard', fn () =>
            Inertia::render('ketua/dashboard')
        )->name('dashboard');
    });
