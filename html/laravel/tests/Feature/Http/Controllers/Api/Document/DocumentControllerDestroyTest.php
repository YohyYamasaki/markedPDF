<?php

declare(strict_types=1);

namespace Tests\Feature\Http\Controllers\Api\Document;

use App\Models\Document;
use App\Models\User;
use App\Services\HtmlSanitizer;
use Exception;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Mockery;

final class DocumentControllerDestroyTest extends TestCase {
	use RefreshDatabase;
	public $user, $doc;
	public function setUp(): void {
		parent::setUp();
		$this->user = User::factory()->create([
			'name' => 'test',
			'email' => 'test@example.com',
			'password' => bcrypt('password'),
		]);

		User::factory()->create([
			'name' => 'test2',
			'email' => 'test2@example.com',
			'password' => bcrypt('password'),
		]);

		$this->doc = Document::factory()->create([
			'title' => 'test doc 1',
			'content' => 'content of test doc 1',
			'user_id' => $this->user->id,
		]);
	}

	public function testSuccessDestroy(): void {
		$this->postJson('/auth/login', [
			'email' => 'test@example.com',
			'password' => 'password',
		]);

		// mock the HtmlSanitizer class
		/** @var \Mockery\MockInterface|HtmlSanitizer */
		$sanitizerMock = Mockery::mock(HtmlSanitizer::class);
		$sanitizerMock->shouldReceive('sanitize')->andReturn('updated sanitized content');
		app()->instance(HtmlSanitizer::class, $sanitizerMock);


		// check if the document is deleted
		$this->deleteJson('/document/' . $this->doc->id)
			->assertStatus(200)
			->assertJson([
				'message' => 'Document deleted successfully',
			]);

		// check if the document is saved in the database
		$this->assertDatabaseMissing('documents', $this->doc->toArray());
	}

	public function testFailStoreWithoutLoggedIn(): void {
		// check if the document is created
		$this->deleteJson('/document/' . $this->doc->id)
			->assertStatus(401)
			->assertJson([
				'message' => 'Unauthenticated.',
			]);
	}

	public function testFailStoreByAnotherAccount(): void {
		$this->postJson('/auth/login', [
			'email' => 'test2@example.com',
			'password' => 'password',
		]);

		// check if the document is deleted
		$this->deleteJson('/document/' . $this->doc->id)
			->assertStatus(403)
			->assertJson([
				'message' => 'You do not have permission to delete this document',
			]);
	}
}
