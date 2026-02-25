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
        Schema::create('transacciones', function (Blueprint $table) {

            // ID principal (BIGINT estándar Laravel)
            $table->id();

            // RELACIONES
            $table->foreignId('user_id')
                ->constrained('users')
                ->onDelete('cascade');

            $table->foreignId('cuenta_id')
                ->constrained('cuentas')
                ->onDelete('cascade');

            $table->foreignId('categoria_id')
                ->constrained('categorias')
                ->onDelete('cascade');

            // persona_id lo dejamos preparado para futuro
            $table->foreignId('persona_id')
                ->nullable()
                ->constrained('personas')
                ->nullOnDelete();

            // DATOS DE LA TRANSACCIÓN
            $table->string('tipo'); // ingreso | gasto | transferencia

            $table->decimal('monto', 12, 2);

            $table->date('fecha');

            $table->string('descripcion')->nullable();

            $table->string('estado')->default('activo');

            $table->timestamps();

            // Índices para rendimiento
            $table->index('fecha');
            $table->index('tipo');
            $table->index('estado');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transacciones');
    }
};
