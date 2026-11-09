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
$nama = trim($data['nama'] ?? '');
$nip = trim($data['nip'] ?? '');
$no_hp = trim($data['no_hp'] ?? '');
$email = trim($data['email'] ?? '');
$username = trim($data['username'] ?? '');
$status = strtolower($data['status'] ?? '');
$programIds = $data['program_ids'] ?? [];

if (
    !$id || $nama === '' || $nip === '' ||
    $email === '' || $username === '' ||
    !in_array($status, ['aktif', 'non-aktif']) ||
    !is_array($programIds) || count($programIds) === 0
) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Data mentor belum lengkap."
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Format email tidak valid."
    ]);
    exit;
}

try {
    $pdo->beginTransaction();

    // Pastikan mentor tersedia
    $cekMentor = $pdo->prepare("
        SELECT id FROM users
        WHERE id = ? AND role = 'mentor'
    ");
    $cekMentor->execute([$id]);

    if (!$cekMentor->fetch()) {
        throw new Exception("Data mentor tidak ditemukan.");
    }

    // Cek username, email, dan NIP milik pengguna lain
    $cek = $pdo->prepare("
        SELECT id FROM users
        WHERE (username = ? OR email = ? OR nip = ?)
        AND id <> ?
    ");
    $cek->execute([$username, $email, $nip, $id]);

    if ($cek->fetch()) {
        throw new Exception("Username, email, atau NIP sudah digunakan.");
    }

    // Perbarui data mentor
    $stmt = $pdo->prepare("
        UPDATE users
        SET nama = ?, nip = ?, no_hp = ?,
            email = ?, username = ?, status_akun = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND role = 'mentor'
    ");

    $stmt->execute([
        $nama, $nip, $no_hp,
        $email, $username, $status, $id
    ]);

    // Perbarui program mentor
    $hapusProgram = $pdo->prepare("
        DELETE FROM mentor_program
        WHERE mentor_id = ?
    ");
    $hapusProgram->execute([$id]);

    $tambahProgram = $pdo->prepare("
        INSERT INTO mentor_program (mentor_id, program_id)
        VALUES (?, ?)
    ");

    foreach ($programIds as $programId) {
        $tambahProgram->execute([$id, $programId]);
    }

    $pdo->commit();

    echo json_encode([
        "success" => true,
        "message" => "Data mentor berhasil diperbarui."
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