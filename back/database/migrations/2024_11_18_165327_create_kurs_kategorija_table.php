<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('kurs_kategorija', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kurs_id')->constrained("kursevi")->onDelete('cascade');
            $table->foreignId('kategorija_id')->constrained("kategorije")->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kurs_kategorija');
    }
};
