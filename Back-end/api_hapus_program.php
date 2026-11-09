
<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once 'config/koneksi.php';

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
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Program tidak dapat dihapus karena masih digunakan oleh data lain."
    ]);
}
?>
