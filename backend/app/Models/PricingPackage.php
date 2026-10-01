<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['slug', 'group', 'name', 'description', 'condition', 'image_path', 'is_active', 'sort_order'])]
class PricingPackage extends Model
{
    protected function casts(): array
    {
        return ['is_active' => 'boolean', 'sort_order' => 'integer'];
    }

    public function options(): HasMany
    {
        return $this->hasMany(PricingOption::class)->orderBy('sort_order')->orderBy('id');
    }
}
