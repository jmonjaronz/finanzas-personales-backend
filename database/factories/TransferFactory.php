<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Account;
use Illuminate\Database\Eloquent\Factories\Factory;

class TransferFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'source_account_id' => Account::factory(),
            'destination_account_id' => Account::factory(),
            'amount' => $this->faker->randomFloat(2, 1, 500),
            'date' => $this->faker->date(),
            'description' => $this->faker->sentence()
        ];
    }
}
