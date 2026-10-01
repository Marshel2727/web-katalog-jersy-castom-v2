<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DesignResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'category_id' => $this->category_id,
            'slug' => $this->slug,
            'code' => $this->code,
            'name' => $this->name,
            'description' => $this->description,
            'color_label' => $this->color_label,
            'accent_color' => $this->accent_color,
            'is_popular' => $this->is_popular,
            'is_previous_order' => $this->is_previous_order,
            'is_active' => $this->is_active,
            'sort_order' => $this->sort_order,
            'category' => CategoryResource::make($this->whenLoaded('category')),
            'images' => DesignImageResource::collection($this->whenLoaded('images')),
        ];
    }
}
