<?php

namespace App\Console\Commands;

use App\Models\Image;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class DeleteOldGuestImages extends Command {
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'images:delete-old-guest';
    protected $description = 'Delete guest images that are more than a week old';

    public function handle(): void {
        $cutOff = now()->subWeek();

        $imagesToDelete = Image::whereNull('user_id')
            ->where('created_at', '<', $cutOff)
            ->get();

        foreach ($imagesToDelete as $image) {
            // Delete image from the strage
            Storage::disk('public')->delete(str_replace(asset('storage/'), '', $image->name));

            // Delete image from the database
            $image->delete();
        }

        $this->info(count($imagesToDelete) . ' guest images deleted.');
    }
}
