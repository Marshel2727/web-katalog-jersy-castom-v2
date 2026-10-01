<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name', 'team', 'quote', 'initials', 'is_example', 'is_active', 'sort_order'])]
class Testimonial extends Model
{
    protected function casts(): array
    {
        return ['is_example' => 'boolean', 'is_active' => 'boolean', 'sort_order' => 'integer'];
    }
}
