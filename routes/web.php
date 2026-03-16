<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\BlogController;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('/blog', [BlogController::class, 'index']);
Route::get('/blog/{slug}', [BlogController::class, 'show']);

Route::get('/event', [App\Http\Controllers\PublicEventController::class, 'index'])->name('event.index');
Route::get('/event/{slug}', [App\Http\Controllers\PublicEventController::class, 'show'])->name('event.show');
Route::post('/event/{slug}/register', [App\Http\Controllers\PublicEventController::class, 'register'])->name('event.register');

Route::middleware(['auth', 'verified', 'user'])
    ->get('/dashboard', fn () => Inertia::render('dashboard'))
    ->name('dashboard');

require __DIR__.'/settings.php';
require __DIR__.'/auth/superadmin.php';
require __DIR__.'/auth/admin.php';
require __DIR__.'/auth/ketua.php';
