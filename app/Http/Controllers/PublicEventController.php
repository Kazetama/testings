<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Participant;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class PublicEventController extends Controller
{
    public function index()
    {
        return Inertia::render('Event/Index', [
            'events' => Event::where('is_public', true)
                ->where('status', 'open')
                ->latest()
                ->paginate(12)
        ]);
    }

    public function show(string $slug)
    {
        $event = Event::where('slug', $slug)
            ->where('is_public', true)
            ->firstOrFail();

        return Inertia::render('Event/Show', [
            'event' => $event
        ]);
    }

    public function register(Request $request, string $slug)
    {
        $event = Event::where('slug', $slug)
            ->where('status', 'open')
            ->firstOrFail();

        $formFields = $event->registration_fields ?? [];
        $rules = [];
        $messages = [];

        foreach ($formFields as $field) {
            $fieldName = Str::slug($field['name'], '_');
            $fieldRules = [];

            if ($field['required']) {
                $fieldRules[] = 'required';
            } else {
                $fieldRules[] = 'nullable';
            }

            switch ($field['type']) {
                case 'email':
                    $fieldRules[] = 'email';
                    break;
                case 'number':
                    $fieldRules[] = 'numeric';
                    break;
            }

            $rules[$fieldName] = $fieldRules;
            $messages["{$fieldName}.required"] = "Field {$field['name']} wajib diisi.";
        }

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        Participant::create([
            'event_id' => $event->id,
            'registration_data' => $request->only(array_keys($rules))
        ]);

        return back()->with('success', 'Pendaftaran berhasil! Terimakasih telah mendaftar.');
    }
}
