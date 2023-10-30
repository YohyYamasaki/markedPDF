<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Intervention\Image\ImageManager;
use Intervention\Image\Image;

class ImageProcessor {

	protected ImageManager $imageManager;

	/**
	 * ImageProcessor constructor.
	 * @param ImageManager $imageManager
	 */
	public function __construct(ImageManager $imageManager) {
		$this->imageManager = $imageManager;
	}

	public function process(UploadedFile $imageFile): Image {
		$image = $this->imageManager->make($imageFile->getRealPath());

		// Resize the image if the width is greater than 960px
		if ($image->width() > 960) {
			$image->resize(960, null, function ($constraint) {
				$constraint->aspectRatio();
			});
		}

		// Convert the image to jpg
		$image->encode('jpg');

		return $image;
	}
}
