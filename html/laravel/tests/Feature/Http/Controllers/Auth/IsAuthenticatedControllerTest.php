<?php

declare(strict_types=1);

namespace Tests\Feature\Http\Controllers\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class IsAuthenticatedControllerTest extends TestCase {
    use RefreshDatabase;
    /**
     * @return void
     */
    public function testAuthenticated(): void {

        User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
        ]);

        $params = [
            'email' => 'test@example.com',
            'password' => 'password',
        ];
        $this->postJson('/auth/login', $params);

        $this->getJson('/check-auth-state')
            ->assertStatus(200)
            ->assertJson([
                'isAuthenticated' => true,
            ]);
    }

    /**
     * @return void
     */
    public function testNotAuthenticated(): void {
        $this->getJson('/check-auth-state')
            ->assertStatus(401)
            ->assertJson([
                'isAuthenticated' => false,
            ]);
    }
}
