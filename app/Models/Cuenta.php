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

    public function transacciones()
    {
        return $this->hasMany(Transaccion::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}