<?php

namespace App\Http\Requests\Collar;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCollarRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user()?->is_admin;
    }

    public function rules(): array
    {
        return [
            'slug' => ['sometimes', 'required', 'string', 'max:120', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/', Rule::unique('collars', 'slug')->ignore($this->route('collar'))],
            'number' => ['sometimes', 'required', 'integer', 'min:1', 'max:999', Rule::unique('collars', 'number')->ignore($this->route('collar'))],
            'name' => ['sometimes', 'required', 'string', 'max:100'],
            'alt_text' => ['nullable', 'string', 'max:255'],
            'price_label' => ['sometimes', 'required', 'string', 'max:50'],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer', 'min:0', 'max:100000'],
            'image' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:5120', 'dimensions:max_width=5000,max_height=5000'],
        ];
    }
}
