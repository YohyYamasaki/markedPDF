<?php

declare(strict_types=1);

namespace Tests\Feature\Http\Controllers\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class SignupControllerTest extends TestCase {
    use RefreshDatabase;

    /**
     * @return void
     */
    public function testSuccess(): void {
        $params = [
            'email' => 'test@example.com',
            'name' => 'examle_name',
            'password' => 'password',
            'password_confirmation' => 'password',
        ];

        $this->postJson('/auth/signup', $params)
            ->assertStatus(200)
            ->assertJson([
                'message' => 'Registered and Authenticated. Verification link sent.',
            ]);
    }

    /**
     * @return void
     */
    public function testDuplicateEmail(): void {
        User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
        ]);

        $params = [
            'email' => 'test@example.com',
            'name' => 'examle_name',
            'password' => 'password',
            'password_confirmation' => 'password',
        ];

        $this->postJson('/auth/signup', $params)
            ->assertStatus(422)
            ->assertJson([
                'message' => 'The email has already been taken.'
            ]);
    }

    /**
     * @return void
     */
    public function testInvalidEmailFormat(): void {
        $params = [
            'email' => 'invalid_email',
            'name' => 'examle_name',
            'password' => 'password',
            'password_confirmation' => 'password',
        ];

        $this->postJson('/auth/signup', $params)
            ->assertStatus(422)
            ->assertJson([
                "message" => "The email field must be a valid email address."
            ]);
    }

    public function testEmptyEmail(): void {
        $params = [
            'email' => '',
            'name' => 'examle_name',
            'password' => 'password',
            'password_confirmation' => 'password',
        ];

        $this->postJson('/auth/signup', $params)
            ->assertStatus(422)
            ->assertJson([
                'message' => 'The email field is required.',
            ]);
    }

    public function testEmptyName(): void {
        $params = [
            'email' => 'test@example.com',
            'name' => '',
            'password' => 'password',
            'password_confirmation' => 'password',
        ];

        $this->postJson('/auth/signup', $params)
            ->assertStatus(422)
            ->assertJson([
                'message' => 'The name field is required.',
            ]);
    }

    public function testLongName(): void {
        $params = [
            'email' => 'test@example.com',
            'name' => '1223456789012234567890122345678901223456789012234567890122345678901223456789012234567890122345678901223456789012234567890122345678901223456789012234567890122345678901223456789012234567890122345678901223456789012234567890122345678901223456789012234567890122345678901223456789012234567890',
            'password' => 'password',
            'password_confirmation' => 'password',
        ];

        $this->postJson('/auth/signup', $params)
            ->assertStatus(422)
            ->assertJson([
                'message' => 'The name field must not be greater than 255 characters.',
            ]);
    }

    public function testEmptyPassword(): void {
        $params = [
            'email' => 'test@example.com',
            'name' => 'example',
            'password' => '',
            'password_confirmation' => '',
        ];

        $this->postJson('/auth/signup', $params)
            ->assertStatus(422)
            ->assertJson([
                'message' => 'The password field is required.',
            ]);
    }
    public function testShortPassword(): void {
        $params = [
            'email' => 'test@example.com',
            'name' => 'example',
            'password' => '123',
            'password_confirmation' => '123',
        ];

        $this->postJson('/auth/signup', $params)
            ->assertStatus(422)
            ->assertJson([
                'message' => 'The password field must be at least 8 characters.',
            ]);
    }
    
    public function testNotSamePassword(): void {
        $params = [
            'email' => 'test@example.com',
            'name' => 'example',
            'password' => 'password',
            'password_confirmation' => 'different_password',
        ];

        $this->postJson('/auth/signup', $params)
            ->assertStatus(422)
            ->assertJson([
                'message' => 'The password field confirmation does not match.',
            ]);
    }

    public function testAuthStateAfterLogin(): void {
        $params = [
            'email' => 'test@example.com',
            'name' => 'examle_name',
            'password' => 'password',
            'password_confirmation' => 'password',
        ];

        $this->postJson('/auth/signup', $params);
        $this->getJson('/check-auth-state')
            ->assertStatus(200)
            ->assertJson([
                'isAuthenticated' => true,
            ]);
    }
}