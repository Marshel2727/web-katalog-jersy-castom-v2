<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PricingOptionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'pricing_package_id' => $this->pricing_package_id,
            'label' => $this->label,
            'price' => $this->price,
            'unit' => $this->unit,
            'sort_order' => $this->sort_order,
        ];
    }
}
