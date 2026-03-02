<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Person;

class PersonApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_only_owned_people()
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        Person::factory()->create(['user_id' => $user->id, 'name' => 'John']);
        Person::factory()->create(['user_id' => $otherUser->id, 'name' => 'Jane']);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/people');

        $response->assertStatus(200)
            ->assertJsonCount(1);
    }

    public function test_can_create_person()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/people', [
            'name' => 'Alice'
        ]);

        $response->assertStatus(201)
            ->assertJsonFragment(['name' => 'Alice']);
    }

    public function test_can_delete_person()
    {
        $user = User::factory()->create();
        $person = Person::factory()->create(['user_id' => $user->id, 'name' => 'Bob']);

        $response = $this->actingAs($user, 'sanctum')->deleteJson('/api/people/' . $person->id);
        $response->assertStatus(204);

        $this->assertDatabaseMissing('people', ['id' => $person->id]);
    }
}
