
<?php

// Pengaturan CORS
require_once __DIR__ . '/../../config/cors.php';header("Content-Type: application/json; charset=UTF-8");

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

// Koneksi dan autentikasi token
require_once __DIR__ . '/../../config/koneksi.php';
require_once __DIR__ . '/../../config/tab_auth.php';

// Memastikan token mentor valid
$userToken = ambilUserToken();

if (!$userToken || $userToken['role'] !== 'mentor') {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Token mentor tidak valid."
    ]);
    exit;
}

$mentor_id = $userToken['user_id'];

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
