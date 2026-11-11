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

$id = $_GET['id'] ?? null;

if (!$id || !is_numeric($id)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "ID mentor tidak valid."
    ]);
    exit;
}

try {
    // Mengambil data mentor
    $stmt = $pdo->prepare("
        SELECT
            id,
            nama,
            nip,
            no_hp,
            email,
            username,
            jenis_kelamin,
            status_akun
        FROM users
        WHERE id = ? AND role = 'mentor'
    ");

    $stmt->execute([$id]);
    $mentor = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$mentor) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Data mentor tidak ditemukan."
        ]);
        exit;
    }

    // Mengambil program yang dimiliki mentor
    $stmtProgram = $pdo->prepare("
        SELECT program_id
        FROM mentor_program
        WHERE mentor_id = ?
        ORDER BY program_id
    ");

    $stmtProgram->execute([$id]);

    $mentor['program_ids'] = array_map(
        'intval',
        $stmtProgram->fetchAll(PDO::FETCH_COLUMN)
    );

    echo json_encode([
        "success" => true,
        "data" => $mentor
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Gagal mengambil detail mentor."
    ]);
}
?>