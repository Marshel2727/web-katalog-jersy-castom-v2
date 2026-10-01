<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['slug', 'number', 'name', 'image_path', 'alt_text', 'price_label', 'source_image_path', 'is_active', 'sort_order'])]
class Collar extends Model
{
    protected function casts(): array
    {
        return ['is_active' => 'boolean', 'sort_order' => 'integer', 'number' => 'integer'];
    }
}
