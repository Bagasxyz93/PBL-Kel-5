
<?php

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

date_default_timezone_set('Asia/Jakarta');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../../config/koneksi.php';
require_once __DIR__ . '/../../config/tab_auth.php';

function responseJSON($success, $message, $code = 200, $data = null)
{
    http_response_code($code);

    echo json_encode([
        "success" => $success,
        "message" => $message,
        "data" => $data
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

// =====================================================
// 1. AUTENTIKASI SISWA
// =====================================================

$userToken = ambilUserToken();

if (!$userToken || $userToken['role'] !== 'peserta') {
    responseJSON(false, "Akses hanya untuk siswa.", 401);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responseJSON(false, "Metode tidak diizinkan.", 405);
}

$pesertaId = (int) $userToken['user_id'];

// =====================================================
// 2. AMBIL INPUT
// =====================================================

$tanggalIzin = trim($_POST['tanggal_izin'] ?? '');
$jenisPengajuan = strtolower(trim($_POST['jenis_pengajuan'] ?? ''));
$alasan = trim($_POST['alasan'] ?? '');

if ($tanggalIzin === '' || $jenisPengajuan === '' || $alasan === '') {
    responseJSON(false, "Tanggal, jenis pengajuan, dan alasan wajib diisi.", 400);
}

if (!in_array($jenisPengajuan, ['izin', 'sakit'], true)) {
    responseJSON(false, "Jenis pengajuan tidak valid.", 400);
}

if (mb_strlen($alasan) > 250) {
    responseJSON(false, "Alasan maksimal 250 karakter.", 400);
}

$date = DateTime::createFromFormat('!Y-m-d', $tanggalIzin);

if (!$date || $date->format('Y-m-d') !== $tanggalIzin) {
    responseJSON(false, "Format tanggal tidak valid.", 400);
}

// =====================================================
// 3. FORMAT ALASAN
// =====================================================

$jenisLabel = ucfirst($jenisPengajuan);

$alasanLengkap =
    "Jenis: " . $jenisLabel . "\n" .
    "Alasan: " . $alasan;

// =====================================================
// 4. VALIDASI FILE BUKTI
// =====================================================

$filePathDB = null;
$filePathServer = null;

if (isset($_FILES['bukti_file']) && $_FILES['bukti_file']['error'] !== UPLOAD_ERR_NO_FILE) {

    $file = $_FILES['bukti_file'];

    if ($file['error'] !== UPLOAD_ERR_OK) {
        responseJSON(false, "Gagal mengunggah bukti pengajuan.", 400);
    }

    if ($file['size'] > 5 * 1024 * 1024) {
        responseJSON(false, "Ukuran file maksimal 5 MB.", 400);
    }

    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($file['tmp_name']);

    $allowedTypes = [
        'application/pdf' => 'pdf',
        'image/jpeg' => 'jpg',
        'image/png' => 'png'
    ];

    if (!isset($allowedTypes[$mime])) {
        responseJSON(false, "Format bukti harus PDF, JPG, atau PNG.", 400);
    }

    $folderUpload = __DIR__ . '/../../uploads/pengajuan_izin/';

    if (!is_dir($folderUpload)) {
        if (!mkdir($folderUpload, 0775, true)) {
            responseJSON(false, "Folder upload tidak dapat dibuat.", 500);
        }
    }

    $namaFile = bin2hex(random_bytes(16)) . '.' . $allowedTypes[$mime];

    $filePathServer = $folderUpload . $namaFile;
    $filePathDB = 'uploads/pengajuan_izin/' . $namaFile;

    if (!move_uploaded_file($file['tmp_name'], $filePathServer)) {
        responseJSON(false, "Bukti pengajuan gagal disimpan.", 500);
    }
}

// =====================================================
// 5. PROSES PENGAJUAN
// =====================================================

try {

    $pdo->beginTransaction();

    // Pastikan siswa memiliki tepat satu program aktif.
    $sqlProgram = "
        SELECT program_id
        FROM peserta_program
        WHERE peserta_id = :peserta_id
          AND status = 'Aktif'
        ORDER BY id DESC
        FOR UPDATE
    ";

    $stmtProgram = $pdo->prepare($sqlProgram);
    $stmtProgram->execute([
        ':peserta_id' => $pesertaId
    ]);

    $programAktif = $stmtProgram->fetchAll(PDO::FETCH_COLUMN);

    if (count($programAktif) === 0) {
        $pdo->rollBack();

        if ($filePathServer && file_exists($filePathServer)) {
            unlink($filePathServer);
        }

        responseJSON(false, "Kamu belum memiliki program aktif.", 400);
    }

    if (count($programAktif) > 1) {
        $pdo->rollBack();

        if ($filePathServer && file_exists($filePathServer)) {
            unlink($filePathServer);
        }

        responseJSON(false, "Data program aktif siswa tidak valid. Hubungi admin.", 409);
    }

    $programId = (int) $programAktif[0];

    // =================================================
    // 6. BUAT ABSENSI SEMENTARA JIKA BELUM ADA
    // =================================================

    $sqlInsertAbsensi = "
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

    $stmtInsert = $pdo->prepare($sqlInsertAbsensi);

    $stmtInsert->execute([
        ':peserta_id' => $pesertaId,
        ':program_id' => $programId,
        ':tanggal' => $tanggalIzin
    ]);

    $absensiId = $stmtInsert->fetchColumn();

    // =================================================
    // 7. AMBIL DAN KUNCI DATA ABSENSI
    // =================================================

    $sqlAbsensi = "
        SELECT
            id,
            status,
            keterangan,
            waktu_masuk,
            waktu_keluar
        FROM absensi
        WHERE peserta_id = :peserta_id
          AND program_id = :program_id
          AND tanggal = :tanggal
        FOR UPDATE
    ";

    $stmtAbsensi = $pdo->prepare($sqlAbsensi);

    $stmtAbsensi->execute([
        ':peserta_id' => $pesertaId,
        ':program_id' => $programId,
        ':tanggal' => $tanggalIzin
    ]);

    $absensi = $stmtAbsensi->fetch(PDO::FETCH_ASSOC);

    if (!$absensi) {
        throw new Exception("Data absensi tidak ditemukan.");
    }

    $absensiId = (int) $absensi['id'];

    // =================================================
    // 8. CEK STATUS ABSENSI
    // =================================================

    if (
        $absensi['status'] !== 'alpha' ||
        $absensi['keterangan'] !== 'Menunggu pengajuan izin' ||
        $absensi['waktu_masuk'] !== null ||
        $absensi['waktu_keluar'] !== null
    ) {
        $pdo->rollBack();

        if ($filePathServer && file_exists($filePathServer)) {
            unlink($filePathServer);
        }

        responseJSON(
            false,
            "Pengajuan tidak dapat dilakukan karena absensi sudah tercatat atau sudah diproses.",
            409
        );
    }

    // =================================================
    // 9. CEK PENGAJUAN GANDA
    // =================================================

    $sqlCek = "
        SELECT id
        FROM pengajuan_izin
        WHERE absensi_id = :absensi_id
        LIMIT 1
    ";

    $stmtCek = $pdo->prepare($sqlCek);
    $stmtCek->execute([
        ':absensi_id' => $absensiId
    ]);

    if ($stmtCek->fetch()) {
        $pdo->rollBack();

        if ($filePathServer && file_exists($filePathServer)) {
            unlink($filePathServer);
        }

        responseJSON(false, "Pengajuan untuk tanggal tersebut sudah pernah dibuat.", 409);
    }

    // =================================================
    // 10. SIMPAN PENGAJUAN
    // =================================================

    $sqlPengajuan = "
        INSERT INTO pengajuan_izin (
            absensi_id,
            alasan,
            bukti_file,
            status,
            tanggal_izin,
            waktu_pengajuan
        )
        VALUES (
            :absensi_id,
            :alasan,
            :bukti_file,
            'menunggu',
            :tanggal_izin,
            CURRENT_TIMESTAMP
        )
        RETURNING id
    ";

    $stmtPengajuan = $pdo->prepare($sqlPengajuan);

    $stmtPengajuan->execute([
        ':absensi_id' => $absensiId,
        ':alasan' => $alasanLengkap,
        ':bukti_file' => $filePathDB,
        ':tanggal_izin' => $tanggalIzin
    ]);

    $idPengajuan = $stmtPengajuan->fetchColumn();

    $pdo->commit();

    responseJSON(
        true,
        "Pengajuan " . $jenisLabel . " berhasil dikirim dan menunggu persetujuan mentor.",
        201,
        [
            'id' => (int) $idPengajuan,
            'tanggal_izin' => $tanggalIzin,
            'jenis_pengajuan' => $jenisPengajuan,
            'status' => 'menunggu'
        ]
    );

} catch (Throwable $e) {

    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    if ($filePathServer && file_exists($filePathServer)) {
        unlink($filePathServer);
    }

    error_log("Pengajuan izin siswa: " . $e->getMessage());

    responseJSON(false, "Terjadi kesalahan saat mengirim pengajuan izin.", 500);
}

?>
