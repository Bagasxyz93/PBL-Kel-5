
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
// AMBIL DATA DASHBOARD
// ==================================================

try {

    $stmt = $pdo->prepare("
        SELECT
            (SELECT COUNT(*) FROM users WHERE role = 'peserta') AS total_siswa,
            (SELECT COUNT(*) FROM users WHERE role = 'mentor') AS total_mentor,
            (SELECT COUNT(*) FROM program) AS total_program
    ");

    $stmt->execute();

    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "data" => $data
    ]);

} catch (PDOException $e) {

    error_log($e->getMessage());

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Gagal mengambil data dashboard."
    ]);

}

?>
