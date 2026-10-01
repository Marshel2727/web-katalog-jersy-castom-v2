<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TestimonialResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'team' => $this->team,
            'quote' => $this->quote,
            'initials' => $this->initials,
            'is_example' => $this->is_example,
            'is_active' => $this->is_active,
            'sort_order' => $this->sort_order,
        ];
    }
}
