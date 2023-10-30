<?php

declare(strict_types=1);

namespace App\UseCases\Document;

use App\Models\Document;
use App\Models\User;
use Exception;

class StoreAction {
	public function __invoke(User $user, Document $document): Document {

		assert(!$document->exists);

		if (!$user->can('create', $document)) {
			abort(422, 'You do not have permission to store this document');
		}

		// Check if the user already has 10 or more documents
		if ($user->documents()->count() >= 10) {
			abort(422, 'You have reached the maximum number of documents');
		}

		try {
			$document->save();
		} catch (Exception $e) {
			abort(422, 'Failed to save the document');
		}

		return $document;
	}
}
