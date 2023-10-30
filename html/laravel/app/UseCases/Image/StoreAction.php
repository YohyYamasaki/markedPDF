<?php

declare(strict_types=1);


namespace App\UseCases\Image;

use App\Models\Document;
use App\Models\Image;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Storage;
use \Intervention\Image\Image as InterventionImage;

class StoreAction {

	protected function checkDocumentOwnership(int $userId, int $documentId): void {
		$document = Document::findOrFail($documentId);
		if ($document->user_id !== $userId) {
			abort(400, 'You do not own the specified document');
		}
	}

	protected function checkImageLimit(int $documentId): void {
		$imageCount = Image::where('document_id', $documentId)->count();
		if ($imageCount >= 20) {
			abort(400, 'You cannot upload more than 20 images per document');
		}
	}

	public function __invoke(User | null $user, Image $image, InterventionImage $imageFile, string $uploadDir, string $fileName): Image {
		$documentId = $image->document_id;

		if ($documentId !== null) {
			if ($user === null) {
				abort(400, 'You must be logged in to upload images to a document');
			}
			// Check if the user owns the document
			$this->checkDocumentOwnership($user->id, (int)$documentId);
			// Check if the image limit has been reached for the document
			$this->checkImageLimit((int)$documentId);
		}

		try {
			// store image file
			Storage::disk('local')->put($uploadDir . '/' . $fileName, (string) $imageFile);
			// save image data
			$image->save();
		} catch (Exception $e) {
			abort(400, 'Failed to save the image');
		}

		return $image;
	}
}
