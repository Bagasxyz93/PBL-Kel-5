
<?php

// Mengizinkan Front-end mengakses API
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Menangani preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once 'config/koneksi.php';

try {

    // Mengambil data peserta dari VIEW
    $stmt = $pdo->prepare("
        SELECT
            id,
            nama,
            nisn,
            email,
            username,
            no_hp,
            jenis_kelamin,
            program_id,
            nama_program,
            tanggal_daftar,
            status,
            status_akun
        FROM view_data_peserta
        ORDER BY id DESC
    ");

    $stmt->execute();

    $pesertaList = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "data" => $pesertaList
    ]);

} catch (Exception $e) {

    echo json_encode([
        "success" => false,
        "message" => "Gagal memuat data peserta: " . $e->getMessage()
    ]);

}
?>
