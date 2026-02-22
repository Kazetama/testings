<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\{Exceptions, Middleware};
use App\Http\Middleware\{HandleAppearance, HandleInertiaRequests};
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {

        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'superadmin'        => \App\Http\Middleware\SuperadminMiddleware::class,
            'admin'             => \App\Http\Middleware\AdminMiddleware::class,
            'ketua'             => \App\Http\Middleware\KetuaMiddleware::class,
            'user'              => \App\Http\Middleware\UserMiddleware::class,
            'redirect.usertype' => \App\Http\Middleware\RedirectUsertype::class,
        ]);
    })
    ->withExceptions(fn (Exceptions $exceptions) => null)
    ->create();
