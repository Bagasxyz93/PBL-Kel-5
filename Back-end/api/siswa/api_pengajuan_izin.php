
<?php
// =====================================================
// API PENGAJUAN IZIN SISWA
// =====================================================

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Menangani preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../../config/auth_check.php';
require_once '../../config/koneksi.php';

// Fungsi response JSON
function responseJSON($success, $message, $code = 200, $data = null)
{
    http_response_code($code);

    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ]);

    exit;
}

// =====================================================
// 1. CEK LOGIN DAN ROLE
// =====================================================

if (!isset($_SESSION['user_id'])) {
    responseJSON(false, 'Silakan login terlebih dahulu.', 401);
}

if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'peserta') {
    responseJSON(false, 'Akses hanya untuk siswa.', 403);
}

$pesertaId = (int) $_SESSION['user_id'];

// =====================================================
// 2. CEK METHOD
// =====================================================

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responseJSON(false, 'Method tidak diizinkan.', 405);
}

// =====================================================
// 3. AMBIL INPUT
// =====================================================

$tanggalIzin = trim($_POST['tanggal_izin'] ?? '');
$alasan = trim($_POST['alasan'] ?? '');

if ($tanggalIzin === '' || $alasan === '') {
    responseJSON(false, 'Tanggal dan alasan wajib diisi.', 400);
}

// Validasi tanggal
$date = DateTime::createFromFormat('!Y-m-d', $tanggalIzin);

if (!$date || $date->format('Y-m-d') !== $tanggalIzin) {
    responseJSON(false, 'Format tanggal tidak valid.', 400);
}

// Validasi alasan
if (strlen($alasan) > 5000) {
    responseJSON(false, 'Alasan terlalu panjang.', 400);
}

// =====================================================
// 4. VALIDASI FILE LAMPIRAN
// =====================================================

$namaFileDatabase = null;
$lokasiFile = null;

if (isset($_FILES['bukti_file']) &&
    $_FILES['bukti_file']['error'] !== UPLOAD_ERR_NO_FILE) {

    $file = $_FILES['bukti_file'];

    if ($file['error'] !== UPLOAD_ERR_OK) {
        responseJSON(false, 'Gagal mengunggah file.', 400);
    }

    // Maksimal 5 MB
    if ($file['size'] > 5 * 1024 * 1024) {
        responseJSON(false, 'Ukuran file maksimal 5 MB.', 400);
    }

    // Validasi MIME file
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mimeType = $finfo->file($file['tmp_name']);

    $allowedTypes = [
        'application/pdf' => 'pdf',
        'image/jpeg' => 'jpg',
        'image/png' => 'png'
    ];

    if (!isset($allowedTypes[$mimeType])) {
        responseJSON(
            false,
            'Format file harus PDF, JPG, JPEG, atau PNG.',
            400
        );
    }

    // Folder penyimpanan
    $uploadDir = __DIR__ . '/../../uploads/pengajuan_izin/';

    if (!is_dir($uploadDir)) {
        if (!mkdir($uploadDir, 0755, true)) {
            responseJSON(false, 'Folder upload gagal dibuat.', 500);
        }
    }

    // Nama file acak agar tidak bentrok
    $namaBaru = bin2hex(random_bytes(16))
        . '.' . $allowedTypes[$mimeType];

    $lokasiFile = $uploadDir . $namaBaru;

    $namaFileDatabase = 'uploads/pengajuan_izin/' . $namaBaru;

    if (!move_uploaded_file($file['tmp_name'], $lokasiFile)) {
        responseJSON(false, 'Gagal menyimpan bukti lampiran.', 500);
    }
}

// =====================================================
// 5. SIMPAN PENGAJUAN
// =====================================================

