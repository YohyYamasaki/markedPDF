<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\User as User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class SampleTest extends TestCase {
    use RefreshDatabase;

    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function testExample() {
        User::factory()->create(['name' => 'sample']);
        $this->assertEquals(1, User::where('name', 'sample')->count());
    }
}
