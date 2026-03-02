<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Category;

class CategoryApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_only_owned_categories()
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        Category::factory()->create(['user_id' => $user->id, 'name' => 'Food']);
        Category::factory()->create(['user_id' => $otherUser->id, 'name' => 'Rent']);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/categories');

        $response->assertStatus(200)
            ->assertJsonCount(1);
    }

    public function test_can_create_category()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/categories', [
            'name' => 'Transport',
            'type' => 'expense'
        ]);

        $response->assertStatus(201)
            ->assertJsonFragment(['name' => 'Transport']);
    }

    public function test_can_create_subcategory()
    {
        $user = User::factory()->create();
        $parent = Category::factory()->create(['user_id' => $user->id, 'name' => 'Food']);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/categories', [
            'name' => 'Sushi',
            'type' => 'expense',
            'parent_id' => $parent->id
        ]);

        $response->assertStatus(201)
            ->assertJsonFragment(['parent_id' => $parent->id]);
    }

    public function test_can_delete_category()
    {
        $user = User::factory()->create();
        $category = Category::factory()->create(['user_id' => $user->id, 'name' => 'Food']);

        $response = $this->actingAs($user, 'sanctum')->deleteJson('/api/categories/' . $category->id);
        $response->assertStatus(204);

        $this->assertDatabaseMissing('categories', ['id' => $category->id]);
    }
}
