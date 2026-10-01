<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['category_id', 'slug', 'code', 'name', 'description', 'color_label', 'accent_color', 'is_popular', 'is_previous_order', 'is_active', 'sort_order'])]
class Design extends Model
{
    protected function casts(): array
    {
        return ['is_popular' => 'boolean', 'is_previous_order' => 'boolean', 'is_active' => 'boolean', 'sort_order' => 'integer'];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(DesignImage::class)->orderBy('sort_order')->orderBy('id');
    }

    public function scopePublished(Builder $query): void
    {
        $query->where('is_active', true)->whereHas('category', fn (Builder $category) => $category->where('is_active', true));
    }
}
