<?php

declare(strict_types=1);

namespace Tests\Services;

use App\Services\ImageProcessor;
use Illuminate\Http\UploadedFile;
use Intervention\Image\ImageManager;
use Tests\TestCase;

class ImageProcessorTest extends TestCase {
	protected ImageProcessor $imageProcessor;

	protected function setUp(): void {
		parent::setUp();
		$this->imageProcessor = new ImageProcessor(new ImageManager());
	}

	public function testProcessWidthLessThan960() {
		$imageFile = UploadedFile::fake()->image('test.jpg', 800, 600);

		$processedImage = $this->imageProcessor->process($imageFile);

		$this->assertEquals(800, $processedImage->width());
		$this->assertEquals(600, $processedImage->height());
	}

	public function testProcessWidthGreaterThan960() {
		$imageFile = UploadedFile::fake()->image('test.jpg', 1200, 900);

		$processedImage = $this->imageProcessor->process($imageFile);

		$this->assertEquals(960, $processedImage->width());
		$this->assertTrue($processedImage->height() <= 900);
	}

	public function testProcessEncodingToJpg() {
		$imageFile = UploadedFile::fake()->image('test.png');

		$processedImage = $this->imageProcessor->process($imageFile);

		$this->assertEquals('jpg', $processedImage->extension);
	}
}
