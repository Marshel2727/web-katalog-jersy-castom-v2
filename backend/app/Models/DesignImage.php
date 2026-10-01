<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['design_id', 'image_path', 'alt_text', 'sort_order'])]
class DesignImage extends Model
{
    protected function casts(): array
    {
        return ['sort_order' => 'integer'];
    }

    public function design(): BelongsTo
    {
        return $this->belongsTo(Design::class);
    }
}
