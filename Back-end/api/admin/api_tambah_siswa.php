
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

// Validasi method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Method tidak diizinkan."
    ]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Format data tidak valid."
    ]);
    exit;
}

$nama = trim($data['nama'] ?? '');
$nisn = trim($data['nisn'] ?? '');
$no_hp = trim($data['no_hp'] ?? '');
$email = trim($data['email'] ?? '');
$username = trim($data['username'] ?? '');
$password = $data['password'] ?? '';
$jenis_kelamin = $data['jenis_kelamin'] ?? '';
$program_id = $data['program_id'] ?? null;
$status = strtolower($data['status'] ?? 'aktif');

// Validasi data
if (
    $nama === '' || $nisn === '' || $no_hp === '' ||
    $email === '' || $username === '' || $password === '' ||
    $jenis_kelamin === '' || !$program_id
) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Semua data wajib diisi."
    ]);
    exit;
}

if (!in_array($jenis_kelamin, ['Laki-laki', 'Perempuan'])) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Jenis kelamin tidak valid."
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

if (strlen($password) < 8) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Kata sandi minimal 8 karakter."
    ]);
    exit;
}

if (!in_array($status, ['aktif', 'non-aktif'])) {
    $status = 'aktif';
}

try {
    $pdo->beginTransaction();

    // Memeriksa username, email, dan NISN
    $cek = $pdo->prepare("
        SELECT id FROM users
        WHERE username = :username
           OR email = :email
           OR nisn = :nisn
    ");

    $cek->execute([
        ':username' => $username,
        ':email' => $email,
        ':nisn' => $nisn
    ]);

    if ($cek->fetch()) {
        throw new Exception(
            "Username, email, atau NISN sudah digunakan."
        );
    }

    // Menyimpan data siswa
    $stmt = $pdo->prepare("
        INSERT INTO users (
            nama, nisn, no_hp, email, username,
            password, jenis_kelamin, role, status_akun
        )
        VALUES (
            :nama, :nisn, :no_hp, :email, :username,
            :password, :jenis_kelamin, 'peserta', :status
        )
        RETURNING id
    ");

    $stmt->execute([
        ':nama' => $nama,
        ':nisn' => $nisn,
        ':no_hp' => $no_hp,
        ':email' => $email,
        ':username' => $username,
        ':password' => password_hash($password, PASSWORD_DEFAULT),
        ':jenis_kelamin' => $jenis_kelamin,
        ':status' => $status
    ]);

    $peserta_id = $stmt->fetchColumn();

    // Menyimpan program siswa
    $stmtProgram = $pdo->prepare("
        INSERT INTO peserta_program (
            peserta_id, program_id, tanggal_daftar, status
        )
        VALUES (
            :peserta_id, :program_id, CURRENT_DATE, :status
        )
    ");

    $stmtProgram->execute([
        ':peserta_id' => $peserta_id,
        ':program_id' => $program_id,
        ':status' => $status === 'aktif' ? 'Aktif' : 'Draft'
    ]);

    $pdo->commit();

    echo json_encode([
        "success" => true,
        "message" => "Data siswa berhasil ditambahkan."
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
