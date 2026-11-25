
<?php

require_once __DIR__ . '/../../config/cors.php';header("Content-Type: application/json; charset=UTF-8");

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
// AMBIL DATA MENTOR
// ==================================================

try {

    $stmt = $pdo->prepare("
        SELECT
            u.id,
            u.nama,
            u.email,
            u.nip,
            u.no_hp,
            u.status_akun,
            COALESCE(
                STRING_AGG(DISTINCT p.nama_program, ', '),
                'Belum ada program'
            ) AS program
        FROM users u
        LEFT JOIN mentor_program mp ON u.id = mp.mentor_id
        LEFT JOIN program p ON mp.program_id = p.id
        WHERE u.role = 'mentor'
        GROUP BY
            u.id,
            u.nama,
            u.email,
            u.nip,
            u.no_hp,
            u.status_akun
        ORDER BY u.id DESC
    ");

    $stmt->execute();

    $dataMentor = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "data" => $dataMentor
    ]);

} catch (PDOException $e) {

    error_log($e->getMessage());

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Gagal mengambil data mentor."
    ]);

}

?>
