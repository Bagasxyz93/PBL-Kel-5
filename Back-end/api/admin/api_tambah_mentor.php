
<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once '../../config/koneksi.php';
require_once '../../config/tab_auth.php';

// ==================================================
// VALIDASI TOKEN DAN ROLE ADMIN
// ==================================================

$userToken = ambilUserToken();

if (!$userToken || $userToken['role'] !== 'admin') {
    http_response_code(401);

    echo json_encode([
        "success" => false,
        "message" => "Akses ditolak. Silakan login sebagai Admin."
    ]);

    exit;
}

// ==================================================
// VALIDASI METHOD
// ==================================================

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Method tidak diizinkan."
    ]);

    exit;
}

// ==================================================
// MENGAMBIL DATA
// ==================================================

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
$nip = trim($data['nip'] ?? '');
$no_hp = trim($data['no_hp'] ?? '');
$email = trim($data['email'] ?? '');
$username = trim($data['username'] ?? '');
$jenis_kelamin = trim($data['jenis_kelamin'] ?? '');
$password = $data['password'] ?? '';
$status = strtolower($data['status'] ?? '');
$programIds = $data['program_ids'] ?? [];

// ==================================================
// VALIDASI INPUT
// ==================================================

if (
    $nama === '' ||
    $nip === '' ||
    $email === '' ||
    $username === '' ||
    $password === '' ||
    $jenis_kelamin === '' ||
    !in_array($jenis_kelamin, ['Laki-laki', 'Perempuan']) ||
    !in_array($status, ['aktif', 'non-aktif']) ||
    !is_array($programIds) ||
    count($programIds) === 0
) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Semua data wajib diisi dan minimal pilih satu program."
    ]);

    exit;
}

// Validasi email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Format email tidak valid."
    ]);

    exit;
}

// Validasi panjang password
if (strlen($password) < 8) {
    http_response_code(400);

    echo json_encode([
        "success" => false,
        "message" => "Kata sandi minimal harus 8 karakter."
    ]);

    exit;
}

// ==================================================
// PROSES SIMPAN DATA MENTOR
// ==================================================

try {

    $pdo->beginTransaction();

    // Cek username, email, dan NIP
    $cek = $pdo->prepare("
        SELECT id
        FROM users
        WHERE username = ? OR email = ? OR nip = ?
    ");

    $cek->execute([
        $username,
        $email,
        $nip
    ]);

    if ($cek->fetch()) {
        throw new Exception(
            "Username, email, atau NIP sudah digunakan."
        );
    }

    // Simpan password dalam bentuk hash
    $passwordHash = password_hash(
        $password,
        PASSWORD_DEFAULT
    );

    // Simpan data mentor ke tabel users
    $stmt = $pdo->prepare("
        INSERT INTO users
        (
            nama,
            username,
            email,
            password,
            role,
            nip,
            no_hp,
            jenis_kelamin,
            status_akun
        )
        VALUES (?, ?, ?, ?, 'mentor', ?, ?, ?, ?)
        RETURNING id
    ");

    $stmt->execute([
        $nama,
        $username,
        $email,
        $passwordHash,
        $nip,
        $no_hp,
        $jenis_kelamin,
        $status
    ]);

    $mentorId = $stmt->fetchColumn();

    // Simpan program mentor ke tabel mentor_program
    $stmtProgram = $pdo->prepare("
        INSERT INTO mentor_program (mentor_id, program_id)
        VALUES (?, ?)
    ");

    foreach ($programIds as $programId) {
        $stmtProgram->execute([
            $mentorId,
            $programId
        ]);
    }

    // Simpan transaksi
    $pdo->commit();

    echo json_encode([
        "success" => true,
        "message" => "Data mentor berhasil ditambahkan."
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
