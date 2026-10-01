<?php

namespace Tests\Feature\Api;

use App\Models\Design;
use App\Models\User;

class CategoryTest extends ApiTestCase
{
    public function test_public_read_and_write_permissions(): void
    {
        $category = $this->category();
        $this->category(['slug' => 'hidden', 'is_active' => false]);
        $this->getJson('/api/categories')->assertOk()->assertJsonCount(1, 'data');
        $this->getJson('/api/categories/hidden')->assertNotFound();
        $this->postJson('/api/admin/categories', ['name' => 'Basket', 'slug' => 'basket'])->assertUnauthorized();
        $this->actingAs(User::factory()->create(), 'web');
        $this->patchJson('/api/admin/categories/'.$category->id, ['name' => 'Changed'])->assertForbidden();
    }

    public function test_admin_can_manage_categories_and_duplicates_are_rejected(): void
    {
        $this->admin();
        $id = $this->postJson('/api/admin/categories', ['name' => 'Basket', 'slug' => 'basket'])->assertCreated()->json('data.id');
        $this->postJson('/api/admin/categories', ['name' => 'Basket', 'slug' => 'basket'])->assertUnprocessable()->assertJsonValidationErrors('slug');
        $this->patchJson('/api/admin/categories/'.$id, ['name' => 'Basket Baru'])->assertOk()->assertJsonPath('data.name', 'Basket Baru');
        $this->deleteJson('/api/admin/categories/'.$id)->assertNoContent();
        $this->assertDatabaseMissing('categories', ['id' => $id]);
    }

    public function test_category_in_use_cannot_be_deleted(): void
    {
        $this->admin();
        $category = $this->category();
        Design::create(['category_id' => $category->id, 'slug' => 'sample', 'code' => 'BP-X', 'name' => 'Sample', 'description' => 'Sample', 'color_label' => 'Biru', 'accent_color' => '#123456']);
        $this->deleteJson('/api/admin/categories/'.$category->id)->assertStatus(409);
        $this->assertDatabaseHas('categories', ['id' => $category->id]);
    }
}
