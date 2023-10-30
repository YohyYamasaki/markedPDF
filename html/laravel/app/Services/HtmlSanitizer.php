<?php

declare(strict_types=1);


namespace App\Services;

use HTMLPurifier;
use HTMLPurifier_Config;

class HtmlSanitizer {

	protected HTMLPurifier $purifier;

	public function __construct() {
		$config = HTMLPurifier_Config::createDefault();

		// Allow 'page-break-after' in 'div' tags
		$config->set('CSS.AllowedProperties', ['page-break-after']);

		// Fetch a mutable configuration object
		$config = HTMLPurifier_Config::create($config);

		// Add 'style' attribute to 'div' tag
		$def = $config->getHTMLDefinition(true);
		$def->addAttribute('div', 'style', 'Text');

		$this->purifier = new HTMLPurifier($config);
	}

	public function sanitize(string | null $dirtyContent): string {
		if ($dirtyContent == null) return "";
		return $this->purifier->purify($dirtyContent);
	}
}
