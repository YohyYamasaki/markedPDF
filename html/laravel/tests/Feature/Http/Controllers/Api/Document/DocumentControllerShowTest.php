<?php

declare(strict_types=1);

namespace Tests\Feature\Http\Controllers\Api\Document;

use App\Models\Document;
use App\Models\Image;
use App\Models\User;
use App\UseCases\Document\ShowAction as DocumentShowAction;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class DocumentControllerShowTest extends TestCase {
	use RefreshDatabase;

	public $user, $doc, $img;
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

		$this->img = Image::factory()->create([
			'name' => 'test1.jpg',
			'document_id' => $this->doc->id,
			'user_id' => $this->user->id,
			'last_viewed_at' => null,
		]);
	}

	public function testSuccessShow(): void {
		$this->postJson('/auth/login', [
			'email' => 'test@example.com',
			'password' => 'password',
		]);

		// check if the document can be shown
		$this->getJson('/document/' . $this->doc->id)
			->assertStatus(200)
			->assertJson([
				"data" => [
					"id" => $this->doc->id,
					"title" => "test doc 1",
					"content" => "content of test doc 1",
					"images" => []
				],
				"message" => null
			]);
	}

	public function testFailShowWithoutLogin(): void {
		// check if the document can be shown
		$this->getJson('/document/' . $this->doc->id)
			->assertStatus(401)
			->assertJson([
				"message" => 'Unauthenticated.'
			]);
	}

	public function testFailShowWithAnotherUser(): void {
		$this->postJson('/auth/login', [
			'email' => 'test2@example.com',
			'password' => 'password',
		]);

		// check if the document can be shown
		$this->getJson('/document/' . $this->doc->id)
			->assertStatus(422)
			->assertJson([
				"message" => 'You do not have permission to view this document'
			]);
	}

	public function testUpdateImageLastViewDateOnShow(): void {
		// create mock objects of User and Document
		$this->actingAs($this->user);

		$showAction = new DocumentShowAction();
		$showAction($this->user, $this->doc);

		$this->img->refresh();

		$this->assertNotNull($this->img->last_viewed_at);
	}
}
