<?php

namespace App\Console\Commands;

use App\Models\Image;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class DeleteOldUserImages extends Command {
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'images:delete-old-user';
    protected $description = 'Delete user images that haven\'t been viewed in over half a year';

    public function handle(): void {
        $cutOff = now()->subMonths(12);

        $imagesToDelete = Image::whereNotNull('user_id')
            ->where('last_viewed_at', '<', $cutOff)
            ->get();

        foreach ($imagesToDelete as $image) {
            // Delete image from the strage
            Storage::disk('public')->delete(str_replace(asset('storage/'), '', $image->name));

            // Delete image from the database
            $image->delete();
        }

        $this->info(count($imagesToDelete) . ' user images deleted due to inactivity.');
    }
}
