<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Document\StoreRequest;
use App\Http\Requests\Document\UpdateRequest;
use App\Http\Resources\DocumentResource;
use App\Models\Document;
use App\Services\HtmlSanitizer;
use App\UseCases\Document\DestroyAction;
use App\UseCases\Document\IndexAction;
use App\UseCases\Document\ShowAction;
use Exception;
use Illuminate\Http\Request;
use App\UseCases\Document\StoreAction;
use App\UseCases\Document\UpdateAction;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Collection;

class DocumentController extends Controller {

    public function __construct() {
        $this->middleware('auth:api');
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, IndexAction $action): Collection {
        $user = $request->user();
        return $action($user);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request, StoreAction $action, HtmlSanitizer $sanitizer): DocumentResource {
        try {
            $validated = $request->validated();
            $user = $request->user();
            $title = $validated['title'];
            $content = "";
            if ($validated['content']) {
                $content = $sanitizer->sanitize($validated['content']);
            }

            $document = new Document([
                'user_id' => $user->id,
                'title' => $title,
                'content' => $content,
            ]);

            return new DocumentResource($action($user, $document), 'Document created successfully');
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, string $id, ShowAction $action): DocumentResource {
        try {
            $document = Document::findOrFail($id);
            return new DocumentResource($action($request->user(), $document));
        } catch (ModelNotFoundException $e) {
            abort(404, 'Document not found');
        }
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequest $request, string $id, HtmlSanitizer $sanitizer, UpdateAction $action): DocumentResource {
        try {
            $validated = $request->validated();
            $user = $request->user();
            $title = $validated['title'];
            $content = $sanitizer->sanitize($validated['content']);
            $document = Document::findOrFail($id);

            return new DocumentResource($action($user, $document, $title, $content), 'Document updated successfully');
        } catch (ModelNotFoundException $e) {
            abort(404, 'Document not found');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id, DestroyAction $action): DocumentResource {
        try {
            $document = Document::findOrFail($id);
            return new DocumentResource($action($request->user(), $document), 'Document deleted successfully');
        } catch (ModelNotFoundException $e) {
            abort(404, 'Document not found');
        }
    }
}
