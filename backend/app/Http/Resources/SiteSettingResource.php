<?php

namespace App\Http\Resources;

use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SiteSettingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'tagline' => $this->tagline,
            'whatsapp' => $this->whatsapp,
            'logo_url' => app(ImageService::class)->url($this->logo_path),
            'instagram_url' => $this->instagram_url,
            'tiktok_url' => $this->tiktok_url,
        ];
    }
}
