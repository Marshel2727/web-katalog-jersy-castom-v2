<?php

namespace Tests\Feature\Api;

class TestimonialTest extends ApiTestCase
{
    public function test_example_marker_and_visibility_are_exposed_without_losing_content(): void
    {
        $this->admin();
        $id = $this->postJson('/api/admin/testimonials', [
            'name' => 'Contoh Pelanggan', 'team' => 'Tim Contoh', 'quote' => 'Contoh testimoni',
            'initials' => 'CP', 'is_example' => true,
        ])->assertCreated()->assertJsonPath('data.is_example', true)->json('data.id');
        $this->getJson('/api/testimonials/'.$id)->assertOk()->assertJsonPath('data.is_example', true);
        $this->patchJson('/api/admin/testimonials/'.$id, ['quote' => 'Konten diperbarui', 'is_active' => false])->assertOk();
        $this->getJson('/api/testimonials')->assertJsonCount(0, 'data');
        $this->getJson('/api/testimonials/'.$id)->assertNotFound();
        $this->getJson('/api/admin/testimonials/'.$id)->assertOk()->assertJsonPath('data.quote', 'Konten diperbarui');
        $this->deleteJson('/api/admin/testimonials/'.$id)->assertNoContent();
    }
}
