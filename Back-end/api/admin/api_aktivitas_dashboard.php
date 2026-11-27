<?php

require_once __DIR__ . '/../../config/cors.php';

header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once '../../config/koneksi.php';
require_once '../../config/tab_auth.php';

// ==================================================
// VALIDASI TOKEN ADMIN
// ==================================================

$userToken = ambilUserToken();

if (!$userToken || $userToken['role'] !== 'admin') {
    http_response_code(401);

    echo json_encode([
        "success" => false,
        "message" => "Akses ditolak. Silakan login sebagai Admin."
    ]);

    exit;
}

// ==================================================
// AMBIL AKTIVITAS TERAKHIR
// ==================================================

try {

    $stmt = $pdo->prepare("
        SELECT
            aktivitas.tipe,
            aktivitas.nama,
            TO_CHAR(
                aktivitas.created_at,
                'DD Mon YYYY HH24:MI'
            ) || ' WIB' AS waktu
        FROM (
            SELECT
                'peserta' AS tipe,
                nama AS nama,
                created_at
            FROM users
            WHERE role = 'peserta'
              AND created_at IS NOT NULL

            UNION ALL

            SELECT
                'mentor' AS tipe,
                nama AS nama,
                created_at
            FROM users
            WHERE role = 'mentor'
              AND created_at IS NOT NULL

            UNION ALL

            SELECT
                'program' AS tipe,
                nama_program AS nama,
                created_at
            FROM program
            WHERE created_at IS NOT NULL

            UNION ALL

            SELECT
                'materi' AS tipe,
                judul AS nama,
                created_at
            FROM materi
            WHERE created_at IS NOT NULL

        ) AS aktivitas

        ORDER BY aktivitas.created_at DESC
        LIMIT 5
    ");

    $stmt->execute();

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "data" => $data
    ]);

} catch (PDOException $e) {

    error_log($e->getMessage());

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Gagal mengambil aktivitas terakhir."
    ]);

}

?>