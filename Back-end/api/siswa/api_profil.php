
<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/../../config/koneksi.php';
require_once __DIR__ . '/../../config/tab_auth.php';

// Validasi token
$userToken = ambilUserToken();

if (!$userToken || $userToken['role'] !== 'peserta') {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Akses hanya untuk peserta."
    ]);
    exit;
}

// Hanya menerima GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Metode tidak diizinkan."
    ]);
    exit;
}

try {

    // ID peserta diambil dari token
    $userId = $userToken['user_id'];

    $sql = "
        SELECT
            u.id,
            u.nama,
            u.nisn,
            u.email,
            u.no_hp,
            u.status_akun,
            p.nama_program
        FROM users u
        LEFT JOIN peserta_program pp 
            ON pp.peserta_id = u.id
        LEFT JOIN program p 
            ON p.id = pp.program_id
        WHERE u.id = :user_id
          AND u.role = 'peserta'
        LIMIT 1
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':user_id' => $userId
    ]);

    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$data) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Data profil peserta tidak ditemukan."
        ]);
        exit;
    }

    echo json_encode([
        "success" => true,
        "data" => [
            "id" => $data['id'],
            "nama" => $data['nama'],
            "nisn" => $data['nisn'],
            "email" => $data['email'],
            "telepon" => $data['no_hp'],
            "program" => $data['nama_program'],
            "status" => $data['status_akun']
        ]
    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Gagal mengambil data profil peserta."
    ]);
}

?>
