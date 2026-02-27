<?php

namespace App\Services;

use App\Models\Cuenta;
use App\Models\Transaccion;
use App\Models\Transferencia;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class FinancialTransactionService
{
    /*
    |--------------------------------------------------------------------------
    | CREAR INGRESO
    |--------------------------------------------------------------------------
    */

    public function crearIngreso(array $data): Transaccion
    {
        return DB::transaction(function () use ($data) {

            $cuenta = Cuenta::lockForUpdate()->findOrFail($data['cuenta_id']);

            $transaccion = Transaccion::create([
                'user_id' => $data['user_id'],
                'monto' => $data['monto'],
                'tipo' => 'ingreso',
                'descripcion' => $data['descripcion'] ?? null,
                'fecha' => $data['fecha'],
                'cuenta_id' => $cuenta->id,
                'categoria_id' => $data['categoria_id'] ?? null,
                'persona_id' => $data['persona_id'] ?? null,
                'canal_transaccion_id' => $data['canal_transaccion_id'] ?? null,
            ]);

            $cuenta->increment('saldo_actual', $data['monto']);

            return $transaccion;
        });
    }

    /*
    |--------------------------------------------------------------------------
    | CREAR GASTO
    |--------------------------------------------------------------------------
    */

    public function crearGasto(array $data): Transaccion
    {
        return DB::transaction(function () use ($data) {

            $cuenta = Cuenta::lockForUpdate()->findOrFail($data['cuenta_id']);

            if ($cuenta->saldo_actual < $data['monto']) {
                throw ValidationException::withMessages([
                    'monto' => 'Saldo insuficiente en la cuenta.'
                ]);
            }

            $transaccion = Transaccion::create([
                'user_id' => $data['user_id'],
                'monto' => $data['monto'],
                'tipo' => 'gasto',
                'descripcion' => $data['descripcion'] ?? null,
                'fecha' => $data['fecha'],
                'cuenta_id' => $cuenta->id,
                'categoria_id' => $data['categoria_id'] ?? null,
                'persona_id' => $data['persona_id'] ?? null,
                'canal_transaccion_id' => $data['canal_transaccion_id'] ?? null,
            ]);

            $cuenta->decrement('saldo_actual', $data['monto']);

            return $transaccion;
        });
    }

    /*
    |--------------------------------------------------------------------------
    | CREAR TRANSFERENCIA
    |--------------------------------------------------------------------------
    */

    public function crearTransferencia(array $data): Transferencia
    {
        return DB::transaction(function () use ($data) {

            if ($data['cuenta_origen_id'] == $data['cuenta_destino_id']) {
                throw ValidationException::withMessages([
                    'cuenta_destino_id' => 'La cuenta destino no puede ser la misma que la cuenta origen.'
                ]);
            }

            $cuentaOrigen = Cuenta::lockForUpdate()->findOrFail($data['cuenta_origen_id']);
            $cuentaDestino = Cuenta::lockForUpdate()->findOrFail($data['cuenta_destino_id']);

            if ($cuentaOrigen->saldo_actual < $data['monto']) {
                throw ValidationException::withMessages([
                    'monto' => 'Saldo insuficiente en la cuenta origen.'
                ]);
            }

            $transferencia = Transferencia::create([
                'user_id' => $data['user_id'],
                'monto' => $data['monto'],
                'fecha' => $data['fecha'],
                'descripcion' => $data['descripcion'] ?? null,
                'cuenta_origen_id' => $cuentaOrigen->id,
                'cuenta_destino_id' => $cuentaDestino->id,
                'canal_transaccion_id' => $data['canal_transaccion_id'] ?? null,
            ]);

            $cuentaOrigen->decrement('saldo_actual', $data['monto']);
            $cuentaDestino->increment('saldo_actual', $data['monto']);

            return $transferencia;
        });
    }
}