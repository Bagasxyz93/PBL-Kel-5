
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
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Gagal mengambil data dashboard."
    ]);
}
?>
