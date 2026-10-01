<?php

namespace Tests\Feature\Api;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

abstract class ApiTestCase extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
    }

    protected function admin(): User
    {
        $admin = User::factory()->admin()->create();
        $this->actingAs($admin, 'web');

        return $admin;
    }

    protected function category(array $values = []): Category
    {
        return Category::create([...['name' => 'Jersey', 'slug' => 'jersey'], ...$values])->refresh();
    }
}
