<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Illuminate\Http\JsonResponse;

class CustomSignedAndAuth {

    public function handle(Request $request, Closure $next): JsonResponse {
        // Checking if the URL has a valid signature.
        if (!URL::hasValidSignature($request)) {
            return response()->json(['message' => 'Invalid signature.']);
        }

        // Checking if the user's email is already verified.
        if ($request->user() && $request->user()->hasVerifiedEmail()) {
            return response()->json(['message' => 'Already verified.']);
        }

        // Checking if the user is already logged in.  
        if (!auth()->check()) {
            return response()->json(['message' => 'Not logged in.']);
        }

        return $next($request);
    }
}
