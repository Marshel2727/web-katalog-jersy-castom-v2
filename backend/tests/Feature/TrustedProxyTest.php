<?php

namespace Tests\Feature;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class TrustedProxyTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        config()->set('app.trusted_proxies', ['172.30.50.2']);
        Route::get('/proxy-test', fn (Request $request) => [
            'secure' => $request->isSecure(),
            'url' => $request->url(),
            'ip' => $request->ip(),
        ]);
    }

    public function test_https_and_client_ip_are_recognized_from_the_configured_proxy(): void
    {
        $this->withServerVariables(['REMOTE_ADDR' => '172.30.50.2'])
            ->withHeaders([
                'X-Forwarded-Proto' => 'https',
                'X-Forwarded-Host' => 'api.tokokamu.com',
                'X-Forwarded-Port' => '443',
                'X-Forwarded-For' => '203.0.113.20',
            ])
            ->get('http://backend.test/proxy-test')
            ->assertOk()
            ->assertJsonPath('secure', true)
            ->assertJsonPath('url', 'https://api.tokokamu.com/proxy-test')
            ->assertJsonPath('ip', '203.0.113.20');
    }

    public function test_forwarded_headers_from_another_address_are_ignored(): void
    {
        $this->withServerVariables(['REMOTE_ADDR' => '203.0.113.30'])
            ->withHeaders([
                'X-Forwarded-Proto' => 'https',
                'X-Forwarded-Host' => 'spoofed.example',
                'X-Forwarded-For' => '203.0.113.20',
            ])
            ->get('http://backend.test/proxy-test')
            ->assertOk()
            ->assertJsonPath('secure', false)
            ->assertJsonPath('url', 'http://backend.test/proxy-test')
            ->assertJsonPath('ip', '203.0.113.30');
    }
}
