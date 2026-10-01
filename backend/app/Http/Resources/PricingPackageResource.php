<?php

namespace App\Http\Resources;

use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PricingPackageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'group' => $this->group,
            'name' => $this->name,
            'description' => $this->description,
            'condition' => $this->condition,
            'image_url' => app(ImageService::class)->url($this->image_path),
            'is_active' => $this->is_active,
            'sort_order' => $this->sort_order,
            'options' => PricingOptionResource::collection($this->whenLoaded('options')),
        ];
    }
}
