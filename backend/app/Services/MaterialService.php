<?php

namespace App\Services;

use App\Models\Material;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class MaterialService
{
    public function __construct(private ImageService $images) {}

    public function create(array $data): Material
    {
        return $this->images->transaction(function () use ($data) {
            $file = Arr::pull($data, 'image');
            if ($file) {
                $data['image_path'] = $this->images->store($file, 'materials');
            }

return Material::create($data)->refresh();
        });
    }

    public function update(Material $model, array $data): Material
    {
        return $this->images->transaction(function () use ($model, $data) {
            $file = Arr::pull($data, 'image');
            if ($file) {
                $data['image_path'] = $this->images->store($file, 'materials');
                $this->images->deleteAfterCommit($model->image_path);
            } $model->update($data);

            return $model->refresh();
        });
    }

    public function delete(Material $model): void
    {
        DB::transaction(function () use ($model) {
            $this->images->deleteAfterCommit($model->image_path);
            $model->delete();
        });
    }
}
