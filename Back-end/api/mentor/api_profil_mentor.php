<?php

session_start();

// Pengaturan CORS
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

// Menangani preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Hanya menerima GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Method tidak diizinkan."
    ]);

    exit;
}

// Koneksi database
require_once __DIR__ . '/../../config/koneksi.php';

// Memastikan mentor sudah login
if (
    !isset($_SESSION['user_id']) ||
    !isset($_SESSION['role']) ||
    $_SESSION['role'] !== 'mentor'
) {
    http_response_code(401);

    echo json_encode([
        "success" => false,
        "message" => "Sesi mentor tidak ditemukan."
    ]);

    exit;
}

$mentor_id = $_SESSION['user_id'];

try {

    // ==========================================
    // MENGAMBIL DATA IDENTITAS MENTOR
    // ==========================================

    $stmt = $pdo->prepare("
        SELECT
            id,
            nama,
            nip,
            jenis_kelamin,
            email,
            no_hp,
            username,
            status_akun
        FROM users
        WHERE id = :mentor_id
          AND role = 'mentor'
    ");

    $stmt->execute([
        ':mentor_id' => $mentor_id
    ]);

    $mentor = $stmt->fetch(PDO::FETCH_ASSOC);

    // Memastikan data mentor tersedia
    if (!$mentor) {
        http_response_code(404);

        echo json_encode([
            "success" => false,
            "message" => "Data mentor tidak ditemukan."
        ]);

        exit;
    }

    // ==========================================
    // MENGAMBIL PROGRAM YANG DIAMPU MENTOR
    // ==========================================

    $stmtProgram = $pdo->prepare("
        SELECT
            p.id,
            p.nama_program
        FROM mentor_program mp
        INNER JOIN program p
            ON mp.program_id = p.id
        WHERE mp.mentor_id = :mentor_id
        ORDER BY p.nama_program ASC
    ");

    $stmtProgram->execute([
        ':mentor_id' => $mentor_id
    ]);

    $mentor['program'] = $stmtProgram->fetchAll(PDO::FETCH_ASSOC);

    // ==========================================
    // RESPONSE DATA MENTOR
    // ==========================================

    echo json_encode([
        "success" => true,
        "message" => "Profil mentor berhasil diambil.",
        "data" => $mentor
    ]);

} catch (PDOException $e) {

    error_log($e->getMessage());

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Gagal mengambil profil mentor."
    ]);

}

?>