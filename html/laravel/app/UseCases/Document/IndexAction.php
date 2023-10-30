<?php

declare(strict_types=1);

namespace App\UseCases\Document;

use App\Models\User;
use Exception;
use Illuminate\Support\Collection;

class IndexAction {
	public function __invoke(User $user): Collection {
		assert($user->exists);

		try {
			$documents_list = $user->documents()
				->orderBy('updated_at', 'desc')
				->get()
				->map(function ($document) {
					return [
						'id' => $document->id,
						'title' => $document->title,
					];
				});
		} catch (Exception $e) {
			abort(422, 'Failed to retrieve the documents');
		}
		return $documents_list;
	}
}
