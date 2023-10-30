<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\AuthManager;
use Illuminate\Http\JsonResponse;

class IsAuthenticatedController extends Controller {
	/**
	 * @param AuthManager $auth
	 */
	public function __construct(
		private readonly AuthManager $auth,
	) {
	}

	/**
	 * @return JsonResponse
	 * @throws AuthenticationException
	 */
	public function __invoke(): JsonResponse {
		$authState = $this->auth->guard()->check();
		return response()->json(
			['isAuthenticated' => $authState],
			$authState ? 200 : 401
		);
	}
}
