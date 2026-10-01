<?php

namespace App\Services;

use App\Models\Category;
use Illuminate\Support\Facades\DB;

class CategoryService
{
    public function __construct(private ImageService $images) {}

    public function create(array $data): Category
    {
        return $this->images->transaction(function () use ($data) {
            return Category::create($data)->refresh();
        });
    }

    public function update(Category $model, array $data): Category
    {
        return $this->images->transaction(function () use ($model, $data) {
            $model->update($data);

            return $model->refresh();
        });
    }

    public function delete(Category $model): void
    {
        DB::transaction(function () use ($model) {
            abort_if($model->designs()->exists(), 409, 'Kategori masih dipakai oleh desain.');
            $model->delete();
        });
    }
}
