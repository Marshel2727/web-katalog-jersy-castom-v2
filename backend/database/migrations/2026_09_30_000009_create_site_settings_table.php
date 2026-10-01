<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('tagline', 255);
            $table->string('whatsapp', 20);
            $table->string('logo_path', 512)->nullable();
            $table->string('instagram_url', 512)->nullable();
            $table->string('tiktok_url', 512)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_settings');
    }
};
