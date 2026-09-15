<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        if (! $request->hasFile('file')) {
            return response()->json(['error' => 'No file'], 400);
        }

        $file = $request->file('file');
        $ext = $file->getClientOriginalExtension() ?: 'jpg';
        $name = time().'-'.Str::random(8).'.'.$ext;

        $file->move(public_path('uploads'), $name);

        return response()->json(['url' => '/uploads/'.$name]);
    }

    public function hamperLogo(Request $request): JsonResponse
    {
        if (! $request->hasFile('file')) {
            return response()->json(['error' => 'No file'], 400);
        }

        $file = $request->file('file');
        $allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];

        if (! in_array($file->getMimeType(), $allowed, true)) {
            return response()->json(['error' => 'Please upload a PNG, JPG, WebP, or SVG logo'], 400);
        }

        if ($file->getSize() > 2 * 1024 * 1024) {
            return response()->json(['error' => 'Logo must be under 2MB'], 400);
        }

        $ext = $file->getClientOriginalExtension() ?: 'png';
        $name = 'logo-'.time().'-'.Str::random(8).'.'.$ext;
        $dir = public_path('uploads/logos');

        if (! is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        $file->move($dir, $name);

        return response()->json(['url' => '/uploads/logos/'.$name]);
    }
}
