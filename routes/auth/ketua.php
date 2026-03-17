<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Ketua\MemberController;
use Inertia\Inertia;

Route::middleware(['auth', 'redirect.usertype', 'ketua'])
    ->prefix('ketua')
    ->name('ketua.')
    ->group(function (): void {
        Route::get('/dashboard', fn () =>
            Inertia::render('ketua/dashboard')
        )->name('dashboard');

        // Resource route untuk CRUD members
        Route::get('/members/export', [MemberController::class, 'export'])->name('members.export');
        Route::post('/members/import', [MemberController::class, 'import'])->name('members.import');
        Route::resource('/members', MemberController::class);
    });
