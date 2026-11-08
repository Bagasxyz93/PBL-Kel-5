<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once 'config/koneksi.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        // Ambil daftar program
        $stmt = $pdo->prepare("SELECT * FROM program ORDER BY id DESC");
        $stmt->execute();
        $programList = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "success" => true,
            "data" => $programList
        ]);
    } elseif ($method === 'POST') {
        // Tambah program baru (jika dibutuhkan dari panel admin)
        $input = json_decode(file_get_contents("php://input"), true);
        $nama_program = $input['nama_program'] ?? '';
        $deskripsi = $input['deskripsi'] ?? '';

        if (empty($nama_program)) {
            echo json_encode(["success" => false, "message" => "Nama program wajib diisi."]);
            exit();
        }

        $stmt = $pdo->prepare("INSERT INTO program (nama_program, deskripsi) VALUES (:nama_program, :deskripsi)");
        $stmt->execute(['nama_program' => $nama_program, 'deskripsi' => $deskripsi]);

        echo json_encode([
            "success" => true,
            "message" => "Program berhasil ditambahkan."
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Terjadi kesalahan: " . $e->getMessage()
    ]);
}
?>