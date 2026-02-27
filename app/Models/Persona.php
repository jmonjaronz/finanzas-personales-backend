<?php

class Persona extends Model
{
    protected $fillable = [
        'nombre'
    ];

    public function transacciones()
    {
        return $this->hasMany(Transaccion::class);
    }
}
