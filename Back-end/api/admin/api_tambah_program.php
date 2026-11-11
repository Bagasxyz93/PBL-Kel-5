
<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once '../../config/koneksi.php';

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

    $namaProgram = trim($data['nama_program'] ?? '');
    $deskripsi = trim($data['deskripsi'] ?? '');

    if ($namaProgram === '' || $deskripsi === '') {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Nama dan deskripsi program wajib diisi."
        ]);
        exit;
    }

    $stmt = $pdo->prepare("
        INSERT INTO program (nama_program, deskripsi)
        VALUES (:nama_program, :deskripsi)
        RETURNING id
    ");

    $stmt->execute([
        ':nama_program' => $namaProgram,
        ':deskripsi' => $deskripsi
    ]);

    $programId = $stmt->fetchColumn();

    echo json_encode([
        "success" => true,
        "message" => "Program berhasil ditambahkan.",
        "data" => [
            "id" => $programId,
            "nama_program" => $namaProgram,
            "deskripsi" => $deskripsi
        ]
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Gagal menyimpan program."
    ]);
}
?>
