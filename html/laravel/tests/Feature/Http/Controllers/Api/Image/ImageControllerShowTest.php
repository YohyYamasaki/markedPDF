<?php

declare(strict_types=1);

namespace Tests\Feature\Http\Controllers\Api\Image;

use App\Models\Document;
use App\Models\Image;
use App\Models\User;
use App\UseCases\Image\ShowAction;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Mockery;
use Tests\TestCase;

final class ImageControllerShowTest extends TestCase {
	use RefreshDatabase;
	public $user, $user2, $doc, $img_private, $img_guest;
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
			'title' => 'test doc 1',
			'content' => 'content of test doc 1',
			'user_id' => $this->user->id,
		]);

		$this->img_guest = Image::factory()->create([
			'name' => 'guest_image_name.png',
			'document_id' => null,
			'user_id' => null,
		]);

		$this->img_private = Image::factory()->create([
			'name' => 'private_img_name.png',
			'document_id' => $this->doc->id,
			'user_id' => $this->user->id,
		]);

		// create a fake image
		Storage::fake('local');
		$file = UploadedFile::fake()->image('private_img_name.png');
		Storage::disk('local')->put(
			'uploads/images/private_img_name.png',
			$file->get()
		);
	}

	// logged in user can view private image
	public function testSuccessShowPrivate(): void {
		// Arrange
		$responseFactory = Mockery::mock(ResponseFactory::class);
		$responseFactory->shouldReceive('file')->once();

		$request = new \Illuminate\Http\Request();

		// Act
		$showAction = new ShowAction($responseFactory);
		$showAction->setRequest($request);
		try {
			$response = $showAction($this->user, $this->img_private, $this->img_private->name);
		} catch (\Exception $e) {
			$response = $e->getMessage();
		}

		// Assert
		$this->assertEquals('Mocked response in testing', $response);
	}

	// logged in another user cannot view private image
	public function testFailShowPrivateByAnotherUser(): void {
		// Arrange
		$responseFactory = Mockery::mock(ResponseFactory::class);
		$responseFactory->shouldReceive('file')->andReturn('mocked private image');

		$request = new \Illuminate\Http\Request();

		// Act & Assert
		$this->expectExceptionMessage('You do not have permission to view this image');

		$showAction = new ShowAction($responseFactory);
		$showAction->setRequest($request);
		$response = $showAction($this->user2, $this->img_private, $this->img_private->name);
	}

	// guest user cannot view private image
	public function testFailShowPrivateByGuestUser(): void {
		// Arrange			
		$responseFactory = Mockery::mock(ResponseFactory::class);
		$responseFactory->shouldReceive('file')->andReturn('mocked private image');

		$request = new \Illuminate\Http\Request();

		// Act & Assert
		$this->expectExceptionMessage('You do not have permission to view this image');

		$showAction = new ShowAction($responseFactory);
		$showAction->setRequest($request);
		$showAction(null, $this->img_private, $this->img_private->name);
	}

	// pdf converter view private image
	public function testSuccessShowPrivateByPdfConverter(): void {
		// Arrange
		$responseFactory = Mockery::mock(ResponseFactory::class);
		$responseFactory->shouldReceive('file')->once();

		$request = new \Illuminate\Http\Request();
		$request->headers->set('X-Custom-Source', 'pdf-converter');
		$request->headers->set('host', 'localhost');

		// Act
		$showAction = new ShowAction($responseFactory);
		$showAction->setRequest($request);
		try {
			$response = $showAction($this->user, $this->img_private, $this->img_private->name);
		} catch (\Exception $e) {
			$response = $e->getMessage();
		}

		// Assert
		$this->assertEquals('Mocked response in testing', $response);
	}


	// private user can view guest image
	public function testSuccessShowGuestByPrivate(): void {
		// Arrange
		$responseFactory = Mockery::mock(ResponseFactory::class);
		$responseFactory->shouldReceive('file')->once();

		$request = new \Illuminate\Http\Request();

		// Act
		$showAction = new ShowAction($responseFactory);
		$showAction->setRequest($request);
		try {
			$response = $showAction($this->user, $this->img_guest, $this->img_guest->name);
		} catch (\Exception $e) {
			$response = $e->getMessage();
		}

		// Assert
		$this->assertEquals('Mocked response in testing', $response);
	}

	// guest user can view guest image
	public function testSuccessShowGuestByGuest(): void {
		// Arrange
		$responseFactory = Mockery::mock(ResponseFactory::class);
		$responseFactory->shouldReceive('file')->once();

		$request = new \Illuminate\Http\Request();

		// Act
		$showAction = new ShowAction($responseFactory);
		$showAction->setRequest($request);
		try {
			$response = $showAction(null, $this->img_guest, $this->img_guest->name);
		} catch (\Exception $e) {
			$response = $e->getMessage();
		}

		// Assert
		$this->assertEquals('Mocked response in testing', $response);
	}
}
