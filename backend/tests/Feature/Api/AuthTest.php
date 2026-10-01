<?php

namespace Tests\Feature\Api;

use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AuthTest extends ApiTestCase
{
    public function test_admin_can_login_access_identity_and_logout(): void
    {
        $admin = User::factory()->admin()->create(['password' => 'long-test-password']);
        $login = $this->postJson('/api/auth/login', ['email' => $admin->email, 'password' => 'long-test-password'])
            ->assertOk()->assertJsonPath('data.is_admin', true)->assertJsonMissingPath('data.password');
        $this->withUnencryptedCookie(config('session.cookie'), $login->getCookie(config('session.cookie'), false)->getValue());
        Auth::forgetGuards();
        $this->withHeader('Origin', 'http://localhost:3000')->getJson('/api/auth/me')->assertOk()->assertJsonPath('data.id', $admin->id);
        $this->getJson('/api/admin/categories')->assertOk();
        $this->postJson('/api/auth/logout')->assertNoContent();
        Auth::forgetGuards();
        $this->getJson('/api/auth/me')->assertUnauthorized();
        $this->getJson('/api/admin/categories')->assertUnauthorized();
    }

    public function test_wrong_password_and_non_admin_credentials_are_rejected(): void
    {
        $user = User::factory()->create(['password' => 'long-test-password']);
        $this->postJson('/api/auth/login', ['email' => $user->email, 'password' => 'long-test-password'])->assertUnprocessable();
        $admin = User::factory()->admin()->create();
        $this->postJson('/api/auth/login', ['email' => $admin->email, 'password' => 'wrong'])->assertUnprocessable();
        $this->getJson('/api/admin/categories')->assertUnauthorized();
    }

    public function test_login_attempts_are_rate_limited(): void
    {
        for ($attempt = 0; $attempt < 5; $attempt++) {
            $this->postJson('/api/auth/login', ['email' => 'limited@example.test', 'password' => 'wrong'])->assertUnprocessable();
        }
        $this->postJson('/api/auth/login', ['email' => 'limited@example.test', 'password' => 'wrong'])->assertStatus(429);
    }

    public function test_csrf_is_required_outside_the_testing_bypass(): void
    {
        $this->app['env'] = 'local';
        $this->postJson('/api/auth/login', ['email' => 'csrf@example.test', 'password' => 'wrong'])->assertStatus(419);
        $cookies = $this->get('/sanctum/csrf-cookie')->assertNoContent()->assertCookie('XSRF-TOKEN');
        $this->withUnencryptedCookie(config('session.cookie'), $cookies->getCookie(config('session.cookie'), false)->getValue())
            ->withHeader('X-XSRF-TOKEN', $cookies->getCookie('XSRF-TOKEN', false)->getValue())
            ->postJson('/api/auth/login', ['email' => 'csrf@example.test', 'password' => 'wrong'])->assertUnprocessable();
    }

    public function test_cors_accepts_the_configured_frontend_only(): void
    {
        $this->withHeader('Origin', 'http://localhost:3000')->getJson('/api/categories')
            ->assertOk()->assertHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
            ->assertHeader('Access-Control-Allow-Credentials', 'true');
        $this->withHeader('Origin', 'https://unrelated.example')->getJson('/api/categories')
            ->assertOk()->assertHeaderMissing('Access-Control-Allow-Origin');
    }
}
