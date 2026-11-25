
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
$nama = trim($data['nama'] ?? '');
$nip = trim($data['nip'] ?? '');
$no_hp = trim($data['no_hp'] ?? '');
$email = trim($data['email'] ?? '');
$username = trim($data['username'] ?? '');
$jenis_kelamin = trim($data['jenis_kelamin'] ?? '');
$status = strtolower($data['status'] ?? '');
$programIds = $data['program_ids'] ?? [];

if (
    !$id || !is_numeric($id) ||
    $nama === '' || $nip === '' ||
    $email === '' || $username === '' ||
    $jenis_kelamin === '' ||
    !in_array($jenis_kelamin, ['Laki-laki', 'Perempuan']) ||
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
        FOR UPDATE
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
            email = ?, username = ?, jenis_kelamin = ?,
            status_akun = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND role = 'mentor'
    ");

    $stmt->execute([
        $nama,
        $nip,
        $no_hp,
        $email,
        $username,
        $jenis_kelamin,
        $status,
        $id
    ]);

    // Ambil program mentor yang sudah tersimpan
    $cekProgram = $pdo->prepare("
        SELECT program_id
        FROM mentor_program
        WHERE mentor_id = ?
    ");

    $cekProgram->execute([$id]);

    $programLama = array_map(
        'intval',
        $cekProgram->fetchAll(PDO::FETCH_COLUMN)
    );

    // Pastikan ID program valid dan tidak duplikat
    $programBaru = array_values(array_unique(
        array_map('intval', $programIds)
    ));

    if (
        count($programBaru) !== count($programIds) ||
        in_array(0, $programBaru, true)
    ) {
        throw new Exception("Daftar program tidak valid.");
    }

    $cekProgramValid = $pdo->prepare("
        SELECT id FROM program WHERE id = ?
    ");

    foreach ($programBaru as $programId) {
        $cekProgramValid->execute([$programId]);

        if (!$cekProgramValid->fetch()) {
            throw new Exception("Program yang dipilih tidak ditemukan.");
        }
    }

    // Cari program yang dilepas
    $programDihapus = array_diff($programLama, $programBaru);

    if (!empty($programDihapus)) {

        $hapusProgram = $pdo->prepare("
            DELETE FROM mentor_program
            WHERE mentor_id = ? AND program_id = ?
        ");

        foreach ($programDihapus as $programId) {
            $hapusProgram->execute([$id, $programId]);
        }
    }

    // Cari program yang baru ditambahkan
    $programDitambahkan = array_diff($programBaru, $programLama);

    if (!empty($programDitambahkan)) {

        $tambahProgram = $pdo->prepare("
            INSERT INTO mentor_program (mentor_id, program_id)
            VALUES (?, ?)
        ");

        foreach ($programDitambahkan as $programId) {
            $tambahProgram->execute([$id, $programId]);
        }
    }

    $pdo->commit();

    echo json_encode([
        "success" => true,
        "message" => "Data mentor berhasil diperbarui."
    ]);

} catch (PDOException $e) {

    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    error_log($e->getMessage());

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Data mentor gagal diperbarui."
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
