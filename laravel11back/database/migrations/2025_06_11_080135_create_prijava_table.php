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
        Schema::create('prijave', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('student_id');
            $table->unsignedBigInteger('kurs_id');
            $table->enum('zahtev', ['u toku', 'primljen', 'odbijen']);
             $table->boolean('polozio')->default(false);
             $table->integer('ocena')->nullable();
            $table->timestamps();

             $table->foreign('student_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('kurs_id')->references('id')->on('kursevi')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prijave');
    }
};
