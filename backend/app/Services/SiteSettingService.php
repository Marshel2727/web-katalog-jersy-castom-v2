<?php

namespace App\Services;

use App\Models\SiteSetting;
use Illuminate\Support\Arr;
use Illuminate\Validation\ValidationException;

class SiteSettingService
{
    public function __construct(private ImageService $images) {}

    public function update(array $data): SiteSetting
    {
        return $this->images->transaction(function () use ($data) {
            $settings = SiteSetting::query()->lockForUpdate()->find(1) ?? new SiteSetting;
            if (! $settings->exists) {
                $errors = [];
                foreach (['name', 'tagline', 'whatsapp'] as $field) {
                    if (empty($data[$field])) {
                        $errors[$field] = 'Wajib diisi untuk pengaturan toko pertama.';
                    }
                }
                if ($errors) {
                    throw ValidationException::withMessages($errors);
                }
                $settings->id = 1;
            }
            $logo = Arr::pull($data, 'logo');
            if ($logo) {
                $data['logo_path'] = $this->images->store($logo, 'site');
                $this->images->deleteAfterCommit($settings->logo_path);
            }
            $settings->fill($data)->save();

            return $settings->refresh();
        });
    }
}
