
<?php

require_once __DIR__ . '/../../config/cors.php';header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once '../../config/koneksi.php';
require_once '../../config/tab_auth.php';

// Validasi token Admin
$userToken = ambilUserToken();

if (!$userToken || $userToken['role'] !== 'admin') {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Akses ditolak. Silakan login sebagai Admin."
    ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Method tidak diizinkan."
    ]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'] ?? null;

if (!$id || !is_numeric($id)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "ID mentor tidak ditemukan."
    ]);
    exit;
}

try {

    $pdo->beginTransaction();

    // Memastikan data merupakan mentor
    $cek = $pdo->prepare("
        SELECT id FROM users
        WHERE id = ? AND role = 'mentor'
    ");

    $cek->execute([$id]);

    if (!$cek->fetch()) {
        throw new Exception("Data mentor tidak ditemukan.");
    }

    // Menghapus hubungan mentor dengan program
    $hapusProgram = $pdo->prepare("
        DELETE FROM mentor_program
        WHERE mentor_id = ?
    ");

    $hapusProgram->execute([$id]);

    // Menghapus akun mentor
    $hapusMentor = $pdo->prepare("
        DELETE FROM users
        WHERE id = ? AND role = 'mentor'
    ");

    $hapusMentor->execute([$id]);

    $pdo->commit();

    echo json_encode([
        "success" => true,
        "message" => "Data mentor berhasil dihapus."
    ]);

} catch (PDOException $e) {

    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    error_log($e->getMessage());

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Data mentor tidak dapat dihapus karena masih memiliki data yang terhubung, seperti materi."
    ]);

} catch (Exception $e) {

    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);

}

?>
