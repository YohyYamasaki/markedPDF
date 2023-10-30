<?php

declare(strict_types=1);

namespace Tests\Feature\Http\Controllers\Api\Image;

use App\Models\Document;
use App\Models\Image;
use App\Models\User;
use App\UseCases\Image\DestroyAction;
use Illuminate\Http\UploadedFile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

final class ImageControllerDestroyTest extends TestCase {
	use RefreshDatabase;
	public $user, $user2, $doc, $doc2, $img_private, $img_private2, $img_guest;
	public function setUp(): void {
		parent::setUp();
		$this->user = User::factory()->create([
			'name' => 'test',
			'email' => 'test@example.com',
			'password' => bcrypt('password'),
		]);

		$this->user2 = User::factory()->create([
			'name' => 'test2',
			'email' => 'test2@example.com',
			'password' => bcrypt('password'),
		]);

		$this->doc = Document::factory()->create([
			'user_id' => $this->user->id,
		]);

		$this->doc2 = Document::factory()->create([
			'user_id' => $this->user2->id,
		]);

		$this->img_guest = Image::factory()->make([
			'name' => 'img_guest.png',
			'document_id' => null,
			'user_id' => null,
		]);

		$this->img_private = Image::factory()->make([
			'name' => 'img_private.png',
			'document_id' => $this->doc->id,
			'user_id' => $this->user->id,
		]);

		$this->img_private2 = Image::factory()->make([
			'name' => 'img_private2.png',
			'document_id' => $this->doc2->id,
			'user_id' => $this->user2->id,
		]);

		// create a fake image
		Storage::fake('local');
		$file = UploadedFile::fake()->image('img_private.png');

		Storage::disk('local')->put(
			'uploads/images/img_private.png',
			$file->get()
		);

		Storage::disk('local')->put(
			'uploads/images/img_guest.png',
			$file->get()
		);
	}

	// logged in user can delete owned image
	public function testSuccessfullyDestroysImage() {
		// Arrange
		$image = Image::factory()->create([
			'name' => 'img_private.png',
			'user_id' => $this->user->id,
			'document_id' => $this->doc->id
		]);

		$uploadDir = 'uploads/images/';
		$destroyAction = new DestroyAction();

		Storage::disk('local')->assertExists($uploadDir . $image->name);

		// Act
		$destroyAction($this->user, $image, $uploadDir);

		// Assert
		Storage::disk('local')->assertMissing($uploadDir . $image->name);
	}

	// logged in user cannot delete not owned image
	public function testFailDestroysImageByAnotherUser() {
		// Arrange
		$image = Image::factory()->create([
			'name' => 'img_private.png',
			'user_id' => $this->user->id,
			'document_id' => $this->doc->id
		]);

		$uploadDir = 'uploads/images/';
		$destroyAction = new DestroyAction();

		Storage::disk('local')->assertExists($uploadDir . $image->name);

		// Act & Assert
		$this->expectExceptionMessage('You do not have permission to delete this image');

		$destroyAction($this->user2, $image, $uploadDir);
	}

	// logged in user cannot delete not unexisting image
	public function testFailDestroysUnexistingImage() {
		// Arrange	
		$uploadDir = 'uploads/images/';
		$destroyAction = new DestroyAction();

		$image = new Image([
			'name' => 'not_saved_img.png',
			'user_id' => $this->user->id,
			'document_id' => $this->doc->id
		]);

		Storage::disk('local')->assertMissing($uploadDir . $image->name);

		// Act & Assert
		$this->expectExceptionMessage('You do not have permission to delete this image');

		$destroyAction($this->user2, $image, $uploadDir);
	}

	// guest user can delete guest image
	public function testSuccessfullyDestroysImageByGuest() {
		// Arrange
		$image = Image::factory()->create([
			'name' => 'img_private.png',
			'user_id' => null,
			'document_id' => null
		]);

		$uploadDir = 'uploads/images/';
		$destroyAction = new DestroyAction();

		Storage::disk('local')->assertExists($uploadDir . $image->name);

		// Act
		$destroyAction(null, $image, $uploadDir);

		// Assert
		Storage::disk('local')->assertMissing($uploadDir . $image->name);
	}

	// guest user cannot delete private image
	public function testFailDestroysPrivateImageByGuest() {
		// Arrange
		$image = Image::factory()->create([
			'name' => 'img_private.png',
			'user_id' => $this->user->id,
			'document_id' => $this->doc->id
		]);

		$uploadDir = 'uploads/images/';
		$destroyAction = new DestroyAction();

		Storage::disk('local')->assertExists($uploadDir . $image->name);

		// Act & Assert
		$this->expectExceptionMessage('You must be logged in to delete this image');

		$destroyAction(null, $image, $uploadDir);
	}
}
