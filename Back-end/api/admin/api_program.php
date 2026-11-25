
<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
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
// AMBIL DATA PROGRAM
// ==================================================

try {

    $stmt = $pdo->prepare("
        SELECT id, nama_program, deskripsi
        FROM program
        ORDER BY id DESC
    ");

    $stmt->execute();

    $programList = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "data" => $programList
    ]);

} catch (PDOException $e) {

    error_log($e->getMessage());

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Gagal memuat data program."
    ]);

}

?>
