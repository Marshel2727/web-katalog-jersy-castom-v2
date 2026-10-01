<?php

namespace App\Http\Resources;

use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MaterialResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'image_url' => app(ImageService::class)->url($this->image_path),
            'alt_text' => $this->alt_text,
            'price_label' => $this->price_label,
            'source_image_url' => app(ImageService::class)->url($this->source_image_path),
            'is_active' => $this->is_active,
            'sort_order' => $this->sort_order,
        ];
    }
}
