<?php

namespace Tests\Feature\Api;

use App\Models\SiteSetting;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class SiteSettingTest extends ApiTestCase
{
    public function test_first_configuration_requires_identity_then_supports_partial_updates(): void
    {
        $this->admin();
        $this->getJson('/api/site-settings')->assertNotFound();
        $this->patchJson('/api/admin/site-settings', ['name' => 'BP Sport'])->assertUnprocessable()->assertJsonValidationErrors(['tagline', 'whatsapp']);
        $this->patchJson('/api/admin/site-settings', [
            'name' => 'BP Sport', 'tagline' => 'Jersey custom', 'whatsapp' => '6281234567890',
            'logo' => UploadedFile::fake()->image('logo.png'),
        ])->assertCreated();
        $old = SiteSetting::findOrFail(1)->logo_path;
        $this->patchJson('/api/admin/site-settings', ['whatsapp' => '081234'])->assertUnprocessable();
        $this->patchJson('/api/admin/site-settings', ['instagram_url' => 'javascript:alert(1)'])->assertUnprocessable();
        $this->patchJson('/api/admin/site-settings', [
            'logo' => UploadedFile::fake()->image('new.png'),
            'instagram_url' => 'https://www.instagram.com/example/',
        ])->assertOk()->assertJsonPath('data.name', 'BP Sport');
        Storage::disk('public')->assertMissing($old);
        Storage::disk('public')->assertExists(SiteSetting::find(1)->logo_path);
        $this->assertDatabaseCount('site_settings', 1);
        $this->getJson('/api/site-settings')->assertOk()->assertJsonPath('data.whatsapp', '6281234567890');
    }

    public function test_guests_cannot_change_site_identity(): void
    {
        $this->patchJson('/api/admin/site-settings', ['name' => 'Wrong'])->assertUnauthorized();
        $this->assertDatabaseCount('site_settings', 0);
    }
}
