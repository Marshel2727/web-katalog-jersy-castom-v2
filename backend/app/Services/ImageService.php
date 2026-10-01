<?php

namespace App\Services;

use Closure;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use RuntimeException;
use Throwable;

class ImageService
{
    private array $uploaded = [];

    public function transaction(Closure $operation): mixed
    {
        $this->uploaded = [];
        try {
            return DB::transaction($operation);
        } catch (Throwable $exception) {
            foreach ($this->uploaded as $path) {
                Storage::disk('public')->delete($path);
            }
            throw $exception;
        } finally {
            $this->uploaded = [];
        }
    }

    public function store(UploadedFile $file, string $directory): string
    {
        $path = $file->store($directory, 'public');
        if (! $path) {
            throw new RuntimeException('Gambar tidak dapat disimpan.');
        }
        $this->uploaded[] = $path;

        return $path;
    }

    public function deleteAfterCommit(?string $path): void
    {
        // Seed assets can be shared by several records; only delete individual uploads.
        if ($path && ! str_contains($path, '..') && preg_match('#^(designs|pricing-packages|materials|collars|site)/#', $path)) {
            DB::afterCommit(fn () => Storage::disk('public')->delete($path));
        }
    }

    public function url(?string $path): ?string
    {
        return $path ? Storage::disk('public')->url($path) : null;
    }
}
