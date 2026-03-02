<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Transfer extends Model
{
    use HasFactory;

    protected $fillable = [
        'source_account_id',
        'destination_account_id',
        'amount',
        'date',
        'description'
    ];

    public function sourceAccount()
    {
        return $this->belongsTo(Account::class , 'source_account_id');
    }

    public function destinationAccount()
    {
        return $this->belongsTo(Account::class , 'destination_account_id');
    }
//
}
