<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transacciones', function (Blueprint $table) {

            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('cuenta_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('categoria_id')
                ->constrained()
                ->restrictOnDelete();

            $table->foreignId('persona_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            $table->foreignId('canal_id')
                ->nullable()
                ->constrained('canales_transaccion')
                ->nullOnDelete();

            $table->decimal('monto', 14, 2);

            $table->date('fecha');

            $table->text('descripcion')->nullable();

            $table->enum('estado', ['pendiente', 'pagado', 'cancelado'])
                ->default('pagado');

            $table->timestamps();

            $table->index(['user_id', 'fecha']);
            $table->index(['cuenta_id', 'fecha']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transacciones');
    }
};
