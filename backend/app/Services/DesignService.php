<?php

namespace App\Services;

use App\Models\Design;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class DesignService
{
    public function __construct(private ImageService $images) {}

    public function create(array $data): Design
    {
        return $this->images->transaction(function () use ($data) {
            $uploads = Arr::pull($data, 'images', []);
            $design = Design::create($data);
            $this->addImages($design, $uploads);

            return $design->refresh()->load(['category', 'images']);
        });
    }

    public function update(Design $model, array $data): Design
    {
        return $this->images->transaction(function () use ($model, $data) {
            // Serialize concurrent gallery changes for the same design.
            $model = Design::query()->lockForUpdate()->findOrFail($model->id);
            $uploads = Arr::pull($data, 'images', []);
            $remove = Arr::pull($data, 'remove_image_ids', []);
            $order = Arr::pull($data, 'image_order');
            $model->update($data);
            foreach ($model->images()->whereIn('id', $remove)->get() as $image) {
                $image->delete();
                $this->images->deleteAfterCommit($image->image_path);
            }
            $this->addImages($model, $uploads);
            if ($model->images()->count() < 1 || $model->images()->count() > 12) {
                throw ValidationException::withMessages(['images' => 'Desain harus memiliki 1 sampai 12 gambar.']);
            }
            if ($order !== null) {
                $actual = $model->images()->pluck('id')->sort()->values()->all();
                $provided = collect($order)->map(fn ($id) => (int) $id)->sort()->values()->all();
                if ($actual !== $provided) {
                    throw ValidationException::withMessages(['image_order' => 'Urutan harus memuat seluruh ID gambar desain yang tersisa.']);
                }
                foreach ($order as $position => $id) {
                    $model->images()->whereKey($id)->update(['sort_order' => $position]);
                }
            }

            return $model->refresh()->load(['category', 'images']);
        });
    }

    private function addImages(Design $design, array $uploads): void
    {
        $position = (int) $design->images()->max('sort_order') + ($design->images()->exists() ? 1 : 0);
        foreach ($uploads as $file) {
            $design->images()->create([
                'image_path' => $this->images->store($file, 'designs'),
                'alt_text' => $design->name,
                'sort_order' => $position++,
            ]);
        }
    }

    public function delete(Design $model): void
    {
        DB::transaction(function () use ($model) {
            foreach ($model->images as $image) {
                $this->images->deleteAfterCommit($image->image_path);
            }
            $model->delete();
        });
    }
}
