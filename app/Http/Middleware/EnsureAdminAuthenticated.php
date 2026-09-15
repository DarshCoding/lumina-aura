<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdminAuthenticated
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->session()->get('la_admin_session') !== 'authenticated') {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $next($request);
    }
}
