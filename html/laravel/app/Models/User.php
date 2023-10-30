<?php

namespace App\Models;

use App\Notifications\CustomResetPasswordNotification;
use App\Notifications\CustomVerifyEmail;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable implements MustVerifyEmail {
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];


    public function sendPasswordResetNotification($token) {
        $this->notify(new CustomResetPasswordNotification($token));
    }

    public function sendEmailVerificationNotification() {
        $this->notify(new CustomVerifyEmail());
    }

    public function images(): HasMany {
        return $this->hasMany(Image::class);
    }

    public function documents(): HasMany {
        return $this->hasMany(Document::class);
    }

    /**
     * Check if the user's email is verified.
     *
     * @return bool
     */
    public function hasVerifiedEmail(): bool {
        return !is_null($this->email_verified_at);
    }
}
