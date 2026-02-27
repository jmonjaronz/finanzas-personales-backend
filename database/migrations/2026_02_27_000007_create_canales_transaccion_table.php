<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('canales_transaccion', function (Blueprint $table) {

            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('cuenta_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('nombre'); 
            // Yape, Plin, Tarjeta débito

            $table->string('tipo'); 
            // app, tarjeta, banco

            $table->boolean('activa')->default(true);

            $table->timestamps();

            $table->index(['user_id', 'cuenta_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('canales_transaccion');
    }
};
