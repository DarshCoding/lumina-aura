<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ config('app.name', 'Lummina Aura') }} — Handcrafted Candles</title>
    <meta name="description" content="Minimalist candle atelier. Hand-poured scents, quiet light, considered vessels.">
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
</head>
<body class="min-h-screen antialiased">
    <div id="root"></div>
</body>
</html>