try {

    $pdo->beginTransaction();

    // Cari program siswa
    $queryProgram = "
        SELECT program_id
        FROM peserta_program
        WHERE peserta_id = :peserta_id
        ORDER BY id DESC
        LIMIT 1
    ";

    $stmtProgram = $pdo->prepare($queryProgram);
    $stmtProgram->execute([
        ':peserta_id' => $pesertaId
    ]);

    $programId = $stmtProgram->fetchColumn();

    if (!$programId) {
        throw new Exception('Program siswa tidak ditemukan.');
    }

    // Buat absensi alpha jika belum ada.
    // Jika sudah ada, data absensi tidak diubah.
    $queryAbsensi = "
        INSERT INTO absensi (
            peserta_id,
            program_id,
            tanggal,
            status,
            keterangan,
            created_at
        )
        VALUES (
            :peserta_id,
            :program_id,
            :tanggal,
            'alpha',
            'Menunggu pengajuan izin',
            CURRENT_TIMESTAMP
        )
        ON CONFLICT (peserta_id, program_id, tanggal)
        DO NOTHING
        RETURNING id
    ";

    $stmtAbsensi = $pdo->prepare($queryAbsensi);

    $stmtAbsensi->execute([
        ':peserta_id' => $pesertaId,
        ':program_id' => $programId,
        ':tanggal' => $tanggalIzin
    ]);

    // Ambil ID absensi
    $absensiId = $stmtAbsensi->fetchColumn();

    if (!$absensiId) {

        // Jika absensi sudah ada, ambil data yang sudah tersimpan
        $queryCekAbsensi = "
            SELECT id, status
            FROM absensi
            WHERE peserta_id = :peserta_id
              AND program_id = :program_id
              AND tanggal = :tanggal
            FOR UPDATE
        ";

        $stmtCekAbsensi = $pdo->prepare($queryCekAbsensi);

        $stmtCekAbsensi->execute([
            ':peserta_id' => $pesertaId,
            ':program_id' => $programId,
            ':tanggal' => $tanggalIzin
        ]);

        $dataAbsensi = $stmtCekAbsensi->fetch(PDO::FETCH_ASSOC);

        if (!$dataAbsensi) {
            throw new Exception('Data absensi tidak ditemukan.');
        }

        $absensiId = $dataAbsensi['id'];

        // Jangan mengubah absensi yang sudah diproses
        if ($dataAbsensi['status'] !== 'alpha') {
            throw new Exception(
                'Pengajuan tidak dapat dilakukan karena absensi pada tanggal tersebut sudah tercatat.'
            );
        }
    }

    // Cek pengajuan sebelumnya
    $queryCekPengajuan = "
        SELECT id
        FROM pengajuan_izin
        WHERE absensi_id = :absensi_id
        LIMIT 1
    ";

    $stmtCekPengajuan = $pdo->prepare($queryCekPengajuan);

    $stmtCekPengajuan->execute([
        ':absensi_id' => $absensiId
    ]);

    if ($stmtCekPengajuan->fetch()) {
        throw new Exception(
            'Pengajuan izin untuk tanggal tersebut sudah pernah dibuat.'
        );
    }

    // Simpan pengajuan izin
    $queryPengajuan = "
        INSERT INTO pengajuan_izin (
            absensi_id,
            tanggal_izin,
            waktu_pengajuan,
            alasan,
            bukti_file,
            status
        )
        VALUES (
            :absensi_id,
            :tanggal_izin,
            CURRENT_TIMESTAMP,
            :alasan,
            :bukti_file,
            'menunggu'
        )
        RETURNING id
    ";

    $stmtPengajuan = $pdo->prepare($queryPengajuan);

    $stmtPengajuan->execute([
        ':absensi_id' => $absensiId,
        ':tanggal_izin' => $tanggalIzin,
        ':alasan' => $alasan,
        ':bukti_file' => $namaFileDatabase
    ]);

    $pengajuanId = $stmtPengajuan->fetchColumn();

    // Semua berhasil
    $pdo->commit();

    responseJSON(
        true,
        'Pengajuan izin berhasil dikirim.',
        201,
        [
            'id' => $pengajuanId,
            'tanggal_izin' => $tanggalIzin,
            'status' => 'menunggu'
        ]
    );

} catch (Exception $e) {

    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    // Hapus file jika penyimpanan database gagal
    if ($lokasiFile && file_exists($lokasiFile)) {
        unlink($lokasiFile);
    }

    responseJSON(false, $e->getMessage(), 400);

} catch (PDOException $e) {

    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    if ($lokasiFile && file_exists($lokasiFile)) {
        unlink($lokasiFile);
    }

    error_log($e->getMessage());

    responseJSON(
        false,
        'Terjadi kesalahan saat menyimpan pengajuan.',
        500
    );
}
