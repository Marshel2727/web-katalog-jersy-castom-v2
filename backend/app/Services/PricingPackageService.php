<?php

namespace App\Services;

use App\Models\PricingPackage;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class PricingPackageService
{
    public function __construct(private ImageService $images) {}

    public function create(array $data): PricingPackage
    {
        return $this->images->transaction(function () use ($data) {
            $options = Arr::pull($data, 'options');
            $file = Arr::pull($data, 'image');
            if ($file) {
                $data['image_path'] = $this->images->store($file, 'pricing-packages');
            }
            $package = PricingPackage::create($data);
            $this->syncOptions($package, $options);

            return $package->refresh()->load('options');
        });
    }

    public function update(PricingPackage $model, array $data): PricingPackage
    {
        return $this->images->transaction(function () use ($model, $data) {
            $model = PricingPackage::query()->lockForUpdate()->findOrFail($model->id);
            $options = Arr::pull($data, 'options');
            $file = Arr::pull($data, 'image');
            if ($file) {
                $data['image_path'] = $this->images->store($file, 'pricing-packages');
                $this->images->deleteAfterCommit($model->image_path);
            }
            $model->update($data);
            if ($options !== null) {
                $this->syncOptions($model, $options);
            }

            return $model->refresh()->load('options');
        });
    }

    private function syncOptions(PricingPackage $package, array $options): void
    {
        $kept = [];
        foreach ($options as $position => $data) {
            $id = Arr::pull($data, 'id');
            $data['sort_order'] ??= $position;
            $option = $id ? $package->options()->findOrFail($id) : $package->options()->make();
            $option->fill($data)->save();
            $kept[] = $option->id;
        }
        $package->options()->whereNotIn('id', $kept)->delete();
    }

    public function delete(PricingPackage $model): void
    {
        DB::transaction(function () use ($model) {
            $this->images->deleteAfterCommit($model->image_path);
            $model->delete();
        });
    }
}
