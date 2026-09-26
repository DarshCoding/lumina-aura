<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PageSection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PageContentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = PageSection::query()->orderBy('page')->orderBy('sort_order');

        if ($page = $request->query('page')) {
            $query->where('page', $page);
        }

        $sections = $query->get()->map(fn (PageSection $s) => $s->toApiArray());

        return response()->json($sections);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $section = PageSection::query()->find($id);
        if (! $section) {
            return response()->json(['error' => 'Not found'], 404);
        }

        $section->fill([
            'eyebrow' => $request->input('eyebrow'),
            'title' => $request->input('title'),
            'body' => $request->input('body'),
            'body_secondary' => $request->input('bodySecondary'),
            'image_url' => $request->input('imageUrl'),
            'cta_label' => $request->input('ctaLabel'),
            'cta_href' => $request->input('ctaHref'),
            'cta_secondary_label' => $request->input('ctaSecondaryLabel'),
            'cta_secondary_href' => $request->input('ctaSecondaryHref'),
            'meta' => is_array($request->input('meta')) ? $request->input('meta') : ($section->meta ?? []),
        ]);
        $section->save();

        return response()->json($section->fresh()->toApiArray());
    }

    public function bulkUpdate(Request $request): JsonResponse
    {
        $items = $request->input('sections');
        if (! is_array($items) || $items === []) {
            return response()->json(['error' => 'No sections provided'], 400);
        }

        $updated = DB::transaction(function () use ($items) {
            $result = [];
            foreach ($items as $item) {
                $id = $item['id'] ?? null;
                if (! $id) {
                    continue;
                }

                $section = PageSection::query()->find($id);
                if (! $section) {
                    continue;
                }

                $section->fill([
                    'eyebrow' => $item['eyebrow'] ?? null,
                    'title' => $item['title'] ?? null,
                    'body' => $item['body'] ?? null,
                    'body_secondary' => $item['bodySecondary'] ?? null,
                    'image_url' => $item['imageUrl'] ?? null,
                    'cta_label' => $item['ctaLabel'] ?? null,
                    'cta_href' => $item['ctaHref'] ?? null,
                    'cta_secondary_label' => $item['ctaSecondaryLabel'] ?? null,
                    'cta_secondary_href' => $item['ctaSecondaryHref'] ?? null,
                    'meta' => is_array($item['meta'] ?? null) ? $item['meta'] : ($section->meta ?? []),
                ]);
                $section->save();
                $result[] = $section->fresh()->toApiArray();
            }

            return $result;
        });

        return response()->json($updated);
    }
}
