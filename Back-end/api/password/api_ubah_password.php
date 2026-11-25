
<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/../../config/koneksi.php';
require_once __DIR__ . '/../../config/tab_auth.php';

// Memastikan pengguna sudah login
$userToken = ambilUserToken();

if (!$userToken) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Sesi login tidak valid. Silakan login kembali."
    ]);
    exit;
}

// Mengambil data dari request JSON
$data = json_decode(file_get_contents("php://input"), true);

$passwordLama = $data['password_lama'] ?? '';
$passwordBaru = $data['password_baru'] ?? '';
$konfirmasiPassword = $data['konfirmasi_password'] ?? '';

if (
    $passwordLama === '' ||
    $passwordBaru === '' ||
    $konfirmasiPassword === ''
) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Semua kolom password wajib diisi."
    ]);
    exit;
}

// Memeriksa kesesuaian password baru
if ($passwordBaru !== $konfirmasiPassword) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Konfirmasi password tidak sesuai."
    ]);
    exit;
}

// Memeriksa aturan password baru
if (!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/', $passwordBaru)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Password minimal 8 karakter dan harus mengandung huruf besar, huruf kecil, angka, serta simbol."
    ]);
    exit;
}

try {
    // Mengambil akun berdasarkan ID dari token
    $stmt = $pdo->prepare("
        SELECT id, password
        FROM users
        WHERE id = :id
    ");

    $stmt->execute([
        ':id' => $userToken['user_id']
    ]);

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Data akun tidak ditemukan."
        ]);
        exit;
    }

    // Memeriksa password lama
    if (!password_verify($passwordLama, $user['password'])) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Password lama yang kamu masukkan salah."
        ]);
        exit;
    }

    // Mencegah penggunaan password yang sama
    if (password_verify($passwordBaru, $user['password'])) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Password baru tidak boleh sama dengan password lama."
        ]);
        exit;
    }

    // Mengenkripsi password baru
    $passwordHash = password_hash($passwordBaru, PASSWORD_DEFAULT);

    // Memperbarui password di database
    $update = $pdo->prepare("
        UPDATE users
        SET password = :password
        WHERE id = :id
    ");

    $update->execute([
        ':password' => $passwordHash,
        ':id' => $userToken['user_id']
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Password berhasil diperbarui."
    ]);

} catch (PDOException $e) {
    error_log($e->getMessage());

    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Terjadi kesalahan pada server."
    ]);
}
