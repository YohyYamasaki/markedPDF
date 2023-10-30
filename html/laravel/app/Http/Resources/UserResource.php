<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource {
	protected string | null $message;

	public function __construct($resource, string | null $message = null) {
		parent::__construct($resource);
		$this->message = $message;
	}

	public function toArray($request): array {
		return [
			'id' => $this->resource->id,
			'name' => $this->resource->name,
			'email' => $this->resource->email,
			'email_verified_at' => $this->resource->email_verified_at,
		];
	}

	public function with($request) {
		return ['message' => $this->message];
	}
}
