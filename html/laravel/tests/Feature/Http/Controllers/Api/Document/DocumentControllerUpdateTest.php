<?php

declare(strict_types=1);

namespace Tests\Feature\Http\Controllers\Api\Document;

use App\Models\Document;
use App\Models\User;
use App\Services\HtmlSanitizer;
use App\UseCases\Document\UpdateAction;
use Exception;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Mockery;

final class DocumentControllerUpdateTest extends TestCase {
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

	public function testSuccessUpdate(): void {
		$this->postJson('/auth/login', [
			'email' => 'test@example.com',
			'password' => 'password',
		]);

		// mock the HtmlSanitizer class
		/** @var \Mockery\MockInterface|HtmlSanitizer */
		$sanitizerMock = Mockery::mock(HtmlSanitizer::class);
		$sanitizerMock->shouldReceive('sanitize')->andReturn('updated sanitized content');
		app()->instance(HtmlSanitizer::class, $sanitizerMock);

		$inputs = [
			'title' => 'updated test doc 1',
			'content' => 'updated content before sanitized',
		];

		// check if the document is updated
		$this->putJson('/document/' . $this->doc->id, $inputs)
			->assertStatus(200)
			->assertJson([
				'message' => 'Document updated successfully',
			]);

		// check if the document is saved in the database
		$this->assertDatabaseHas('documents', [
			'title' => 'updated test doc 1',
			'content' => 'updated sanitized content',
		]);
	}

	public function testFailStoreWithoutLoggedIn(): void {
		// mock the HtmlSanitizer class
		/** @var \Mockery\MockInterface|HtmlSanitizer */
		$sanitizerMock = Mockery::mock(HtmlSanitizer::class);
		$sanitizerMock->shouldReceive('sanitize')->andReturn('updated sanitized content');
		app()->instance(HtmlSanitizer::class, $sanitizerMock);

		$inputs = [
			'title' => 'updated test doc 1',
			'content' => 'updated content before sanitized',
		];

		// check if the document is updated
		$this->putJson('/document/' . $this->doc->id, $inputs)
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

		// mock the HtmlSanitizer class
		/** @var \Mockery\MockInterface|HtmlSanitizer */
		$sanitizerMock = Mockery::mock(HtmlSanitizer::class);
		$sanitizerMock->shouldReceive('sanitize')->andReturn('updated sanitized content');
		app()->instance(HtmlSanitizer::class, $sanitizerMock);

		$inputs = [
			'title' => 'updated test doc 1',
			'content' => 'updated content before sanitized',
		];

		// check if the document is updated
		$this->putJson('/document/' . $this->doc->id, $inputs)
			->assertStatus(403)
			->assertJson([
				'message' => 'You do not have permission to update this document',
			]);
	}
}
