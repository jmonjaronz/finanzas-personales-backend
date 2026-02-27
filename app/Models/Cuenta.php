<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cuenta extends Model
{
    protected $fillable = [
        'user_id',
        'nombre',
        'tipo',
        'saldo_actual'
    ];

    protected $casts = [
        'saldo_actual' => 'decimal:2'
    ];

    protected $attributes = [
        'saldo_actual' => 0
    ];

    /* ========================
       RELACIONES
    ======================== */

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function transacciones()
    {
        return $this->hasMany(Transaccion::class);
    }

    public function canales()
    {
        return $this->hasMany(CanalTransaccion::class);
    }

    public function transferenciasOrigen()
    {
        return $this->hasMany(Transferencia::class, 'cuenta_origen_id');
    }

    public function transferenciasDestino()
    {
        return $this->hasMany(Transferencia::class, 'cuenta_destino_id');
    }
}