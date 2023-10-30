<?php

namespace App\UseCases\Auth;

use Illuminate\Support\Facades\Password;

class PasswordResetAction {
	public function __invoke(mixed $validated): string {
		$status = Password::reset(
			[
				'email' => $validated['email'],
				'password' => $validated['password'],
				'token' => $validated['token']
			],
			function ($user, $password) {
				$user->forceFill([
					'password' => bcrypt($password)
				])->save();
			}
		);
		return $status;
	}
}
