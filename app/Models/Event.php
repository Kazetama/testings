<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Event extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'image',
        'description',
        'registration_fields',
        'max_participants',
        'status',
        'is_public',
        'meta_title',
        'meta_description',
        'keywords',
    ];

    protected $casts = [
        'registration_fields' => 'array',
        'is_public'          => 'boolean',
    ];

    public function participants()
    {
        return $this->hasMany(Participant::class);
    }

    public function isFull(): bool
    {
        if (!$this->max_participants) {
            return false;
        }

        return $this->participants()->count() >= $this->max_participants;
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($event) {
            $event->slug = Str::slug($event->name) . '-' . uniqid();
        });
    }
}
