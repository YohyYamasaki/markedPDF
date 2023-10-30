<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Image\StoreRequest;
use App\Http\Resources\ImageResource;
use App\Models\Image;
use App\Services\ImageProcessor;
use App\UseCases\Image\DestroyAction;
use App\UseCases\Image\StoreAction;
use App\UseCases\Image\ShowAction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\BinaryFileResponse;


class ImageController extends Controller {

	public function show(Request $request, string $id, ShowAction $action): BinaryFileResponse {
		$image = Image::findOrFail($id);
		$name = $request->route('name');
		$action->setRequest($request);

		Log::info($request->user());

		return $action($request->user(), $image, $name);
	}


	public function store(StoreRequest $request, ImageProcessor $imageProcessor, StoreAction $action): ImageResource {
		$user = $request->user();
		$validated = $request->validated();
		$imageFile = $imageProcessor->process($validated['image']);
		// Set the upload directory and file name
		$uploadDir = 'uploads/images';
		$fileName = date('Y-m-d-H-i-s') . Str::random(10) . '-image.jpg';

		// if user is logged in, save the image to the database with user id and document id
		$image = new Image([
			'user_id' => $user ? $user->id : null,
			'document_id' => $request->has(['document_id']) ? $validated['document_id'] : null,
			'name' => $fileName,
			'last_viewed_at' => now(),
		]);

		return new ImageResource($action($user, $image, $imageFile, $uploadDir, $fileName));
	}


	public function destroy(Request $request, string $id, DestroyAction $action): ImageResource {
		$uploadDir = 'uploads/images';
		$image = Image::findOrFail($id);
		return new ImageResource($action($request->user(), $image, $uploadDir));
	}
}
