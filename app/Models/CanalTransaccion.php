<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CanalTransaccion extends Model
{
    protected $table = 'canales_transaccion';

    protected $fillable = [
        'user_id',
        'cuenta_id',
        'nombre'
    ];

    /* ========================
       RELACIONES
    ======================== */

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function cuenta()
    {
        return $this->belongsTo(Cuenta::class);
    }

    public function transacciones()
    {
        return $this->hasMany(Transaccion::class);
    }

    public function transferencias()
    {
        return $this->hasMany(Transferencia::class);
    }
}