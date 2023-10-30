<?php

declare(strict_types=1);

namespace App\UseCases\User;

use App\Models\User;
use Exception;

class UpdateAction {
	public function __invoke(User $user, string $name = null): User {
		assert($user->exists);
		try {
			if ($name) $user->name = $name;
			$user->save();
		} catch (Exception $e) {
			throw new Exception('Failed to update the user data');
		}

		return $user;
	}
}
