<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\UseCases\Pdf\PdfAction;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class PdfController extends Controller {
	/**
	 * @param Request $request
	 * @return Response
	 */    // for sinle action controller
	public function __invoke(Request $request, PdfAction $action): Response {
		$html = $request->get('html');
		$style = $request->get('style');
		if (strlen($html) > 11184800) {
			abort(422, 'HTML content must be less than 11184800 characters.');
		}

		$data = ['html' => $html, 'style' => $style];
		$converter_url = 'http://host.docker.internal:3000/pdf-converter';
		$response = $action($data, $converter_url);

		return response($response->getContent(), 200, ['Content-Type' => 'application/pdf']);
	}
}