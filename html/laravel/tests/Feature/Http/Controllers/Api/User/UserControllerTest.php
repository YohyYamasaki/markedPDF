<?php

declare(strict_types=1);

namespace Tests\Feature\Http\Controllers\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class UserControllerTest extends TestCase {
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();
        User::factory()->create([
            'email' => 'test@example.com',
            'name' => 'example',
            'password' => bcrypt('password'),
        ]);
    }

		/////////////////////// SHOW ///////////////////////
    /**
     * @return void
     */
    public function testSuccessShow(): void {
				$params = [
						'email' => 'test@example.com',
						'password' => 'password',
					];

				$this->postJson('/auth/login', $params);

        $this->getJson('/user')
            ->assertStatus(200)
            ->assertJson([
							'data' => [
								'name' => 'example',
								'email' => 'test@example.com',
							],
            ]);
    }

		public function testFailShow(): void {
			$this->getJson('/user')
					->assertStatus(401)
					->assertJson([
						'message' => 'Unauthenticated.'
					]);
		}

		/////////////////////// UPDATE ///////////////////////
		public function testSuccessUpdate(): void {
			$params = [
					'email' => 'test@example.com',
					'password' => 'password',
				];

			$this->postJson('/auth/login', $params);

			$this->getJson('/user')		
						->assertStatus(200)
						->assertJson([
							'data' => [
								'name' => 'example',
								'email' => 'test@example.com',
							]
						]);

			$params_update = [
				'name' => 'updated_name',
			];

			$this->putJson('/user', $params_update)
					->assertStatus(200)
					->assertJson([
						'data' => [
							'name' => 'updated_name',
							'email' => 'test@example.com',
						],
						'message' => 'User data updated successfully.',
					]);
		}

		public function testEmptyNameUpdate(): void {
			$params = [
					'email' => 'test@example.com',
					'password' => 'password',
				];

			$this->postJson('/auth/login', $params);

			$params_update = [
				'name' => '',
			];

			$this->putJson('/user', $params_update)
					->assertStatus(422)
					->assertJson([
						'message' => 'The name field is required.',
					]);
		}

		public function testNotLoggedInUpdate(): void {
			$params = [
				'name' => 'test_name',
			];

			$this->putJson('/user', $params)
					->assertStatus(401)
					->assertJson([
						'message' => 'Unauthenticated.',
					]);
		}

		/////////////////////// DESTROY ///////////////////////
		public function testSuccessDestroy(): void {
			$params = [
					'email' => 'test@example.com',
					'password' => 'password',
				];

			$this->postJson('/auth/login', $params);


			$this->getJson('/user')		
						->assertStatus(200)
						->assertJson([
							'data' => [
								'name' => 'example',
								'email' => 'test@example.com',
							]
						]);

			$this-> deleteJson('/user')
					->assertStatus(200)
					->assertJson([
						'message' => 'User data deleted successfully.',
					]);
		}

		public function testNotLoggedInDestroy(): void {
			$this-> deleteJson('/user')
					->assertStatus(401)
					->assertJson([
						'message' => 'Unauthenticated.',
					]);
		}
}