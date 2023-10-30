<?php

declare(strict_types=1);

namespace App\UseCases\Document;

use App\Models\Document;
use App\Models\User;
use Exception;

class DestroyAction {
	public function __invoke(User $user, Document $document): Document {
		assert($document->exists);

		// Check if the user has permission for deleting it
		if (!$user->can('delete', $document)) {
			abort(403, 'You do not have permission to delete this document');
		}
		try {
			// delete the document
			$document->delete();
		} catch (Exception $e) {
			abort(422, 'Failed to delete document');
		}
		return $document;
	}
}
