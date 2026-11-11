
<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once '../../config/koneksi.php';

// Pastikan mentor sudah login
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'mentor') {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Sesi mentor tidak ditemukan."
    ]);
    exit;
}

try {
    // Mengambil data identitas mentor
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
        WHERE id = ? AND role = 'mentor'
    ");

    $stmt->execute([$_SESSION['user_id']]);
    $mentor = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$mentor) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Data mentor tidak ditemukan."
        ]);
        exit;
    }

    // Mengambil daftar program yang diampu mentor
    $stmtProgram = $pdo->prepare("
        SELECT
            p.id,
            p.nama_program
        FROM mentor_program mp
        JOIN program p ON mp.program_id = p.id
        WHERE mp.mentor_id = ?
        ORDER BY p.nama_program ASC
    ");

    $stmtProgram->execute([$_SESSION['user_id']]);
    $mentor['program'] = $stmtProgram->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "data" => $mentor
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Gagal mengambil profil mentor."
    ]);
}
?>
