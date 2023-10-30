<?php

declare(strict_types=1);

namespace Tests\Feature\Http\Controllers\Api\Document;

use App\Models\Document;
use App\Models\User;
use App\Services\HtmlSanitizer;
use App\UseCases\Document\StoreAction;
use Exception;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Mockery;

final class DocumentControllerStoreTest extends TestCase {
	use RefreshDatabase;

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
	}

	public function testSuccessStore(): void {
		$this->postJson('/auth/login', [
			'email' => 'test@example.com',
			'password' => 'password',
		]);

		// mock the HtmlSanitizer class
		/** @var \Mockery\MockInterface|HtmlSanitizer */
		$sanitizerMock = Mockery::mock(HtmlSanitizer::class);
		$sanitizerMock->shouldReceive('sanitize')->once()->andReturn('sanitized content');
		app()->instance(HtmlSanitizer::class, $sanitizerMock);

		// create a document
		$inputs = [
			'title' => 'test doc 1',
			'content' => 'content before sanitized',
		];

		// check if the document is created
		$this->postJson('/document', $inputs)
			->assertStatus(201)
			->assertJson([
				'message' => 'Document created successfully',
			]);

		// check if the document is saved in the database
		$this->assertDatabaseHas('documents', [
			'title' => 'test doc 1',
			'content' => 'sanitized content',
		]);
	}

	public function testFailStoreWithoutLoggedIn(): void {
		// mock the HtmlSanitizer class
		/** @var \Mockery\MockInterface|HtmlSanitizer */
		$sanitizerMock = Mockery::mock(HtmlSanitizer::class);
		$sanitizerMock->shouldReceive('sanitize')->andReturn('sanitized_content');
		app()->instance(HtmlSanitizer::class, $sanitizerMock);

		// create a document
		$inputs = [
			'title' => 'test doc 1',
			'content' => 'content of test doc 1',
		];

		// check if the document is created
		$this->postJson('/document', $inputs)
			->assertStatus(401)
			->assertJson([
				'message' => 'Unauthenticated.',
			]);
	}

	public function testStoreActionFailIfAlreadyHasMoreThan10Docs(): void {
		// create mock objects of User, Document, and HasMany
		$userMock = Mockery::mock(User::class);
		$documentMock = Mockery::mock(Document::class);
		$hasManyMock = Mockery::mock('Illuminate\Database\Eloquent\Relations\HasMany');

		// set userMock to return true when can method is called
		$userMock->shouldReceive('can')->with('create', $documentMock)->andReturn(true);

		// set hasManyMock to return 10 when count method is called
		$hasManyMock->shouldReceive('count')->andReturn(10);

		// set document to userMock and return hasManyMock when documents method is called
		$userMock->shouldReceive('documents')->andReturn($hasManyMock);

		// create an instance of StoreAction
		$action = new StoreAction();

		$this->expectExceptionMessage('You have reached the maximum number of documents');

		$action($userMock, $documentMock);
	}

	public function testStoreActionThrowsExceptionOnSave(): void {
		// create mock objects of User, Document, and HasMany
		$userMock = Mockery::mock(User::class);
		$documentMock = Mockery::mock(Document::class);
		$hasManyMock = Mockery::mock('Illuminate\Database\Eloquent\Relations\HasMany');

		// set userMock to return true when can method is called
		$userMock->shouldReceive('can')->with('create', $documentMock)->andReturn(true);

		// set hasManyMock to return 1 when count method is called
		$hasManyMock->shouldReceive('count')->andReturn(1);

		// set documents to userMock and return hasManyMock when documents method is called
		$userMock->shouldReceive('documents')->andReturn($hasManyMock);

		// set documentMock to throw exception
		$documentMock->shouldReceive('save')->once()->andThrow(new Exception('Failed to save the document'));

		// create an instance of StoreAction
		$action = new StoreAction();

		$this->expectExceptionMessage('Failed to save the document');

		$action($userMock, $documentMock);
	}

	public function testStoreActionFailWithNoPermission(): void {
		// create mock objects of User and Document
		$userMock = Mockery::mock(User::class);
		$documentMock = Mockery::mock(Document::class);

		// set userMock to return true when can method is called
		$userMock->shouldReceive('can')->with('create', $documentMock)->andReturn(false);
		// set document to userMock and return 1 when count method is called
		$userMock->shouldReceive('documents')->andReturnSelf();
		$userMock->shouldReceive('count')->andReturn(1);

		// create an instance of StoreAction
		$action = new StoreAction();

		$this->expectExceptionMessage('You do not have permission to store this document');

		$action($userMock, $documentMock);
	}
}
