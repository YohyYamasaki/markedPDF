<?php

declare(strict_types=1);


namespace App\UseCases\User;

use App\Models\User;
use Exception;

class DestroyAction {
	public function __invoke(User $user): User {
		assert($user->exists);
		try {
			$user->delete();
		} catch (Exception $e) {
			throw new Exception('Failed to delete the user');
		}
		return $user;
	}
}
