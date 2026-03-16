<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $eventId = $this->route('event');

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('events', 'name')->ignore($eventId)
            ],
            'description' => 'required|string',
            'image' => $this->isMethod('post')
                ? 'required|image|mimes:jpg,jpeg,png,webp|max:2048'
                : 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'registration_fields' => 'nullable|array',
            'registration_fields.*.name' => 'required|string',
            'registration_fields.*.type' => 'required|string|in:text,number,email,textarea,select,radio,checkbox',
            'registration_fields.*.required' => 'required|boolean',
            'registration_fields.*.options' => 'nullable|string', // comma separated for select/radio/checkbox
            'max_participants' => 'nullable|integer|min:1',
            'status' => 'required|in:open,closed,coming_soon',
            'is_public' => 'required|boolean',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'keywords' => 'nullable|string',
        ];
    }
}
