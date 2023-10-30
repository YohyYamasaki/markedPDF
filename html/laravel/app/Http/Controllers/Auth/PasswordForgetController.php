<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\PasswordForgetRequest;
use App\UseCases\Auth\PasswordForgetAction;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Password;

class PasswordForgetController extends Controller {
    /**
     * @param PasswordForgetRequest $request
     * @return JsonResponse
     */    // for sinle action controller
    public function __invoke(PasswordForgetRequest $request, PasswordForgetAction $action): JsonResponse {
        $validated = $request->validated();
        $status = $action($validated);
        if ($status) {
            return response()->json(['message' => __($status)], 200);
        } else {
            return response()->json(['message' => __($status)], 400);
        }
    }
}