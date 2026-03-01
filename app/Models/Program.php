<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
class Program extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'image',
        'description',
        'meta_title',
        'meta_description',
        'keywords',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($program) {
            $program->slug = Str::slug($program->name);
        });
    }
}
