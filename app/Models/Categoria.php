<?php

class Categoria extends Model
{
    protected $fillable = [
        'nombre',
        'tipo'
    ];

    public function transacciones()
    {
        return $this->hasMany(Transaccion::class);
    }
}