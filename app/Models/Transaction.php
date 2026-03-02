<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'account_id',
        'transaction_channel_id',
        'category_id',
        'person_id',
        'amount',
        'type',
        'date',
        'description'
    ];

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    public function transactionChannel()
    {
        return $this->belongsTo(TransactionChannel::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function person()
    {
        return $this->belongsTo(Person::class);
    }
//
}
