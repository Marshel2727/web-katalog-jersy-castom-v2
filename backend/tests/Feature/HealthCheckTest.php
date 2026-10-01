<?php

namespace Tests\Feature;

use Tests\TestCase;

class HealthCheckTest extends TestCase
{
    public function test_application_can_boot(): void
    {
        $this->get('/up')->assertOk();
    }
}
