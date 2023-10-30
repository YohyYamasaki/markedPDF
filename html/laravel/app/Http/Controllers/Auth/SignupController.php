<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\SignupRequest;
use App\Models\User;
use Illuminate\Auth\AuthManager;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;


class SignupController extends Controller {

    /**
     * @param AuthManager $auth
     */
    public function __construct(
        private readonly AuthManager $auth,
    ) {
    }

    /**
     * @param SignupRequest $request
     * @return JsonResponse
     */
    public function __invoke(SignupRequest $request): JsonResponse {
        // Extract validated data from the request
        $data = $request->validated();

        // Create the user
        $user = new User();
        $user->name = $data['name'];
        $user->email = $data['email'];
        $user->password = Hash::make($data['password']);
        $user->save();

        // Emit the registered event which triggers the email verification
        event(new Registered($user));

        // Auto-login the user after registration
        $this->auth->guard()->login($user);

        // To avoid session fixation
        $request->session()->regenerate();

        return new JsonResponse([
            'message' => 'Registered and Authenticated. Verification link sent.',
        ]);
    }
}