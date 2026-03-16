<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Participant extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'registration_data',
    ];

    protected $casts = [
        'registration_data' => 'array',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}
