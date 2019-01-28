<?php

namespace App\Http\Middleware;

use App\ApiKey;
use Closure;

class ApiKeyRequired
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \Closure                 $next
     *
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if (!$request->has('key')) {
            return response()->json(['message' => 'API request requires valid key to identify yourself.'], 400);
        }

        if (ApiKey::whereKey($request->get('key'))) {
            return response()->json(['message' => 'The given API key is invalid.'], 401);
        }

        return $next($request);
    }
}