
<?php

ob_start();

header("Content-Type: application/json; charset=UTF-8");
require_once __DIR__ . '/../../config/cors.php';
date_default_timezone_set('Asia/Jakarta');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once '../../config/koneksi.php';
require_once '../../config/tab_auth.php';

function responseJSON($status, $message, $data = null)
{
    if (ob_get_length()) {
        ob_clean();
    }

    http_response_code($status);

    echo json_encode([
        'success' => $status >= 200 && $status < 300,
        'message' => $message,
        'data' => $data
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

// =====================================================
// AUTENTIKASI
// =====================================================

$userToken = ambilUserToken();

if (!$userToken || $userToken['role'] !== 'peserta') {
    responseJSON(401, 'Akses ditolak. Silakan login sebagai siswa.');
}

$pesertaId = (int) $userToken['user_id'];

// =====================================================
// GET : MATERI DAN RIWAYAT
// =====================================================

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $aksi = $_GET['aksi'] ?? '';

    // ---------------------------------------------
    // GET MATERI
    // ---------------------------------------------

    if ($aksi === 'materi') {

        try {

            $query = "
                SELECT
                    m.id,
                    m.judul,
                    m.tanggal_publikasi,
                    m.program_id,
                    p.nama_program
                FROM materi m
                INNER JOIN peserta_program pp
                    ON pp.program_id = m.program_id
                INNER JOIN program p
                    ON p.id = m.program_id
                WHERE pp.peserta_id = :peserta_id
                ORDER BY m.tanggal_publikasi DESC, m.id DESC
            ";

            $stmt = $pdo->prepare($query);

            $stmt->execute([
                ':peserta_id' => $pesertaId
            ]);

            $materi = $stmt->fetchAll(PDO::FETCH_ASSOC);

            responseJSON(200, 'Data materi berhasil diambil.', $materi);

        } catch (PDOException $e) {

            responseJSON(500, 'Gagal mengambil data materi.');
        }
    }

    // ---------------------------------------------
    // GET RIWAYAT DAILY REPORT
    // ---------------------------------------------

    if ($aksi === 'riwayat') {

        try {

            $query = "
                SELECT
                    dr.id,
                    dr.peserta_id,
                    dr.materi_id,
                    dr.tanggal,
                    dr.judul,
                    dr.isi_laporan,
                    dr.bukti_file,
                    dr.link_bukti,
                    dr.status,
                    dr.catatan_mentor,
                    dr.created_at,
                    dr.updated_at,
                    m.judul AS judul_materi,
                    p.nama_program,
                    u.nama AS nama_mentor
                FROM daily_report dr
                INNER JOIN materi m
                    ON m.id = dr.materi_id
                INNER JOIN program p
                    ON p.id = m.program_id
                LEFT JOIN users u
                    ON u.id = m.mentor_id
                WHERE dr.peserta_id = :peserta_id
                ORDER BY dr.tanggal DESC, dr.created_at DESC
            ";

            $stmt = $pdo->prepare($query);

            $stmt->execute([
                ':peserta_id' => $pesertaId
            ]);

            $riwayat = $stmt->fetchAll(PDO::FETCH_ASSOC);

            responseJSON(200, 'Riwayat laporan berhasil diambil.', $riwayat);

        } catch (PDOException $e) {

            responseJSON(500, 'Gagal mengambil riwayat laporan.');
        }
    }

    responseJSON(400, 'Aksi GET tidak valid.');
}

// =====================================================
// POST : SUBMIT DAILY REPORT
// =====================================================

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    try {

        // ---------------------------------------------
        // VALIDASI INPUT
        // ---------------------------------------------

        $materiId = isset($_POST['materi_id'])
            ? (int) $_POST['materi_id']
            : 0;

        $tanggal = trim($_POST['tanggal'] ?? '');
        $judul = trim($_POST['judul'] ?? '');
        $isiLaporan = trim($_POST['isi_laporan'] ?? '');

        if (
            $materiId <= 0 ||
            $tanggal === '' ||
            $judul === '' ||
            $isiLaporan === ''
        ) {
            responseJSON(400, 'Semua field wajib diisi.');
        }

        if (strlen($judul) > 150) {
            responseJSON(400, 'Judul maksimal 150 karakter.');
        }

        // Validasi format tanggal
        $tanggalObj = DateTime::createFromFormat('Y-m-d', $tanggal);

        if (
            !$tanggalObj ||
            $tanggalObj->format('Y-m-d') !== $tanggal
        ) {
            responseJSON(400, 'Format tanggal tidak valid.');
        }

        // ---------------------------------------------
        // VALIDASI MATERI MILIK PROGRAM SISWA
        // ---------------------------------------------

        $queryMateri = "
            SELECT m.id
            FROM materi m
            INNER JOIN peserta_program pp
                ON pp.program_id = m.program_id
            WHERE m.id = :materi_id
              AND pp.peserta_id = :peserta_id
            LIMIT 1
        ";

        $stmtMateri = $pdo->prepare($queryMateri);

        $stmtMateri->execute([
            ':materi_id' => $materiId,
            ':peserta_id' => $pesertaId
        ]);

        if (!$stmtMateri->fetch(PDO::FETCH_ASSOC)) {
            responseJSON(403, 'Materi tidak tersedia untuk peserta ini.');
        }

        // ---------------------------------------------
        // VALIDASI FILE
        // ---------------------------------------------

        if (
            !isset($_FILES['bukti_pekerjaan']) ||
            $_FILES['bukti_pekerjaan']['error'] !== UPLOAD_ERR_OK
        ) {
            responseJSON(400, 'Bukti pekerjaan wajib diunggah.');
        }

        $file = $_FILES['bukti_pekerjaan'];

        // Maksimal 10 MB
        if ($file['size'] > 10 * 1024 * 1024) {
            responseJSON(400, 'Ukuran file maksimal 10 MB.');
        }

        $namaAsli = $file['name'];

        $ekstensi = strtolower(
            pathinfo($namaAsli, PATHINFO_EXTENSION)
        );

        $ekstensiDiizinkan = [
            'png',
            'jpg',
            'jpeg',
            'pdf',
            'zip'
        ];

        if (!in_array($ekstensi, $ekstensiDiizinkan, true)) {
            responseJSON(400, 'Format file tidak diizinkan.');
        }

        // Validasi MIME file
        $mimeFile = mime_content_type($file['tmp_name']);

        $mimeDiizinkan = [
            'png' => ['image/png'],
            'jpg' => ['image/jpeg'],
            'jpeg' => ['image/jpeg'],
            'pdf' => ['application/pdf'],
            'zip' => ['application/zip', 'application/x-zip-compressed']
        ];

        if (
            !$mimeFile ||
            !in_array($mimeFile, $mimeDiizinkan[$ekstensi], true)
        ) {
            responseJSON(400, 'Isi file tidak sesuai format yang diizinkan.');
        }

        // ---------------------------------------------
        // CEK DUPLIKASI LAPORAN
        // ---------------------------------------------

        $queryCek = "
            SELECT id
            FROM daily_report
            WHERE peserta_id = :peserta_id
              AND materi_id = :materi_id
              AND tanggal = :tanggal
            LIMIT 1
        ";

        $stmtCek = $pdo->prepare($queryCek);

        $stmtCek->execute([
            ':peserta_id' => $pesertaId,
            ':materi_id' => $materiId,
            ':tanggal' => $tanggal
        ]);

        if ($stmtCek->fetch(PDO::FETCH_ASSOC)) {
            responseJSON(
                409,
                'Laporan untuk materi dan tanggal tersebut sudah pernah dibuat.'
            );
        }

        // ---------------------------------------------
        // DIREKTORI UPLOAD
        // ---------------------------------------------

        $folderUpload = __DIR__ . '/../../uploads/daily_report/';

        if (!is_dir($folderUpload)) {

            if (!mkdir($folderUpload, 0755, true)) {
                responseJSON(500, 'Gagal membuat folder upload.');
            }
        }

        // Nama file unik
        $namaFileBaru = bin2hex(random_bytes(16)) . '.' . $ekstensi;

        $pathFile = $folderUpload . $namaFileBaru;

        // ---------------------------------------------
        // SIMPAN FILE
        // ---------------------------------------------

        if (!move_uploaded_file($file['tmp_name'], $pathFile)) {
            responseJSON(500, 'Gagal menyimpan bukti pekerjaan.');
        }

        $pathDatabase = 'uploads/daily_report/' . $namaFileBaru;

        // ---------------------------------------------
        // INSERT DAILY REPORT
        // ---------------------------------------------

        $queryInsert = "
            INSERT INTO daily_report (
                peserta_id,
                materi_id,
                tanggal,
                judul,
                isi_laporan,
                bukti_file,
                status,
                created_at,
                updated_at
            )
            VALUES (
                :peserta_id,
                :materi_id,
                :tanggal,
                :judul,
                :isi_laporan,
                :bukti_file,
                'menunggu',
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            )
            RETURNING id
        ";

        $stmtInsert = $pdo->prepare($queryInsert);

        $stmtInsert->execute([
            ':peserta_id' => $pesertaId,
            ':materi_id' => $materiId,
            ':tanggal' => $tanggal,
            ':judul' => $judul,
            ':isi_laporan' => $isiLaporan,
            ':bukti_file' => $pathDatabase
        ]);

        $reportId = $stmtInsert->fetchColumn();

        responseJSON(
            201,
            'Daily Report berhasil dikirim.',
            [
                'id' => $reportId,
                'status' => 'menunggu',
                'bukti_file' => $pathDatabase
            ]
        );

    } catch (PDOException $e) {

        // Menghapus file jika insert database gagal
        if (isset($pathFile) && file_exists($pathFile)) {
            unlink($pathFile);
        }

        // Penanganan unique index
        if ($e->getCode() === '23505') {
            responseJSON(
                409,
                'Laporan untuk materi dan tanggal tersebut sudah pernah dibuat.'
            );
        }

        responseJSON(500, 'Gagal menyimpan Daily Report.');
    }
}

// =====================================================
// METHOD TIDAK DIDUKUNG
// =====================================================

responseJSON(405, 'Method tidak diizinkan.');
