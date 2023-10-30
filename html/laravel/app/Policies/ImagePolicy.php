<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Image;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Support\Facades\Response;

class ImagePolicy {
    use HandlesAuthorization;

    /**
     * Determine if the given image can be viewed by the user.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Image $image
     * @return bool
     */
    public function view(?User $user, Image $image): bool {
        if (!$user) return is_null($image->user_id);
        return is_null($image->user_id) || $image->user_id == $user->id;
    }
    /**
     * Determine if the given image can be created by the user.
     *
     * @param  \App\Models\User  $user
     * @return bool
     */
    public function create(?User $user) {
        return true;
    }

    public function delete(User $user, Image $image): bool {
        return $user->id === $image->user_id;
    }
}