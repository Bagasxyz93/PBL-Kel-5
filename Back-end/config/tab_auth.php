<?php

define('TAB_AUTH_SECRET', 'SIIN_SECRET_2026_R4nd0m_Kunci_Aman_9283746501');

function buatTokenTab($user) {

    $payload = [
        'user_id' => (int) $user['id'],
        'role' => $user['role'],
        'exp' => time() + 28800
    ];

    $data = rtrim(strtr(
        base64_encode(json_encode($payload)),
        '+/',
        '-_'
    ), '=');

    $signature = hash_hmac(
        'sha256',
        $data,
        TAB_AUTH_SECRET
    );

    return $data . '.' . $signature;
}

function validasiTokenTab($token) {

    $parts = explode('.', $token);

    if (count($parts) !== 2) {
        return false;
    }

    [$data, $signature] = $parts;

    $expected = hash_hmac(
        'sha256',
        $data,
        TAB_AUTH_SECRET
    );

    if (!hash_equals($expected, $signature)) {
        return false;
    }

    $decoded = strtr($data, '-_', '+/');

    $decoded .= str_repeat(
        '=',
        (4 - strlen($decoded) % 4) % 4
    );

    $payload = json_decode(
        base64_decode($decoded),
        true
    );

    if (
        !$payload ||
        !isset($payload['user_id'], $payload['role'], $payload['exp']) ||
        $payload['exp'] < time()
    ) {
        return false;
    }

    return $payload;
}

function ambilUserToken() {

    $headers = getallheaders();
    $authorization = $headers['Authorization'] ?? '';

    if (!preg_match('/Bearer\s+(.+)/i', $authorization, $matches)) {
        return false;
    }

    return validasiTokenTab(trim($matches[1]));
}