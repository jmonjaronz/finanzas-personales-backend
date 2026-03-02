<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Account;
use App\Models\Category;
use App\Models\Transaction;

class TransactionApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_only_owned_transactions()
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        $account1 = Account::factory()->create(['user_id' => $user->id, 'name' => 'A1']);
        $category1 = Category::factory()->create(['user_id' => $user->id]);

        $account2 = Account::factory()->create(['user_id' => $otherUser->id, 'name' => 'A2']);
        $category2 = Category::factory()->create(['user_id' => $otherUser->id]);

        Transaction::factory()->create(['user_id' => $user->id, 'account_id' => $account1->id, 'category_id' => $category1->id]);
        Transaction::factory()->create(['user_id' => $otherUser->id, 'account_id' => $account2->id, 'category_id' => $category2->id]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/transactions');

        $response->assertStatus(200)
            ->assertJsonCount(1);
    }

    public function test_can_create_transaction()
    {
        $user = User::factory()->create();
        $account = Account::factory()->create(['user_id' => $user->id, 'name' => 'A1']);
        $category = Category::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/transactions', [
            'account_id' => $account->id,
            'category_id' => $category->id,
            'amount' => 50.00,
            'type' => 'expense',
            'date' => '2026-03-01',
            'description' => 'Lunch'
        ]);

        $response->assertStatus(201)
            ->assertJsonFragment(['amount' => 50, 'description' => 'Lunch']);
    }

    public function test_can_delete_transaction()
    {
        $user = User::factory()->create();
        $account = Account::factory()->create(['user_id' => $user->id, 'name' => 'A1']);
        $category = Category::factory()->create(['user_id' => $user->id]);
        $transaction = Transaction::factory()->create(['user_id' => $user->id, 'account_id' => $account->id, 'category_id' => $category->id]);

        $response = $this->actingAs($user, 'sanctum')->deleteJson('/api/transactions/' . $transaction->id);
        $response->assertStatus(204);

        $this->assertDatabaseMissing('transactions', ['id' => $transaction->id]);
    }
}
