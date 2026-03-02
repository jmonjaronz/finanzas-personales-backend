<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Account;

class AccountApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_only_owned_accounts()
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        Account::factory()->create(['user_id' => $user->id, 'name' => 'My BCP']);
        Account::factory()->create(['user_id' => $otherUser->id, 'name' => 'Other BCP']);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/accounts');

        $response->assertStatus(200)
            ->assertJsonCount(1);
    }

    public function test_can_create_account()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/accounts', [
            'name' => 'Yape',
            'type' => 'normal',
            'initial_balance' => 100,
            'allows_negative' => false
        ]);

        $response->assertStatus(201)
            ->assertJsonFragment(['name' => 'Yape']);
    }
}
