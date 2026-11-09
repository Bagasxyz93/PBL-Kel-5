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

if (!$id) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "ID siswa tidak ditemukan."
    ]);
    exit;
}

try {
    $pdo->beginTransaction();

    // Memastikan data merupakan siswa
    $cek = $pdo->prepare("
        SELECT id FROM users
        WHERE id = ? AND role = 'peserta'
    ");
    $cek->execute([$id]);

    if (!$cek->fetch()) {
        throw new Exception("Data siswa tidak ditemukan.");
    }

    // Menghapus hubungan siswa dengan program
    $hapusProgram = $pdo->prepare("
        DELETE FROM peserta_program
        WHERE peserta_id = ?
    ");
    $hapusProgram->execute([$id]);

    // Menghapus akun siswa
    $hapusSiswa = $pdo->prepare("
        DELETE FROM users
        WHERE id = ? AND role = 'peserta'
    ");
    $hapusSiswa->execute([$id]);

    $pdo->commit();

    echo json_encode([
        "success" => true,
        "message" => "Data siswa berhasil dihapus."
    ]);

} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Data siswa tidak dapat dihapus karena masih memiliki data yang terhubung, seperti absensi atau Daily Report."
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