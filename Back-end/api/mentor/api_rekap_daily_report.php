
<?php

require_once __DIR__ . '/../../config/cors.php';header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/../../config/koneksi.php';
require_once __DIR__ . '/../../config/tab_auth.php';

// ==================================================
// VALIDASI TOKEN MENTOR
// ==================================================

$userToken = ambilUserToken();

if (
    !$userToken ||
    $userToken['role'] !== 'mentor'
) {
    http_response_code(401);

    echo json_encode([
        "success" => false,
        "message" => "Token mentor tidak valid atau sudah kedaluwarsa."
    ]);

    exit;
}

// Hanya menerima GET.
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Method tidak diizinkan."
    ]);

    exit;
}

$mentor_id = (int) $userToken['user_id'];
$tanggal = $_GET['tanggal'] ?? '';

try {

    // Validasi tanggal.
    $tanggalObj = DateTime::createFromFormat('!Y-m-d', $tanggal);

    if (
        !$tanggalObj ||
        $tanggalObj->format('Y-m-d') !== $tanggal
    ) {
        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Tanggal tidak valid. Gunakan format YYYY-MM-DD."
        ]);

        exit;
    }

    // Ambil identitas mentor.
    $stmtMentor = $pdo->prepare("
        SELECT nama
        FROM users
        WHERE id = ?
          AND role = 'mentor'
    ");

    $stmtMentor->execute([$mentor_id]);

    $mentor = $stmtMentor->fetch(PDO::FETCH_ASSOC);

    if (!$mentor) {
        http_response_code(404);

        echo json_encode([
            "success" => false,
            "message" => "Data mentor tidak ditemukan."
        ]);

        exit;
    }

    // Ambil seluruh program yang menjadi tanggung jawab mentor.
    $stmtProgram = $pdo->prepare("
        SELECT DISTINCT
            p.id AS program_id,
            p.nama_program

        FROM mentor_program mp

        JOIN program p
            ON p.id = mp.program_id

        WHERE mp.mentor_id = ?

        ORDER BY p.nama_program ASC
    ");

    $stmtProgram->execute([$mentor_id]);

    $programList = $stmtProgram->fetchAll(PDO::FETCH_ASSOC);

    $rekap = [];

    // Siapkan struktur setiap program.
    foreach ($programList as $program) {

        $programId = (int) $program['program_id'];

        $rekap[$programId] = [
            "program_id" => $programId,
            "nama_program" => $program['nama_program'],
            "total_peserta" => 0,
            "sudah_lapor" => 0,
            "belum_lapor" => 0,
            "persentase_masuk" => 0,
            "peserta" => []
        ];
    }

    // Jika mentor belum memiliki program.
    if (empty($rekap)) {

        echo json_encode([
            "success" => true,
            "message" => "Mentor belum memiliki program.",
            "mentor" => $mentor['nama'],
            "tanggal" => $tanggal,
            "data" => []
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    // Ambil semua peserta aktif dari program mentor.
    $stmtPeserta = $pdo->prepare("
        SELECT DISTINCT
            p.id AS program_id,
            u.id AS peserta_id,
            u.nama,
            u.nisn

        FROM mentor_program mp

        JOIN peserta_program pp
            ON pp.program_id = mp.program_id

        JOIN program p
            ON p.id = mp.program_id

        JOIN users u
            ON u.id = pp.peserta_id

        WHERE mp.mentor_id = ?
          AND LOWER(pp.status) = 'aktif'
          AND u.role = 'peserta'

        ORDER BY p.id, u.nama
    ");

    $stmtPeserta->execute([$mentor_id]);

    $daftarPeserta = $stmtPeserta->fetchAll(PDO::FETCH_ASSOC);

    // Masukkan peserta ke program masing-masing.
    foreach ($daftarPeserta as $peserta) {

        $programId = (int) $peserta['program_id'];

        if (!isset($rekap[$programId])) {
            continue;
        }

        $pesertaId = (int) $peserta['peserta_id'];

        $rekap[$programId]['peserta'][$pesertaId] = [
            "peserta_id" => $pesertaId,
            "nama" => $peserta['nama'],
            "nisn" => $peserta['nisn'],
            "laporan" => []
        ];
    }

    // Ambil laporan berdasarkan tanggal yang dipilih.
    $stmtLaporan = $pdo->prepare("
        SELECT
            dr.id AS laporan_id,
            dr.peserta_id,
            p.id AS program_id,
            dr.tanggal,
            dr.judul,
            dr.isi_laporan,
            dr.bukti_file,
            dr.link_bukti,
            dr.status::text AS status,
            dr.catatan_mentor,
            m.judul AS nama_materi

        FROM daily_report dr

        JOIN users u
            ON u.id = dr.peserta_id

        JOIN materi m
            ON m.id = dr.materi_id

        JOIN program p
            ON p.id = m.program_id

        JOIN mentor_program mp
            ON mp.program_id = p.id

        JOIN peserta_program pp
            ON pp.peserta_id = dr.peserta_id
           AND pp.program_id = p.id

        WHERE mp.mentor_id = ?
          AND LOWER(pp.status) = 'aktif'
          AND u.role = 'peserta'
          AND dr.tanggal = ?

        ORDER BY p.nama_program, u.nama, dr.id
    ");

    $stmtLaporan->execute([
        $mentor_id,
        $tanggal
    ]);

    $daftarLaporan = $stmtLaporan->fetchAll(PDO::FETCH_ASSOC);

    // Masukkan laporan ke peserta yang sesuai.
    foreach ($daftarLaporan as $laporan) {

        $programId = (int) $laporan['program_id'];
        $pesertaId = (int) $laporan['peserta_id'];

        if (
            !isset($rekap[$programId]) ||
            !isset($rekap[$programId]['peserta'][$pesertaId])
        ) {
            continue;
        }

        $rekap[$programId]['peserta'][$pesertaId]['laporan'][] = [
            "id" => (int) $laporan['laporan_id'],
            "tanggal" => $laporan['tanggal'],
            "judul" => $laporan['judul'],
            "nama_materi" => $laporan['nama_materi'],
            "isi_laporan" => $laporan['isi_laporan'],
            "bukti_file" => $laporan['bukti_file'],
            "link_bukti" => $laporan['link_bukti'],
            "status" => $laporan['status'],
            "catatan_mentor" => $laporan['catatan_mentor']
        ];
    }

    // Hitung statistik masing-masing program.
    foreach ($rekap as &$program) {

        $total = count($program['peserta']);
        $sudahLapor = 0;

        foreach ($program['peserta'] as &$peserta) {

            // Peserta dianggap sudah lapor jika memiliki minimal satu laporan.
            if (!empty($peserta['laporan'])) {
                $sudahLapor++;
            }
        }

        unset($peserta);

        $program['total_peserta'] = $total;
        $program['sudah_lapor'] = $sudahLapor;
        $program['belum_lapor'] = $total - $sudahLapor;

        $program['persentase_masuk'] = $total > 0
            ? round(($sudahLapor / $total) * 100)
            : 0;

        // Ubah daftar peserta menjadi array biasa.
        $program['peserta'] = array_values($program['peserta']);
    }

    unset($program);

    echo json_encode([
        "success" => true,
        "message" => "Rekap Daily Report berhasil diambil.",
        "mentor" => $mentor['nama'],
        "tanggal" => $tanggal,
        "data" => array_values($rekap)
    ], JSON_UNESCAPED_UNICODE);

    exit;

} catch (Throwable $e) {

    error_log($e->getMessage());

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Terjadi kesalahan saat mengambil data rekap."
    ]);

    exit;
}

?>
