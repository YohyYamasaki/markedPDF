<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\AuthManager;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\JsonResponse;

class EmailVerificationController extends Controller {
    /**
     * @param EmailVerificationRequest $request
     * @return JsonResponse
     * @throws AuthenticationException
     */
    public function __invoke(EmailVerificationRequest $request): JsonResponse {
        $request->fulfill();
        return response()->json(['message' => 'Email verified successfully']);
    }
}
