<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once '../../config/koneksi.php';

$id = $_GET['id'] ?? '';

if (!$id) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "ID siswa wajib diisi."
    ]);
    exit;
}

try {
    $stmt = $pdo->prepare("
        SELECT
            u.id,
            u.nama,
            u.nisn,
            u.no_hp,
            u.email,
            u.username,
            u.jenis_kelamin,
            u.status_akun,
            pp.id AS peserta_program_id,
            pp.program_id
        FROM users u
        LEFT JOIN peserta_program pp ON u.id = pp.peserta_id
        WHERE u.id = :id
          AND u.role = 'peserta'
        ORDER BY pp.id DESC
        LIMIT 1
    ");

    $stmt->execute([':id' => $id]);
    $siswa = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$siswa) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Data siswa tidak ditemukan."
        ]);
        exit;
    }

    echo json_encode([
        "success" => true,
        "data" => $siswa
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Gagal mengambil detail siswa."
    ]);
}
?>