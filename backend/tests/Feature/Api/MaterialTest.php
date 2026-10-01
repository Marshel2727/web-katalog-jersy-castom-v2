<?php

namespace Tests\Feature\Api;

use App\Models\Material;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class MaterialTest extends ApiTestCase
{
    public function test_material_image_replacement_and_price_label_are_preserved(): void
    {
        $this->admin();
        $id = $this->postJson('/api/admin/materials', [
            'slug' => 'drifit', 'name' => 'Drifit', 'price_label' => 'Harga by WA',
            'image' => UploadedFile::fake()->image('material.jpg'),
        ])->assertCreated()->assertJsonPath('data.price_label', 'Harga by WA')->json('data.id');
        $old = Material::findOrFail($id)->image_path;
        $this->patchJson('/api/admin/materials/'.$id, [
            'image' => UploadedFile::fake()->image('replacement.png'),
        ])->assertOk()->assertJsonPath('data.price_label', 'Harga by WA');
        $new = Material::findOrFail($id)->image_path;
        Storage::disk('public')->assertMissing($old);
        Storage::disk('public')->assertExists($new);
        $this->getJson('/api/materials/drifit')->assertOk();
        $this->patchJson('/api/admin/materials/'.$id, ['is_active' => false])->assertOk();
        $this->getJson('/api/materials/drifit')->assertNotFound();
        $this->deleteJson('/api/admin/materials/'.$id)->assertNoContent();
        Storage::disk('public')->assertMissing($new);
    }

    public function test_missing_image_and_svg_upload_are_rejected(): void
    {
        $this->admin();
        $payload = ['slug' => 'drifit', 'name' => 'Drifit', 'price_label' => 'Harga by WA'];
        $this->postJson('/api/admin/materials', $payload)->assertUnprocessable()->assertJsonValidationErrors('image');
        $this->postJson('/api/admin/materials', [...$payload, 'image' => UploadedFile::fake()->create('script.svg', 10, 'image/svg+xml')])->assertUnprocessable();
        $this->assertDatabaseCount('materials', 0);
    }
}
