<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transferencia extends Model
{
    protected $fillable = [
        'user_id',
        'monto',
        'fecha',
        'descripcion',
        'cuenta_origen_id',
        'cuenta_destino_id',
        'canal_transaccion_id'
    ];

    protected $casts = [
        'monto' => 'decimal:2',
        'fecha' => 'date'
    ];

    /* ========================
       RELACIONES
    ======================== */

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function cuentaOrigen()
    {
        return $this->belongsTo(Cuenta::class, 'cuenta_origen_id');
    }

    public function cuentaDestino()
    {
        return $this->belongsTo(Cuenta::class, 'cuenta_destino_id');
    }

    public function canal()
    {
        return $this->belongsTo(CanalTransaccion::class, 'canal_transaccion_id');
    }
}