<?php

namespace App\Http\Requests\PricingPackage;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePricingPackageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user()?->is_admin;
    }

    public function rules(): array
    {
        return [
            'slug' => ['required', 'string', 'max:120', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/', Rule::unique('pricing_packages', 'slug')->ignore($this->route('pricingPackage'))],
            'group' => ['required', Rule::in(['printing', 'screen_print'])],
            'name' => ['required', 'string', 'max:150'],
            'description' => ['required', 'string', 'max:5000'],
            'condition' => ['required', 'string', 'max:5000'],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['sometimes', 'integer', 'min:0', 'max:100000'],
            'image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120', 'dimensions:max_width=5000,max_height=5000'],
            'options' => ['required', 'array', 'min:1', 'max:20'],
            'options.*' => ['required', 'array:id,label,price,unit,sort_order'],
            'options.*.label' => ['required', 'string', 'max:150'],
            'options.*.price' => ['required', 'numeric', 'decimal:0,2', 'min:0', 'max:9999999999.99'],
            'options.*.unit' => ['required', Rule::in(['atasan', 'setel'])],
            'options.*.sort_order' => ['sometimes', 'integer', 'min:0', 'max:100000'],
            'options.*.id' => ['prohibited'],
        ];
    }
}
