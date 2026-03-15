<?php

namespace App\Http\Requests\Ketua;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MemberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $member = $this->route('member');

        return [
            'full_name' => 'required|string|max:255',
            'nim' => [
                'required',
                'string',
                Rule::unique('members', 'nim')->ignore($member?->id),
            ],
            'phone' => 'required|string|max:20',
            'batch' => 'required|integer',
            'position' => 'required|string|max:100',
            'status' => ['required', Rule::in(['aktif', 'nonaktif', 'trial', 'demision'])],
        ];
    }
}
