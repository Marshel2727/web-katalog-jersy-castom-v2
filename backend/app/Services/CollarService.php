<?php

namespace App\Services;

use App\Models\Collar;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class CollarService
{
    public function __construct(private ImageService $images) {}

    public function create(array $data): Collar
    {
        return $this->images->transaction(function () use ($data) {
            $file = Arr::pull($data, 'image');
            if ($file) {
                $data['image_path'] = $this->images->store($file, 'collars');
            }

return Collar::create($data)->refresh();
        });
    }

    public function update(Collar $model, array $data): Collar
    {
        return $this->images->transaction(function () use ($model, $data) {
            $file = Arr::pull($data, 'image');
            if ($file) {
                $data['image_path'] = $this->images->store($file, 'collars');
                $this->images->deleteAfterCommit($model->image_path);
            } $model->update($data);

            return $model->refresh();
        });
    }

    public function delete(Collar $model): void
    {
        DB::transaction(function () use ($model) {
            $this->images->deleteAfterCommit($model->image_path);
            $model->delete();
        });
    }
}
