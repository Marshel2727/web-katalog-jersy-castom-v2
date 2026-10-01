<?php

namespace Tests\Feature\Api;

use App\Models\PricingPackage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class PricingPackageTest extends ApiTestCase
{
    private function payload(string $slug): array
    {
        return ['slug' => $slug, 'group' => 'printing', 'name' => 'Paket', 'description' => 'Print', 'condition' => 'Minimal 6 pcs', 'image' => UploadedFile::fake()->image('package.jpg'), 'options' => [['label' => 'Atasan', 'price' => 100000, 'unit' => 'atasan'], ['label' => 'Setelan', 'price' => 125000, 'unit' => 'setel']]];
    }

    public function test_admin_can_sync_prices_without_losing_other_packages(): void
    {
        $this->admin();
        $id = $this->postJson('/api/admin/pricing-packages', $this->payload('print'))->assertCreated()->assertJsonPath('data.options.0.price', '100000.00')->json('data.id');
        $option = PricingPackage::find($id)->options()->first();
        $this->patchJson('/api/admin/pricing-packages/'.$id, ['options' => [['id' => $option->id, 'label' => 'Atasan Baru', 'price' => 110000.50, 'unit' => 'atasan']]])->assertOk()->assertJsonCount(1, 'data.options')->assertJsonPath('data.options.0.price', '110000.50');
        $this->getJson('/api/pricing-packages?group=printing')->assertOk()->assertJsonCount(1, 'data');
        $this->deleteJson('/api/admin/pricing-packages/'.$id)->assertNoContent();
        $this->assertDatabaseCount('pricing_options', 0);
    }

    public function test_negative_prices_and_foreign_option_ids_are_rejected(): void
    {
        $this->admin();
        $one = $this->postJson('/api/admin/pricing-packages', $this->payload('one'))->json('data.id');
        $two = $this->postJson('/api/admin/pricing-packages', $this->payload('two'))->json('data.id');
        $foreign = PricingPackage::find($two)->options()->first()->id;
        $this->patchJson('/api/admin/pricing-packages/'.$one, ['options' => [['id' => $foreign, 'label' => 'Wrong', 'price' => 10, 'unit' => 'atasan']]])->assertUnprocessable()->assertJsonValidationErrors('options.0.id');
        $this->patchJson('/api/admin/pricing-packages/'.$one, ['options' => [['label' => 'Wrong', 'price' => -1, 'unit' => 'atasan']]])->assertUnprocessable()->assertJsonValidationErrors('options.0.price');
        $this->assertDatabaseCount('pricing_options', 4);
    }

    public function test_shared_seed_image_is_kept_when_one_package_is_deleted(): void
    {
        $this->admin();
        $shared = 'seed/images/paket-harga/setelan-sablon.webp';
        Storage::disk('public')->put($shared, 'shared seed asset');
        $values = ['group' => 'screen_print', 'name' => 'Sablon', 'description' => 'Paket sablon', 'condition' => 'Minimal 6 pcs', 'image_path' => $shared];
        $one = PricingPackage::create([...$values, 'slug' => 'sablon-one']);
        $two = PricingPackage::create([...$values, 'slug' => 'sablon-two']);
        $this->deleteJson('/api/admin/pricing-packages/'.$one->id)->assertNoContent();
        Storage::disk('public')->assertExists($shared);
        $this->getJson('/api/pricing-packages/'.$two->slug)->assertOk()->assertJsonPath('data.image_url', Storage::disk('public')->url($shared));
    }
}
