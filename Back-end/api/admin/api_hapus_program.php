
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

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode([
            "success" => false,
            "message" => "Metode tidak diizinkan."
        ]);
        exit;
    }

    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'] ?? null;

    if (!$id || !filter_var($id, FILTER_VALIDATE_INT) || $id <= 0) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "ID program tidak valid."
        ]);
        exit;
    }

    $stmt = $pdo->prepare("
        DELETE FROM program
        WHERE id = :id
        RETURNING id
    ");

    $stmt->execute([':id' => $id]);

    $programId = $stmt->fetchColumn();

    if (!$programId) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Program tidak ditemukan."
        ]);
        exit;
    }

    echo json_encode([
        "success" => true,
        "message" => "Program berhasil dihapus."
    ]);

} catch (PDOException $e) {
    error_log($e->getMessage());

    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Program tidak dapat dihapus karena masih digunakan oleh data lain."
    ]);
}

?>
