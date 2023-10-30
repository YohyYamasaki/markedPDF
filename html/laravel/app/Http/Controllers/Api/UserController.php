<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\UserUpdateRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\UseCases\User\DestroyAction;
use App\UseCases\User\UpdateAction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller {
    /**
     * Display the user's data.
     */
    public function show(Request $request): UserResource {
        $user = $request->user();
        return new UserResource($user);
    }

    /**
     * Update the user's data.
     */
    public function update(UserUpdateRequest $request, UpdateAction $action): UserResource {
        $user = $request->user();
        $validated = $request->validated();
        isset($validated['name']) ? $name = $validated['name'] : $name = null;
        return new UserResource(
            $action($user, $name),
            'User data updated successfully.'
        );
    }

    /**
     * Delete the user.
     */
    public function destroy(Request $request, DestroyAction $action): UserResource {
        $user = $request->user();
        return new UserResource($action($user), 'User data deleted successfully.');
    }
}
