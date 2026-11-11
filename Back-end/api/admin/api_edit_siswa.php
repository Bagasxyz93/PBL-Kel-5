
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

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'] ?? null;
$peserta_program_id = $data['peserta_program_id'] ?? null;

$nama = trim($data['nama'] ?? '');
$nisn = trim($data['nisn'] ?? '');
$no_hp = trim($data['no_hp'] ?? '');
$email = trim($data['email'] ?? '');
$username = trim($data['username'] ?? '');
$password = $data['password'] ?? '';
$jenis_kelamin = $data['jenis_kelamin'] ?? '';
$program_id = $data['program_id'] ?? null;
$status = strtolower($data['status'] ?? 'aktif');

if (
    !$id || !$peserta_program_id ||
    $nama === '' || $nisn === '' || $no_hp === '' ||
    $email === '' || $username === '' ||
    $jenis_kelamin === '' || !$program_id
) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Data siswa belum lengkap."
    ]);
    exit;
}

if (!in_array($status, ['aktif', 'non-aktif'])) {
    $status = 'aktif';
}

try {
    $pdo->beginTransaction();

    // Memastikan siswa dan program yang diedit benar
    $cekRelasi = $pdo->prepare("
        SELECT id
        FROM peserta_program
        WHERE id = :peserta_program_id
          AND peserta_id = :id
    ");

    $cekRelasi->execute([
        ':peserta_program_id' => $peserta_program_id,
        ':id' => $id
    ]);

    if (!$cekRelasi->fetch()) {
        throw new Exception("Data program siswa tidak ditemukan.");
    }

    // Memeriksa username, email, dan NISN milik akun lain
    $cek = $pdo->prepare("
        SELECT id FROM users
        WHERE (username = :username
            OR email = :email
            OR nisn = :nisn)
          AND id != :id
    ");

    $cek->execute([
        ':username' => $username,
        ':email' => $email,
        ':nisn' => $nisn,
        ':id' => $id
    ]);

    if ($cek->fetch()) {
        throw new Exception("Username, email, atau NISN sudah digunakan siswa lain.");
    }

    // Memperbarui data akun siswa
    if ($password !== '') {
        if (strlen($password) < 8) {
            throw new Exception("Kata sandi minimal 8 karakter.");
        }

        $stmt = $pdo->prepare("
            UPDATE users
            SET nama = :nama,
                nisn = :nisn,
                no_hp = :no_hp,
                email = :email,
                username = :username,
                password = :password,
                jenis_kelamin = :jenis_kelamin,
                status_akun = :status,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = :id
              AND role = 'peserta'
        ");

        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
    } else {
        $stmt = $pdo->prepare("
            UPDATE users
            SET nama = :nama,
                nisn = :nisn,
                no_hp = :no_hp,
                email = :email,
                username = :username,
                jenis_kelamin = :jenis_kelamin,
                status_akun = :status,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = :id
              AND role = 'peserta'
        ");
    }

    $params = [
        ':nama' => $nama,
        ':nisn' => $nisn,
        ':no_hp' => $no_hp,
        ':email' => $email,
        ':username' => $username,
        ':jenis_kelamin' => $jenis_kelamin,
        ':status' => $status,
        ':id' => $id
    ];

    if ($password !== '') {
        $params[':password'] = $passwordHash;
    }

    $stmt->execute($params);

    if ($stmt->rowCount() === 0) {
        // Tidak ada perubahan juga bisa menghasilkan rowCount 0.
        // Karena itu, pastikan akun memang masih tersedia.
        $cekAkun = $pdo->prepare("
            SELECT id FROM users
            WHERE id = :id AND role = 'peserta'
        ");
        $cekAkun->execute([':id' => $id]);

        if (!$cekAkun->fetch()) {
            throw new Exception("Data siswa tidak ditemukan.");
        }
    }

    // Memperbarui program yang sedang diedit saja
    $stmtProgram = $pdo->prepare("
        UPDATE peserta_program
        SET program_id = :program_id,
            status = :status
        WHERE id = :peserta_program_id
          AND peserta_id = :peserta_id
    ");

    $stmtProgram->execute([
        ':program_id' => $program_id,
        ':status' => $status === 'aktif' ? 'Aktif' : 'Draft',
        ':peserta_program_id' => $peserta_program_id,
        ':peserta_id' => $id
    ]);

    $pdo->commit();

    echo json_encode([
        "success" => true,
        "message" => "Data siswa berhasil diperbarui."
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
