<?php

declare(strict_types=1);

namespace Tests\Feature\Http\Controllers\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class LoginControllerTest extends TestCase {
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();
        User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
        ]);
    }

    /**
     * @return void
     */
    public function testSuccess(): void {

        $params = [
            'email' => 'test@example.com',
            'password' => 'password',
        ];

        $this->postJson('/auth/login', $params)
            ->assertStatus(200)
            ->assertJson([
                'message' => 'Authenticated.',
            ]);
    }

    /**
     * @return void
     */
    public function testWrongPassword(): void {
        $params = [
            'email' => 'test@example.com',
            'password' => 'wrong_password',
        ];

        $this->postJson('/auth/login', $params)
            ->assertStatus(422)
            ->assertJson([
                'message' => 'Email or password is invalid.',
            ]);
    }

    /**
     * @return void
     */
    public function testNoInputs(): void {
        $this->postJson('/auth/login', [])
            ->assertStatus(422)
            ->assertJson([
                'message' => 'The email field is required. (and 1 more error)',
                'errors' => [
                    'email' => ['The email field is required.'],
                    'password' => ['The password field is required.'],
                ],
            ]);
    }
}