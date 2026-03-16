<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\EventController;
use App\Http\Controllers\Admin\PostController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\TagController;
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

        Route::get('event/{event}/participants', [EventController::class, 'participants'])->name('event.participants');
        Route::get('event/{event}/export', [EventController::class, 'export'])->name('event.export');
        Route::resource('event', EventController::class);
        Route::resource('posts', PostController::class);
        Route::resource('categories', CategoryController::class);
        Route::resource('tags', TagController::class);
    });
