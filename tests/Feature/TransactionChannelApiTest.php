<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Account;
use App\Models\TransactionChannel;

class TransactionChannelApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_only_owned_channels()
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        $account = Account::factory()->create(['user_id' => $user->id, 'name' => 'A1', 'type' => 'banco', 'initial_balance' => 0, 'allows_negative' => false]);
        $otherAccount = Account::factory()->create(['user_id' => $otherUser->id, 'name' => 'A2', 'type' => 'banco', 'initial_balance' => 0, 'allows_negative' => false]);

        TransactionChannel::factory()->create(['user_id' => $user->id, 'account_id' => $account->id, 'name' => 'Cash']);
        TransactionChannel::factory()->create(['user_id' => $otherUser->id, 'account_id' => $otherAccount->id, 'name' => 'Card']);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/transaction-channels');

        $response->assertStatus(200)
            ->assertJsonCount(1);
    }

    public function test_can_create_channel()
    {
        $user = User::factory()->create();
        $account = Account::factory()->create(['user_id' => $user->id, 'name' => 'A1', 'type' => 'banco', 'initial_balance' => 0, 'allows_negative' => false]);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/transaction-channels', [
            'name' => 'Debit Card',
            'account_id' => $account->id
        ]);

        $response->assertStatus(201)
            ->assertJsonFragment(['name' => 'Debit Card']);
    }

    public function test_can_delete_channel()
    {
        $user = User::factory()->create();
        $account = Account::factory()->create(['user_id' => $user->id, 'name' => 'A1', 'type' => 'banco', 'initial_balance' => 0, 'allows_negative' => false]);
        $channel = TransactionChannel::factory()->create(['user_id' => $user->id, 'account_id' => $account->id, 'name' => 'Cash']);

        $response = $this->actingAs($user, 'sanctum')->deleteJson('/api/transaction-channels/' . $channel->id);
        $response->assertStatus(204);

        $this->assertDatabaseMissing('transaction_channels', ['id' => $channel->id]);
    }
}
