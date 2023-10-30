<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail as VerifyEmailBase;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\URL;

class CustomVerifyEmail extends VerifyEmailBase {
    /**
     * Build the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable) {
        $verificationUrl = $this->verificationUrl($notifiable);

        // Get 'expires' and 'signature' from the original verification URL
        $urlComponents = parse_url($verificationUrl);
        parse_str($urlComponents['query'], $queryParams);
        $expires = $queryParams['expires'] ?? '';
        $signature = $queryParams['signature'] ?? '';

        // Create SPA verification URL
        $spaUrl = env('APP_URL') . '/verify-email';
        $spaUrl .= '?id=' . $notifiable->getKey();
        $spaUrl .= '&hash=' . sha1($notifiable->getEmailForVerification());
        $spaUrl .= '&expires=' . $expires;
        $spaUrl .= '&signature=' . $signature;
        return (new MailMessage)
            ->subject('Please verify your email address')
            ->line('Please verify your email address by clicking on the link below.')
            ->action('Verify Email Address', $spaUrl)
            ->line('If you did not create an account, no further action is required.');
    }

    /**
     * Get the verification URL for the given notifiable.
     *
     * @param  mixed  $notifiable
     * @return string
     */
    protected function verificationUrl($notifiable) {
        return URL::temporarySignedRoute(
            'verification.verify',
            Carbon::now()->addMinutes(Config::get('auth.verification.expire', 60)),
            [
                'id' => $notifiable->getKey(),
                'hash' => sha1($notifiable->getEmailForVerification()),
            ]
        );
    }
}
