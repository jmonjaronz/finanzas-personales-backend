<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Account extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'initial_balance',
        'allows_negative',
    ];

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function transfersFrom()
    {
        return $this->hasMany(Transfer::class , 'source_account_id');
    }

    public function transfersTo()
    {
        return $this->hasMany(Transfer::class , 'destination_account_id');
    }

    public function getCurrentBalanceAttribute()
    {
        $income = $this->transactions()->where('type', 'income')->sum('amount');
        $expense = $this->transactions()->where('type', 'expense')->sum('amount');

        $transfersOut = $this->transfersFrom()->sum('amount');
        $transfersIn = $this->transfersTo()->sum('amount');

        return $this->initial_balance + $income - $expense + $transfersIn - $transfersOut;
    }

    protected $appends = ['current_balance'];
}
