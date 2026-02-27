<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cuentas', function (Blueprint $table) {

            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('nombre');

            $table->string('tipo'); // efectivo, banco, inversion

            $table->decimal('saldo_inicial', 14, 2)->default(0);

            $table->decimal('saldo_actual', 14, 2)->default(0);

            $table->boolean('activa')->default(true);

            $table->timestamps();

            $table->index(['user_id', 'nombre']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cuentas');
    }
};
