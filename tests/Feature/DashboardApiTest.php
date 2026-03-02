<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Account;
use App\Models\Transaction;
use App\Models\Transfer;
use Carbon\Carbon;

class DashboardApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_dashboard_summary()
    {
        $user = User::factory()->create();

        $account1 = Account::factory()->create([
            'user_id' => $user->id,
            'initial_balance' => 1000,
            'name' => 'Bank A'
        ]);

        $account2 = Account::factory()->create([
            'user_id' => $user->id,
            'initial_balance' => 0,
            'name' => 'Wallet'
        ]);

        // Transaction this month
        Transaction::factory()->create([
            'user_id' => $user->id,
            'account_id' => $account1->id,
            'amount' => 200,
            'type' => 'income',
            'date' => Carbon::now()->format('Y-m-d')
        ]);

        Transaction::factory()->create([
            'user_id' => $user->id,
            'account_id' => $account1->id,
            'amount' => 50,
            'type' => 'expense',
            'date' => Carbon::now()->format('Y-m-d')
        ]);

        // Transfer
        Transfer::factory()->create([
            'user_id' => $user->id,
            'source_account_id' => $account1->id,
            'destination_account_id' => $account2->id,
            'amount' => 100,
            'date' => Carbon::now()->format('Y-m-d')
        ]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/dashboard/summary');

        $response->assertStatus(200);

        // Expected total balance: 1000 + 200 - 50 = 1150
        // Account 1: 1000 + 200 - 50 - 100 = 1050
        // Account 2: 0 + 100 = 100
        // Total: 1050 + 100 = 1150

        $response->assertJsonPath('total_balance', 1150);
        $response->assertJsonPath('monthly_income', 200);
        $response->assertJsonPath('monthly_expense', 50);
    }
}
