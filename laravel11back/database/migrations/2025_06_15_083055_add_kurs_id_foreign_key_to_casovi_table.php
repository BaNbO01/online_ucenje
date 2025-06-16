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
        Schema::table('casovi', function (Blueprint $table) {
             $table->foreignId('kurs_id')->constrained('kursevi')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('casovi', function (Blueprint $table) {
            $table->dropForeign(['kurs_id']);
            $table->dropColumn('kurs_id');
        });
    }
};
