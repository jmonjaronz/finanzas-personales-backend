<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /* ========================
       RELACIONES FINANCIERAS
    ======================== */

    public function cuentas()
    {
        return $this->hasMany(Cuenta::class);
    }

    public function categorias()
    {
        return $this->hasMany(Categoria::class);
    }

    public function personas()
    {
        return $this->hasMany(Persona::class);
    }

    public function transacciones()
    {
        return $this->hasMany(Transaccion::class);
    }

    public function transferencias()
    {
        return $this->hasMany(Transferencia::class);
    }

    public function canales()
    {
        return $this->hasMany(CanalTransaccion::class);
    }
}
