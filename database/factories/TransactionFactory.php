<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Account;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class TransactionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'account_id' => Account::factory(),
            'category_id' => Category::factory(),
            'amount' => $this->faker->randomFloat(2, 1, 1000),
            'type' => 'expense',
            'date' => $this->faker->date(),
            'description' => $this->faker->sentence()
        ];
    }
}
