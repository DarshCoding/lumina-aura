<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    private const MAX_BYTES = 10 * 1024 * 1024;

    private const ALLOWED_MIMES = [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/webp',
        'image/gif',
        'image/svg+xml',
    ];

    public function store(Request $request): JsonResponse
    {
        $file = $this->resolveFile($request);
        if ($file instanceof JsonResponse) {
            return $file;
        }

        $ext = $file->getClientOriginalExtension() ?: 'jpg';
        $name = time().'-'.Str::random(8).'.'.$ext;
        $dir = public_path('uploads');

        if (! is_dir($dir) && ! mkdir($dir, 0755, true) && ! is_dir($dir)) {
            return response()->json(['error' => 'Upload directory is not writable'], 500);
        }

        $file->move($dir, $name);

        return response()->json(['url' => '/uploads/'.$name]);
    }

    public function hamperLogo(Request $request): JsonResponse
    {
        $file = $this->resolveFile($request, 2 * 1024 * 1024);
        if ($file instanceof JsonResponse) {
            return $file;
        }

        $ext = $file->getClientOriginalExtension() ?: 'png';
        $name = 'logo-'.time().'-'.Str::random(8).'.'.$ext;
        $dir = public_path('uploads/logos');

        if (! is_dir($dir) && ! mkdir($dir, 0755, true) && ! is_dir($dir)) {
            return response()->json(['error' => 'Upload directory is not writable'], 500);
        }

        $file->move($dir, $name);

        return response()->json(['url' => '/uploads/logos/'.$name]);
    }

    private function resolveFile(Request $request, int $maxBytes = self::MAX_BYTES): UploadedFile|JsonResponse
    {
        $contentLength = (int) $request->server('CONTENT_LENGTH', 0);
        $postMax = $this->iniBytes(ini_get('post_max_size'));

        if (! $request->hasFile('file') && $contentLength > 0 && $postMax > 0 && $contentLength > $postMax) {
            return response()->json([
                'error' => 'Image is too large for the server (max '. $this->formatBytes($postMax).'). Try a smaller file.',
            ], 400);
        }

        if (! $request->hasFile('file')) {
            $uploaded = $request->file('file');
            if ($uploaded instanceof UploadedFile && ! $uploaded->isValid()) {
                return response()->json(['error' => $this->uploadErrorMessage($uploaded, $maxBytes)], 400);
            }

            return response()->json(['error' => 'No file received. Choose an image and try again.'], 400);
        }

        $file = $request->file('file');
        if (! $file->isValid()) {
            return response()->json(['error' => $this->uploadErrorMessage($file, $maxBytes)], 400);
        }

        $mime = $file->getMimeType() ?: '';
        if (! in_array($mime, self::ALLOWED_MIMES, true)) {
            return response()->json(['error' => 'Please upload a PNG, JPG, WebP, GIF, or SVG image'], 400);
        }

        $iniUploadMax = $this->iniBytes(ini_get('upload_max_filesize'));
        $limit = min($maxBytes, $iniUploadMax > 0 ? $iniUploadMax : $maxBytes);

        if ($file->getSize() > $limit) {
            return response()->json([
                'error' => 'Image must be under '.$this->formatBytes($limit),
            ], 400);
        }

        return $file;
    }

    private function uploadErrorMessage(UploadedFile $file, int $maxBytes): string
    {
        $iniUploadMax = $this->iniBytes(ini_get('upload_max_filesize'));
        $limit = min($maxBytes, $iniUploadMax > 0 ? $iniUploadMax : $maxBytes);

        return match ($file->getError()) {
            UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE => 'Image must be under '.$this->formatBytes($limit),
            UPLOAD_ERR_PARTIAL => 'Upload was interrupted. Please try again.',
            UPLOAD_ERR_NO_FILE => 'No file received. Choose an image and try again.',
            UPLOAD_ERR_NO_TMP_DIR, UPLOAD_ERR_CANT_WRITE => 'Server could not store the upload. Check disk permissions.',
            default => 'Upload failed. Please try another image.',
        };
    }

    private function iniBytes(string|false $value): int
    {
        if ($value === false || $value === '') {
            return 0;
        }

        $value = trim($value);
        $unit = strtolower(substr($value, -1));
        $number = (float) $value;

        return (int) match ($unit) {
            'g' => $number * 1024 * 1024 * 1024,
            'm' => $number * 1024 * 1024,
            'k' => $number * 1024,
            default => $number,
        };
    }

    private function formatBytes(int $bytes): string
    {
        if ($bytes >= 1024 * 1024) {
            $mb = $bytes / (1024 * 1024);
            $formatted = rtrim(rtrim(number_format($mb, 1, '.', ''), '0'), '.');

            return $formatted.'MB';
        }

        return max(1, (int) round($bytes / 1024)).'KB';
    }
}
