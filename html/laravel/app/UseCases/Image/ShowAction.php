<?php

declare(strict_types=1);

namespace App\UseCases\Image;

use App\Models\Image;
use App\Models\User;
use Exception;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Support\Facades\Storage;
use \Symfony\Component\HttpFoundation\BinaryFileResponse;
use Illuminate\Http\Request;

class ShowAction {

	private Request $request;

	public function __construct(private ResponseFactory $responseFactory) {
	}

	public function setRequest(Request $request): void {
		$this->request = $request;
	}

	private function isFromConverter(): bool {
		$userAgent = $this->request->header('User-Agent');
		return $userAgent === env('PDF_CONVERTER_CUSTOM_USER_AGENT');
	}

	public function __invoke(User | null $user, Image $image, string $name): BinaryFileResponse {
		assert($image->exists);

		// allow all access from pdf converter
		if ($this->isFromConverter()) {
			try {
				return $this->responseFactory->file(Storage::path('uploads/images/' . $name));
			} catch (\TypeError $e) {
				throw new \Exception('Mocked response in testing in pdf converter');
			} catch (Exception $e) {
				abort(404, 'Image not found');
			}
		}

		// not logged in & image has no document id = public image
		if (!$user && !$image->document_id) {
			try {
				return $this->responseFactory->file(Storage::path('uploads/images/' . $name));
			} catch (\TypeError $e) {
				throw new \Exception('Mocked response in testing');
			} catch (Exception $e) {
				abort(404, 'Image not found');
			}
		}
		// not logged in & image has document id = cannot view private image from guest
		else if (!$user) {
			abort(403, 'You do not have permission to view this image');
		}
		// logged in but cannot has permission = cannot view private image from another user
		else if (!$user->can('view', $image)) {
			// Check if the user has permission for viewing it
			abort(403, 'You do not have permission to view this image');
		}

		// logged in & has permission = can view private image
		try {
			// return image file
			return $this->responseFactory->file(Storage::path('uploads/images/' . $name));
		} catch (\TypeError $e) {
			throw new \Exception('Mocked response in testing');
		} catch (Exception $e) {
			abort(404, 'Image not found');
		}
	}
}
