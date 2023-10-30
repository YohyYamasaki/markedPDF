<?php

declare(strict_types=1);

namespace App\UseCases\Document;

use App\Models\Document;
use App\Models\Image;
use App\Models\User;
use Exception;

class ShowAction {
	public function __invoke(User $user, Document $document): Document {
		assert($document->exists);

		// Check if the user has permission for viewing it
		if (!$user->can('view', $document)) {
			abort(422, 'You do not have permission to view this document');
		}

		// Set last_viewed_at in each image to now
		try {
			$document->images()->each(function (Image $image) {
				$image->last_viewed_at = now()->toDateTimeString();
				$image->save();
			});
		} catch (Exception $e) {
			abort(422, 'Failed to save the document');
		}

		return $document;
	}
}
