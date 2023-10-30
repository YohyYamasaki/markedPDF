<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class DocumentResource extends JsonResource {
	protected string | null $message;

	public function __construct($resource, string | null $message = null) {
		parent::__construct($resource);
		$this->message = $message;
	}

	public function toArray($request): array {
		return [
			'id' => $this->resource->id,
			'title' => $this->resource->title,
			'content' => $this->resource->content,
			'images' => ImageResource::collection($this->resource->images),
		];
	}

	public function with($request) {
		return ['message' => $this->message];
	}
}
