<?php
header("Content-Type: application/json");
include 'koneksi.php';

// Ambil data JSON yang dikirim oleh fetch() dari frontend
$input = json_decode(file_get_contents("php://input"), true);

$identity = $input['identity'] ?? '';
$password = $input['password'] ?? '';

if (empty($identity) || empty($password)) {
    echo json_encode([
        "success" => false,
        "message" => "Username dan password wajib diisi."
    ]);
    exit();
}

try {
    // Cari user berdasarkan email atau username
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = :identity OR username = :identity");
    $stmt->execute(['identity' => $identity]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Cek apakah user ditemukan dan verifikasi password 
    // (Jika password di database sudah di-hash pakai password_hash, gunakan password_verify)
    if ($user && ($password === $user['password'] || password_verify($password, $user['password']))) {
        echo json_encode([
            "success" => true,
            "message" => "Login berhasil",
            "user" => [
                "id" => $user['id'],
                "nama" => $user['nama'],
                "username" => $user['username'],
                "role" => $user['role']
            ]
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Username atau password salah."
        ]);
    }

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Terjadi kesalahan pada server: " . $e->getMessage()
    ]);
}
?>