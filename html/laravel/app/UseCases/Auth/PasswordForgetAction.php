<?php

namespace App\UseCases\Auth;

use Illuminate\Support\Facades\Password;

class PasswordForgetAction {
	public function __invoke(mixed $validated): string {
		return Password::sendResetLink(['email' => $validated['email']]);
	}
}
