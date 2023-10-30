<?php

declare(strict_types=1);

namespace Tests\Services;

use App\Services\HtmlSanitizer;
use PHPUnit\Framework\TestCase;

class HtmlSanitizerTest extends TestCase {
	protected HtmlSanitizer $sanitizer;

	protected function setUp(): void {
		parent::setUp();

		$this->sanitizer = new HtmlSanitizer();
	}

	/** @test */
	public function testSanitizeHtmlTags() {
		$dirtyContent = '<script>alert("XSS");</script>';
		$cleanContent = $this->sanitizer->sanitize($dirtyContent);

		$this->assertStringNotContainsString('<script>', $cleanContent);
		$this->assertStringNotContainsString('</script>', $cleanContent);
	}

	/** @test */
	public function testAllowsSafeHtmlTags() {
		$dirtyContent = '<div style="page-break-after: always;"></div>';
		$cleanContent = $this->sanitizer->sanitize($dirtyContent);

		$this->assertStringContainsString('<div style="page-break-after: always;"></div>', $cleanContent);
	}

	/** @test */
	public function testReturnsEmptyStringForNullInput() {
		$cleanContent = $this->sanitizer->sanitize(null);
		$this->assertEquals('', $cleanContent);
	}

	/** @test */
	public function testEncodesSpecialCharacters() {
		$dirtyContent = '<div>"Hello" & \'world\'</div>';
		$cleanContent = $this->sanitizer->sanitize($dirtyContent);
		$this->assertStringContainsString('<div>"Hello" &amp; \'world\'</div>', $cleanContent);
	}
}
