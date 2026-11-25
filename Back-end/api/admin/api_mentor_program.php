
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
// AMBIL ID PROGRAM
// ==================================================

$program_id = $_GET['program_id'] ?? '';

if (!$program_id) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "ID program wajib diisi."
    ]);

    exit;
}

// ==================================================
// AMBIL DATA MENTOR BERDASARKAN PROGRAM
// ==================================================

try {

    $stmt = $pdo->prepare("
        SELECT u.id, u.nama, u.nip
        FROM mentor_program mp
        JOIN users u ON mp.mentor_id = u.id
        WHERE mp.program_id = :program_id
          AND u.role = 'mentor'
          AND u.status_akun = 'aktif'
        ORDER BY u.nama ASC
    ");

    $stmt->execute([
        ':program_id' => $program_id
    ]);

    echo json_encode([
        "success" => true,
        "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)
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
