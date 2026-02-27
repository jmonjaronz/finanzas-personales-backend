<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('personas', function (Blueprint $table) {

            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('nombre');

            $table->string('relacion'); 
            // yo, esposa, hijo, cliente, alumno, etc

            $table->boolean('activa')->default(true);

            $table->timestamps();

            $table->index(['user_id', 'nombre']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('personas');
    }
};
