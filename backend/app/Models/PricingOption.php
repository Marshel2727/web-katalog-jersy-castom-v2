<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['pricing_package_id', 'label', 'price', 'unit', 'sort_order'])]
class PricingOption extends Model
{
    protected function casts(): array
    {
        return ['price' => 'decimal:2', 'sort_order' => 'integer'];
    }

    public function pricingPackage(): BelongsTo
    {
        return $this->belongsTo(PricingPackage::class);
    }
}
