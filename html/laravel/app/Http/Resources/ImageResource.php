<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ImageResource extends JsonResource {
    /**
     * Transform the resource into an array.
     *
     * @return array<string, string>
     */
    public function toArray($request): array {
        return [
            'id' => $this->resource->id,
            'name' => $this->resource->name,
        ];
    }
}
