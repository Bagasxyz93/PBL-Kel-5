
<?php

// =====================================================
// API MATERI SISWA
// =====================================================

header("Content-Type: application/json; charset=UTF-8");
require_once __DIR__ . '/../../config/cors.php';
date_default_timezone_set('Asia/Jakarta');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method tidak diizinkan.'
    ]);
    exit;
}

require_once '../../config/koneksi.php';
require_once '../../config/tab_auth.php';

// =====================================================
// VALIDASI TOKEN SISWA
// =====================================================

$userToken = ambilUserToken();

if (!$userToken || $userToken['role'] !== 'peserta') {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Akses ditolak. Sesi siswa tidak ditemukan.'
    ]);
    exit;
}

$pesertaId = (int) $userToken['user_id'];

try {

    // =================================================
    // MENGAMBIL PROGRAM YANG DIIKUTI SISWA
    // =================================================

    $queryProgram = "
        SELECT DISTINCT
            pp.program_id,
            p.nama_program
        FROM peserta_program pp
        JOIN program p ON p.id = pp.program_id
        WHERE pp.peserta_id = :peserta_id
        ORDER BY p.nama_program ASC
    ";

    $stmtProgram = $pdo->prepare($queryProgram);
    $stmtProgram->execute([
        ':peserta_id' => $pesertaId
    ]);

    $programSiswa = $stmtProgram->fetchAll(PDO::FETCH_ASSOC);

    // =================================================
    // JIKA SISWA BELUM MEMILIKI PROGRAM
    // =================================================

    if (empty($programSiswa)) {
        echo json_encode([
            'success' => true,
            'message' => 'Siswa belum terdaftar pada program.',
            'data' => [
                'program' => [],
                'materi' => []
            ]
        ]);
        exit;
    }

    // =================================================
    // MENGAMBIL ID PROGRAM SISWA
    // =================================================

    $programIds = array_column($programSiswa, 'program_id');

    $placeholder = implode(',', array_fill(0, count($programIds), '?'));

    // =================================================
    // MENGAMBIL MATERI SESUAI PROGRAM SISWA
    // =================================================

    $queryMateri = "
        SELECT
            m.id,
            m.program_id,
            p.nama_program,
            m.mentor_id,
            u.nama AS nama_mentor,
            m.judul,
            m.konten_materi,
            m.file_materi,
            m.tanggal_publikasi
        FROM materi m
        JOIN program p ON p.id = m.program_id
        JOIN users u ON u.id = m.mentor_id
        WHERE m.program_id IN ($placeholder)
        ORDER BY m.tanggal_publikasi DESC, m.id DESC
    ";

    $stmtMateri = $pdo->prepare($queryMateri);
    $stmtMateri->execute($programIds);

    $materi = $stmtMateri->fetchAll(PDO::FETCH_ASSOC);

    // =================================================
    // RESPONSE
    // =================================================

    echo json_encode([
        'success' => true,
        'message' => 'Data materi berhasil diambil.',
        'data' => [
            'program' => $programSiswa,
            'materi' => $materi
        ]
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'message' => 'Terjadi kesalahan saat mengambil data materi.',
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>
