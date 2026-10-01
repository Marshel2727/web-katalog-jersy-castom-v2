<?php

namespace Tests\Feature\Api;

use App\Models\Design;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class DesignTest extends ApiTestCase
{
    private function payload(array $extra = []): array
    {
        $category = $this->category();

        return [...['category_id' => $category->id, 'slug' => 'sample', 'code' => 'BP-X', 'name' => 'Sample Biru', 'description' => 'Jersey uji', 'color_label' => 'Biru', 'accent_color' => '#123456', 'is_popular' => true, 'images' => [UploadedFile::fake()->image('front.jpg'), UploadedFile::fake()->image('back.jpg')]], ...$extra];
    }

    public function test_gallery_upload_search_ordering_and_removal(): void
    {
        $this->admin();
        $response = $this->postJson('/api/admin/designs', $this->payload())->assertCreated()->assertJsonCount(2, 'data.images');
        $id = $response->json('data.id');
        $design = Design::findOrFail($id);
        $images = $design->images()->get();
        Storage::disk('public')->assertExists($images->pluck('image_path')->all());
        $this->getJson('/api/designs?q=BP-X&category=jersey&collection=popular')->assertOk()->assertJsonCount(1, 'data');
        $this->patchJson('/api/admin/designs/'.$id, ['image_order' => $images->pluck('id')->reverse()->values()->all()])->assertOk()->assertJsonPath('data.images.0.id', $images[1]->id);
        $this->patchJson('/api/admin/designs/'.$id, ['remove_image_ids' => [$images[0]->id]])->assertOk()->assertJsonCount(1, 'data.images');
        Storage::disk('public')->assertMissing($images[0]->image_path);
        $this->deleteJson('/api/admin/designs/'.$id)->assertNoContent();
        $this->assertDatabaseMissing('design_images', ['design_id' => $id]);
        Storage::disk('public')->assertMissing($images[1]->image_path);
    }

    public function test_invalid_files_and_empty_gallery_are_rejected(): void
    {
        $this->admin();
        $this->postJson('/api/admin/designs', $this->payload(['images' => [UploadedFile::fake()->create('evil.svg', 10, 'image/svg+xml')]]))->assertUnprocessable();
        $this->assertDatabaseCount('designs', 0);
    }

    public function test_rollback_keeps_existing_image_and_removes_new_upload(): void
    {
        $this->admin();
        $id = $this->postJson('/api/admin/designs', $this->payload(['images' => [UploadedFile::fake()->image('one.jpg')]]))->assertCreated()->json('data.id');
        $image = Design::findOrFail($id)->images()->first();
        $this->patchJson('/api/admin/designs/'.$id, ['remove_image_ids' => [$image->id]])->assertUnprocessable();
        Storage::disk('public')->assertExists($image->image_path);
        $this->assertDatabaseHas('design_images', ['id' => $image->id]);
        $this->patchJson('/api/admin/designs/'.$id, ['images' => [UploadedFile::fake()->image('new.jpg')], 'image_order' => [$image->id]])->assertUnprocessable();
        $this->assertCount(1, Storage::disk('public')->allFiles('designs'));
        $this->assertDatabaseCount('design_images', 1);
    }

    public function test_images_from_another_design_cannot_be_removed(): void
    {
        $this->admin();
        $first = $this->postJson('/api/admin/designs', $this->payload())->assertCreated()->json('data.id');
        $other = Design::create(['category_id' => Design::find($first)->category_id, 'slug' => 'other', 'code' => 'BP-Y', 'name' => 'Other', 'description' => 'Other', 'color_label' => 'Biru', 'accent_color' => '#123456']);
        $foreign = $other->images()->create(['image_path' => 'designs/other.jpg']);
        $this->patchJson('/api/admin/designs/'.$first, ['remove_image_ids' => [$foreign->id]])->assertUnprocessable()->assertJsonValidationErrors('remove_image_ids.0');
    }

    public function test_inactive_designs_and_categories_are_hidden_from_public(): void
    {
        $this->admin();
        $id = $this->postJson('/api/admin/designs', $this->payload())->assertCreated()->json('data.id');
        $this->patchJson('/api/admin/designs/'.$id, ['is_active' => false])->assertOk();
        $this->getJson('/api/designs/sample')->assertNotFound();
        $this->getJson('/api/designs')->assertJsonCount(0, 'data');
        $this->getJson('/api/admin/designs')->assertJsonCount(1, 'data');
        $this->patchJson('/api/admin/designs/'.$id, ['is_active' => true])->assertOk();
        Design::find($id)->category->update(['is_active' => false]);
        $this->getJson('/api/designs/sample')->assertNotFound();
        $this->getJson('/api/designs')->assertJsonCount(0, 'data');
    }
}
