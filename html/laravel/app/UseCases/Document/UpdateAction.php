<?php

declare(strict_types=1);

namespace App\UseCases\Document;

use App\Models\Document;
use App\Models\User;
use Exception;

class UpdateAction {
	public function __invoke(User $user, Document $document, string | null $title, string | null $content): Document {
		assert($document->exists);

		if (!$user->can('update', $document)) {
			abort(403, 'You do not have permission to update this document');
		}

		try {
			$document->save();
		} catch (Exception $e) {
			abort(422, 'Failed to update the document');
		}

		$document->title = $title;
		$document->content = $content;
		$document->save();

		return $document;
	}
}
