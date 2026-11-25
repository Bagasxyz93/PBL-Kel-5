<?php

require_once '../config/koneksi.php';
require_once '../config/tab_auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: http://localhost:5173/login.php");
    exit;
}

$username = trim($_POST['username'] ?? '');
$password = $_POST['password'] ?? '';

if ($username === '' || $password === '') {
    header("Location: http://localhost:5173/?error=empty");
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
        header("Location: http://localhost:5173/?error=invalid");
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
            header("Location: http://localhost:5173/?error=role");
            exit;
    }

    // Token, nama, dan role dikirim ke halaman tujuan untuk disimpan per tab.
    header(
        "Location: http://localhost:5173/auth-redirect.html"
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
