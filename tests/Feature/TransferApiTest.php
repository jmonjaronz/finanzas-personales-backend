<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Account;
use App\Models\Transfer;

class TransferApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_only_owned_transfers()
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        $src1 = Account::factory()->create(['user_id' => $user->id, 'name' => 'S1']);
        $dst1 = Account::factory()->create(['user_id' => $user->id, 'name' => 'D1']);

        $src2 = Account::factory()->create(['user_id' => $otherUser->id, 'name' => 'S2']);
        $dst2 = Account::factory()->create(['user_id' => $otherUser->id, 'name' => 'D2']);

        Transfer::factory()->create(['user_id' => $user->id, 'source_account_id' => $src1->id, 'destination_account_id' => $dst1->id]);
        Transfer::factory()->create(['user_id' => $otherUser->id, 'source_account_id' => $src2->id, 'destination_account_id' => $dst2->id]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/transfers');

        $response->assertStatus(200)
            ->assertJsonCount(1);
    }

    public function test_can_create_transfer()
    {
        $user = User::factory()->create();
        $src = Account::factory()->create(['user_id' => $user->id, 'name' => 'S1']);
        $dst = Account::factory()->create(['user_id' => $user->id, 'name' => 'D1']);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/transfers', [
            'source_account_id' => $src->id,
            'destination_account_id' => $dst->id,
            'amount' => 100.00,
            'date' => '2026-03-01',
            'description' => 'Saving'
        ]);

        $response->assertStatus(201)
            ->assertJsonFragment(['amount' => 100, 'description' => 'Saving']);
    }

    public function test_can_delete_transfer()
    {
        $user = User::factory()->create();
        $src = Account::factory()->create(['user_id' => $user->id, 'name' => 'S1']);
        $dst = Account::factory()->create(['user_id' => $user->id, 'name' => 'D1']);
        $transfer = Transfer::factory()->create(['user_id' => $user->id, 'source_account_id' => $src->id, 'destination_account_id' => $dst->id]);

        $response = $this->actingAs($user, 'sanctum')->deleteJson('/api/transfers/' . $transfer->id);
        $response->assertStatus(204);

        $this->assertDatabaseMissing('transfers', ['id' => $transfer->id]);
    }
}
