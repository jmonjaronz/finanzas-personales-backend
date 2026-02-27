<?php

class Transaccion extends Model
{
    protected $fillable = [
        'monto',
        'tipo',
        'cuenta_id',
        'categoria_id',
        'persona_id'
    ];

    public function cuenta()
    {
        return $this->belongsTo(Cuenta::class);
    }

    public function categoria()
    {
        return $this->belongsTo(Categoria::class);
    }

    public function persona()
    {
        return $this->belongsTo(Persona::class);
    }
}
