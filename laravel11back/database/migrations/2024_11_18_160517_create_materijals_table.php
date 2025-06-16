<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   
    public function up(): void
    {
        Schema::create('materijali', function (Blueprint $table) {
            $table->id();
            $table->string('naziv'); 
            $table->string('putanja'); 
            $table->foreignId('cas_id')->constrained('casovi')->onDelete('cascade');
            $table->timestamps();
        });
    }

   
    public function down(): void
    {
        Schema::dropIfExists('materijals');
    }
};
