<?php

namespace App\Http\Requests\SiteSetting;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSiteSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user()?->is_admin;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:100'],
            'tagline' => ['sometimes', 'required', 'string', 'max:255'],
            'whatsapp' => ['sometimes', 'required', 'regex:/^[1-9][0-9]{7,14}$/'],
            'instagram_url' => ['nullable', 'url:https', 'max:512'],
            'tiktok_url' => ['nullable', 'url:https', 'max:512'],
            'logo' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:5120', 'dimensions:max_width=5000,max_height=5000'],
        ];
    }
}
