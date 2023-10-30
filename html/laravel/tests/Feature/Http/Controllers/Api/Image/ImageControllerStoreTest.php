<?php

declare(strict_types=1);

namespace Tests\Feature\Http\Controllers\Api\Image;

use App\Models\Document;
use App\Models\Image;
use App\Models\User;
use App\UseCases\Image\StoreAction;
use \Intervention\Image\Image as InterventionImage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Mockery;
use Tests\TestCase;

final class ImageControllerStoreTest extends TestCase {
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
			'name' => 'img_private.png',
			'document_id' => $this->doc2->id,
			'user_id' => $this->user2->id,
		]);
	}

	// logged in user can store private image
	public function testSuccessfullyStoresImageOnStoreAction() {
		// Arrange
		// mock Storage facade
		Storage::fake('local');
		// mock InterventionImage class
		$imageFile = Mockery::mock(InterventionImage::class);
		$imageFile->shouldReceive('__toString')->once()->andReturn('fake_image_content');
		// create a StoreAction instance
		$storeAction = new StoreAction();

		// Act
		$result = $storeAction($this->user, $this->img_private, $imageFile, 'uploads/images', $this->img_private->name);

		// Assert
		Storage::disk('local')->assertExists('uploads/images/img_private.png');
		$this->assertDatabaseHas('images', ['name' => 'img_private.png']);
		$this->assertEquals('img_private.png', $result->name);
	}

	// logged in user can store private image
	public function testFailStoresImageOnStoreActionBySetInvalidDocId() {
		// Arrange
		// mock Storage facade
		Storage::fake('local');
		// mock InterventionImage class
		$imageFile = Mockery::mock(InterventionImage::class);
		// create a StoreAction instance
		$storeAction = new StoreAction();

		// Act & Assert
		$this->expectExceptionMessage('You do not own the specified document');

		$result = $storeAction($this->user, $this->img_private2, $imageFile, 'uploads/images', $this->img_private->name);
	}

	public function testFailStoresImageOnActionByLimitExceeded() {
		// Arrange
		Storage::fake('local');

		$user = User::factory()->create();
		$document = Document::factory()->create(['user_id' => $user->id]);

		// Create 20 images for the document
		Image::factory(20)->create(['user_id' => $user->id, 'document_id' => $document->id]);

		$image = Image::factory()->make([
			'user_id' => $user->id,
			'document_id' => $document->id,
		]);

		$imageFile = Mockery::mock(InterventionImage::class);
		$storeAction = new StoreAction();

		// Act & Assert
		$this->expectExceptionMessage('You cannot upload more than 20 images per document');

		$storeAction($user, $image, $imageFile, 'uploads/images', 'test21.jpg');
	}

	public function testSuccessfullyStoresImageOnStoreActionByGuest() {
		// Arrange
		// mock Storage facade
		Storage::fake('local');
		// mock InterventionImage class
		$imageFile = Mockery::mock(InterventionImage::class);
		$imageFile->shouldReceive('__toString')->once()->andReturn('fake_image_content');
		// create a StoreAction instance
		$storeAction = new StoreAction();

		// Act
		$result = $storeAction(null, $this->img_guest, $imageFile, 'uploads/images', $this->img_guest->name);

		// Assert
		Storage::disk('local')->assertExists('uploads/images/img_guest.png');
		$this->assertDatabaseHas('images', ['name' => 'img_guest.png']);
		$this->assertEquals('img_guest.png', $result->name);
	}

	public function testFailStoresImageOnStoreActionByGuestWithInvalidDocId() {
		// Arrange
		// mock Storage facade
		Storage::fake('local');
		// mock InterventionImage class
		$imageFile = Mockery::mock(InterventionImage::class);
		// create a StoreAction instance
		$storeAction = new StoreAction();

		// Act & Assert
		$this->expectExceptionMessage('You must be logged in to upload images to a document');

		$result = $storeAction(null, $this->img_private, $imageFile, 'uploads/images', $this->img_guest->name);
	}
}
