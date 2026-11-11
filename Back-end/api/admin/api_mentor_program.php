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

$program_id = $_GET['program_id'] ?? '';

if (!$program_id) {
    echo json_encode([
        "success" => false,
        "message" => "ID program wajib diisi."
    ]);
    exit;
}

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
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Gagal mengambil data mentor."
    ]);
}
?>