<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pricing_options', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pricing_package_id')->constrained()->cascadeOnDelete();
            $table->string('label', 150);
            $table->decimal('price', 12, 2);
            $table->string('unit', 16);
            $table->unsignedInteger('sort_order')->default(0);
            $table->index(['pricing_package_id', 'sort_order']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pricing_options');
    }
};
