<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\PasswordResetRequest;
use App\UseCases\Auth\PasswordResetAction;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Password;

class PasswordResetController extends Controller {
    /**
     * @param PasswordResetRequest $request
     * @param PasswordResetAction $action
     * @return JsonResponse
     */
    public function __invoke(PasswordResetRequest $request, PasswordResetAction $action): JsonResponse {
        $validated = $request->validated();
        // reset password
        $status = $action($validated);

        if ($status == Password::PASSWORD_RESET) {
            return response()->json(['message' => __($status)], 200);
        } else {
            return response()->json(['message' => __($status)], 400);
        }
    }
}