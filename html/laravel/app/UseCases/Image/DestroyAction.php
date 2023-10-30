<?php

declare(strict_types=1);

namespace App\UseCases\Image;

use App\Models\Image;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class DestroyAction {
	public function __invoke(User | null $user, Image $image, String $uploadDir): Image {
		// Check permission
		if ($user === null && $image->user_id !== null) {
			abort(400, 'You must be logged in to delete this image');
		} else if ($user !== null && !$user->can('delete', $image)) {
			abort(400, 'You do not have permission to delete this image');
		}

		try {
			// Delete the physical file from storage
			// Convert the asset URL back to the relative path.
			$imagePath = $uploadDir . $image->name;

			if (Storage::disk('local')->exists($imagePath)) {
				Storage::disk('local')->delete($imagePath);
			}

			// Delete the database record
			$image->delete();
		} catch (Exception $e) {
			abort(400, 'Could not delete the image');
		}

		return $image;
	}
}
