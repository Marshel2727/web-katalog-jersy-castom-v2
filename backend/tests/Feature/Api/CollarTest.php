<?php

namespace Tests\Feature\Api;

use Illuminate\Http\UploadedFile;

class CollarTest extends ApiTestCase
{
    public function test_collar_number_is_unique_and_admin_can_manage_visibility(): void
    {
        $this->admin();
        $payload = ['slug' => 'collar-1', 'number' => 1, 'name' => 'Kerah V', 'price_label' => '+ Rp 5.000', 'image' => UploadedFile::fake()->image('collar.jpg')];
        $id = $this->postJson('/api/admin/collars', $payload)->assertCreated()->assertJsonPath('data.number', 1)->json('data.id');
        $this->postJson('/api/admin/collars', [...$payload, 'slug' => 'collar-2'])->assertUnprocessable()->assertJsonValidationErrors('number');
        $this->patchJson('/api/admin/collars/'.$id, ['name' => 'Kerah V Baru'])->assertOk();
        $this->getJson('/api/collars/collar-1')->assertOk()->assertJsonPath('data.name', 'Kerah V Baru');
        $this->patchJson('/api/admin/collars/'.$id, ['is_active' => false])->assertOk();
        $this->getJson('/api/collars')->assertOk()->assertJsonCount(0, 'data');
        $this->deleteJson('/api/admin/collars/'.$id)->assertNoContent();
        $this->assertDatabaseCount('collars', 0);
    }
}
