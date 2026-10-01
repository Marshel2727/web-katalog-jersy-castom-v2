<?php

namespace App\Http\Requests\Design;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDesignRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user()?->is_admin;
    }

    public function rules(): array
    {
        return [
            'category_id' => ['required', 'integer', Rule::exists('categories', 'id')],
            'slug' => ['required', 'string', 'max:180', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/', Rule::unique('designs', 'slug')->ignore($this->route('design'))],
            'code' => ['required', 'string', 'max:50', Rule::unique('designs', 'code')->ignore($this->route('design'))],
            'name' => ['required', 'string', 'max:150'],
            'description' => ['required', 'string', 'max:10000'],
            'color_label' => ['required', 'string', 'max:120'],
            'accent_color' => ['required', 'regex:/^#[0-9a-fA-F]{6}$/'],
            'is_popular' => ['sometimes', 'boolean'],
            'is_previous_order' => ['sometimes', 'boolean'],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer', 'min:0', 'max:100000'],
            'images' => ['required', 'array', 'min:1', 'max:12'],
            'images.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:5120', 'dimensions:max_width=5000,max_height=5000'],
        ];
    }
}
