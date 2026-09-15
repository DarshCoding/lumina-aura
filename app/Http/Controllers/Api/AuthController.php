<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    private const ADMIN_USER = 'admin';

    private const ADMIN_PASS = 'lummina2024';

    public function store(Request $request): JsonResponse
    {
        $action = $request->input('action');

        if ($action === 'logout') {
            $request->session()->forget('la_admin_session');

            return response()->json(['ok' => true]);
        }

        $username = $request->input('username');
        $password = $request->input('password');

        if (! $username || ! $password || ! $this->validateCredentials($username, $password)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        $request->session()->put('la_admin_session', 'authenticated');

        return response()->json(['ok' => true]);
    }

    private function validateCredentials(string $username, string $password): bool
    {
        return $username === self::ADMIN_USER && $password === self::ADMIN_PASS;
    }
}
