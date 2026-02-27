<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\FinancialTransactionService;
use Illuminate\Http\JsonResponse;

class TransaccionController extends Controller
{
    protected FinancialTransactionService $service;

    public function __construct(FinancialTransactionService $service)
    {
        $this->service = $service;
    }

    /*
    |--------------------------------------------------------------------------
    | CREAR INGRESO
    |--------------------------------------------------------------------------
    */
    public function ingreso(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'cuenta_id' => 'required|exists:cuentas,id',
            'monto' => 'required|numeric|min:0.01',
            'fecha' => 'required|date',
            'categoria_id' => 'nullable|exists:categorias,id',
            'persona_id' => 'nullable|exists:personas,id',
            'canal_transaccion_id' => 'nullable|exists:canales_transaccion,id',
            'descripcion' => 'nullable|string|max:255',
        ]);

        $transaccion = $this->service->crearIngreso($validated);

        return response()->json($transaccion, 201);
    }

    /*
    |--------------------------------------------------------------------------
    | CREAR GASTO
    |--------------------------------------------------------------------------
    */
    public function gasto(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'cuenta_id' => 'required|exists:cuentas,id',
            'monto' => 'required|numeric|min:0.01',
            'fecha' => 'required|date',
            'categoria_id' => 'nullable|exists:categorias,id',
            'persona_id' => 'nullable|exists:personas,id',
            'canal_transaccion_id' => 'nullable|exists:canales_transaccion,id',
            'descripcion' => 'nullable|string|max:255',
        ]);

        $transaccion = $this->service->crearGasto($validated);

        return response()->json($transaccion, 201);
    }

    /*
    |--------------------------------------------------------------------------
    | CREAR TRANSFERENCIA
    |--------------------------------------------------------------------------
    */
    public function transferencia(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'cuenta_origen_id' => 'required|exists:cuentas,id',
            'cuenta_destino_id' => 'required|exists:cuentas,id',
            'monto' => 'required|numeric|min:0.01',
            'fecha' => 'required|date',
            'canal_transaccion_id' => 'nullable|exists:canales_transaccion,id',
            'descripcion' => 'nullable|string|max:255',
        ]);

        $transferencia = $this->service->crearTransferencia($validated);

        return response()->json($transferencia, 201);
    }
}
