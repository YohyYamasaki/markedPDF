<?php

declare(strict_types=1);

namespace Tests\Feature\Http\Controllers\Api\Pdf;

use App\Models\ConvertCount;
use Illuminate\Support\Facades\Http;
use Mockery;
use Tests\TestCase;
use \App\UseCases\Pdf\PdfAction;

final class PdfControllerTest extends TestCase {
	public function setUp(): void {
		parent::setUp();

		// Create a ConvertCount record with id=1
		ConvertCount::create([
			'id' => 1,
			'count' => 0,
		]);
	}


	public function testInvokeReturnsPdfResponse() {
		// Arrange
		$fakeResponseBody = 'PDF_CONTENT';
		$fakeResponseCode = 200;
		Http::fake([
			'*' => Http::response($fakeResponseBody, $fakeResponseCode, ['Content-Type' => 'application/pdf']),
		]);

		$data = ['html' => 'html content', 'style' => null];
		$converter_url = 'http://host.docker.internal:3000/pdf-converter';
		$pdfAction = new PdfAction();

		// Act
		$response = $pdfAction($data, $converter_url);

		// Assert
		$this->assertEquals($fakeResponseCode, $response->getStatusCode());
		$this->assertEquals($fakeResponseBody, $response->getContent());
		$this->assertEquals('application/pdf', $response->headers->get('Content-Type'));
	}

	public function testInvokeHandlesException() {
		// Arrange
		Http::fake([
			'*' => Http::response('Error in conversion. Please try again later.', 500),
		]);

		$data = ['html' => 'html content', 'style' => null];
		$converter_url = 'http://host.docker.internal:3000/pdf-converter';
		$pdfAction = new PdfAction();

		// Act and Assert
		$response = $pdfAction($data, $converter_url);
		$this->assertEquals(500, $response->getStatusCode());
	}
}
