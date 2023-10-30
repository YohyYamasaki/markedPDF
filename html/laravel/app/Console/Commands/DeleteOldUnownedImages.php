<?php

namespace App\Console\Commands;

use App\Models\Image;
use Carbon\Carbon;
use Illuminate\Console\Command;

class DeleteOldUnownedImages extends Command {
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:delete-old-unowned-images';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle(): void {
        $oneWeekAgo = Carbon::now()->subWeek();

        Image::where('user_id', null)
            ->where('created_at', '<', $oneWeekAgo)
            ->delete();

        $this->info('Old unowned images deleted successfully.');
    }
}
