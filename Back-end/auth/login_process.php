<?php

require_once '../config/koneksi.php';
require_once '../config/tab_auth.php';

$allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:8000',
    'http://127.0.0.1:8000',
    'http://localhost',
    'http://127.0.0.1',
    'http://100.122.72.0',
];

$frontendUrl = '';

if (!empty($_SERVER['HTTP_ORIGIN'])) {
    $origin = rtrim($_SERVER['HTTP_ORIGIN'], '/');
    if (in_array($origin, $allowedOrigins, true)) {
        $frontendUrl = $origin;
    }
}

if ($frontendUrl === '' && !empty($_SERVER['HTTP_REFERER'])) {
    $parsed = parse_url($_SERVER['HTTP_REFERER']);
    if (!empty($parsed['scheme']) && !empty($parsed['host'])) {
        $refererOrigin = $parsed['scheme'] . '://' . $parsed['host']
            . (!empty($parsed['port']) ? ':' . $parsed['port'] : '');
        if (in_array($refererOrigin, $allowedOrigins, true)) {
            $frontendUrl = $refererOrigin;
        }
    }
}

if ($frontendUrl === '') {
    $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'] ?? '100.122.72.0';
    $fallbackUrl = $scheme . '://' . $host;
    $frontendUrl = in_array($fallbackUrl, $allowedOrigins, true) ? $fallbackUrl : 'http://100.122.72.0';
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: {$frontendUrl}/login.php");
    exit;
}

$username = trim($_POST['username'] ?? '');
$password = $_POST['password'] ?? '';

if ($username === '' || $password === '') {
    header("Location: {$frontendUrl}/?error=empty");
    exit;
}

try {
    $stmt = $pdo->prepare("
        SELECT id, nama, username, password, role
        FROM users
        WHERE username = :username
    ");

    $stmt->execute([':username' => $username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($password, $user['password'])) {
        header("Location: {$frontendUrl}/?error=invalid");
        exit;
    }

    $token = buatTokenTab($user);

    $tujuan = '';

    switch ($user['role']) {
        case 'admin':
            $tujuan = '/pages/Admin/Dashboard.html';
            break;

        case 'mentor':
            $tujuan = '/pages/Mentor/Dashboard.html';
            break;

        case 'peserta':
            $tujuan = '/pages/Siswa/Dashboard.html';
            break;

        default:
            header("Location: {$frontendUrl}/?error=role");
            exit;
    }

    // Token, nama, dan role dikirim ke halaman tujuan untuk disimpan per tab.
    header(
        "Location: {$frontendUrl}/auth-redirect.html"
        . "#token=" . urlencode($token)
        . "&tujuan=" . urlencode($tujuan)
        . "&nama=" . urlencode($user['nama'])
        . "&role=" . urlencode($user['role'])
    );

    exit;

} catch (PDOException $e) {
    error_log($e->getMessage());
    die("Terjadi kesalahan database.");
}

?>