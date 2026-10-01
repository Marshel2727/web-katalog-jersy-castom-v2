<?php

namespace App\Services;

use App\Models\Testimonial;
use Illuminate\Support\Facades\DB;

class TestimonialService
{
    public function __construct(private ImageService $images) {}

    public function create(array $data): Testimonial
    {
        return $this->images->transaction(function () use ($data) {
            return Testimonial::create($data)->refresh();
        });
    }

    public function update(Testimonial $model, array $data): Testimonial
    {
        return $this->images->transaction(function () use ($model, $data) {
            $model->update($data);

            return $model->refresh();
        });
    }

    public function delete(Testimonial $model): void
    {
        DB::transaction(function () use ($model) {
            $model->delete();
        });
    }
}
