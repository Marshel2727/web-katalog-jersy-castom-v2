<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\SiteSetting;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DatabaseSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_seeding_does_not_insert_default_content_or_accounts(): void
    {
        $this->seed(DatabaseSeeder::class);

        foreach (['categories', 'designs', 'design_images', 'pricing_packages', 'pricing_options', 'materials', 'collars', 'testimonials', 'site_settings', 'users'] as $table) {
            $this->assertDatabaseCount($table, 0);
        }

        $this->getJson('/api/designs')->assertOk()->assertJsonCount(0, 'data');
        $this->getJson('/api/site-settings')->assertNotFound();
    }

    public function test_repeated_seeding_preserves_admin_content_and_does_not_restore_deleted_categories(): void
    {
        $category = Category::create(['name' => 'Kategori milik admin', 'slug' => 'kategori-admin']);
        SiteSetting::create(['id' => 1, 'name' => 'Toko admin', 'tagline' => 'Tagline admin', 'whatsapp' => '6281234567890']);

        $this->seed(DatabaseSeeder::class);
        $this->seed(DatabaseSeeder::class);
        $this->assertDatabaseCount('categories', 1);
        $this->assertSame('Kategori milik admin', $category->fresh()->name);
        $this->assertSame('Tagline admin', SiteSetting::findOrFail(1)->tagline);

        $category->delete();
        $this->seed(DatabaseSeeder::class);
        $this->assertDatabaseCount('categories', 0);
    }
}
