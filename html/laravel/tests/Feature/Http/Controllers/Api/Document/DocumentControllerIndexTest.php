<?php

declare(strict_types=1);

namespace Tests\Feature\Http\Controllers\Api\Document;

use App\Models\Document;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class DocumentControllerIndexTest extends TestCase {
	use RefreshDatabase;

	public $doc1, $doc2;
	public function setUp(): void {
		parent::setUp();
		$user1 = User::factory()->create([
			'name' => 'test',
			'email' => 'test@example.com',
			'password' => bcrypt('password'),
		]);

		$user2 = User::factory()->create([
			'name' => 'test2',
			'email' => 'test2@example.com',
			'password' => bcrypt('password'),
		]);

		$this->doc1 = Document::factory()->create([
			'title' => 'test doc 1',
			'content' => 'content of test doc 1',
			'user_id' => $user1->id,
		]);

		$this->doc2 = Document::factory()->create([
			'title' => 'test doc 2',
			'content' => 'content of test doc 2',
			'user_id' => $user1->id,
		]);

		Document::factory()->create([
			'title' => 'test doc 3',
			'content' => 'content of test doc 3',
			'user_id' => $user2->id,
		]);
	}


	/////////////////////// INDEX(SHOW LIST) ///////////////////////
	/**
	 * @return void
	 */
	public function testSuccessIndex(): void {
		$this->postJson('/auth/login', [
			'email' => 'test@example.com',
			'password' => 'password',
		]);

		$this->getJson('/document')
			->assertStatus(200)
			->assertJson([
				[
					'id' => $this->doc1->id,
					'title' => 'test doc 1',
				],
				[
					'id' => $this->doc2->id,
					'title' => 'test doc 2',
				],
			]);
	}

	/**
	 * @return void
	 */
	public function testFailIndex(): void {
		$this->getJson('/document')
			->assertStatus(401)
			->assertJson([
				'message' => 'Unauthenticated.'
			]);
	}
}
