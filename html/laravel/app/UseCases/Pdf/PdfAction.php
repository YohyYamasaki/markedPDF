<?php

namespace App\UseCases\Pdf;

use App\Models\ConvertCount;
use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Response;

class PdfAction {
	public function __invoke(array $data, string $converter_url): Response {
		$apiKey = env('PDF_CONVERTER_API_KEY');
		$convertCount = ConvertCount::findOrFail(1);

		try {
			$clientResponse = Http::timeout(60)
				->contentType('application/json')
				->withHeaders([
					'Authorization' => $apiKey
				])
				->post($converter_url, $data);

			$content = $clientResponse->body();
			$statusCode = $clientResponse->status();
			$headers = [
				'Content-Type' => 'application/pdf',
			];

			// update convert count
			$convertCount->count = $convertCount->count + 1;
			$convertCount->save();

			return new Response($content, $statusCode, $headers);
		} catch (Exception $e) {
			abort(500, 'Error in conversion. Please try again later.');
		}
	}
}
