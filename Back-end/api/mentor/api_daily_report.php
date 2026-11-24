
<?php

session_start();

// ==================================================
// PENGATURAN CORS
// ==================================================

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ==================================================
// KONEKSI DATABASE
// ==================================================

require_once __DIR__ . '/../../config/koneksi.php';

// ==================================================
// VALIDASI LOGIN MENTOR
// ==================================================

if (
    !isset($_SESSION['user_id']) ||
    !isset($_SESSION['role']) ||
    $_SESSION['role'] !== 'mentor'
) {
    http_response_code(401);

    echo json_encode([
        "success" => false,
        "message" => "Sesi mentor tidak ditemukan."
    ]);

    exit;
}

$mentor_id = $_SESSION['user_id'];

try {

    // ==================================================
    // METHOD GET: MENGAMBIL DAILY REPORT
    // ==================================================

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {

        $modeDashboard = ($_GET['mode'] ?? '') === 'dashboard';
        $modeDetail = isset($_GET['id']);

        // Zona waktu Indonesia
        $zonaWaktu = new DateTimeZone('Asia/Jakarta');

        $tanggalHariIni = new DateTimeImmutable('now', $zonaWaktu);
        $tanggalKemarin = $tanggalHariIni->modify('-1 day');

        // Default tanggal adalah hari ini
        $tanggalDipilih = $tanggalHariIni->format('Y-m-d');

        // ==================================================
        // VALIDASI TANGGAL PILIHAN
        // ==================================================

        if (
            !$modeDashboard &&
            !$modeDetail &&
            isset($_GET['tanggal'])
        ) {

            $tanggalInput = $_GET['tanggal'];

            $tanggalValid = DateTimeImmutable::createFromFormat(
                '!Y-m-d',
                $tanggalInput,
                $zonaWaktu
            );

            if (
                !$tanggalValid ||
                $tanggalValid->format('Y-m-d') !== $tanggalInput
            ) {

                http_response_code(400);

                echo json_encode([
                    "success" => false,
                    "message" => "Format tanggal tidak valid."
                ]);

                exit;
            }

            $tanggalDipilih = $tanggalInput;
        }

        // ==================================================
        // VALIDASI ID DETAIL
        // ==================================================

        if ($modeDetail) {

            if (
                !filter_var($_GET['id'], FILTER_VALIDATE_INT) ||
                (int) $_GET['id'] <= 0
            ) {

                http_response_code(400);

                echo json_encode([
                    "success" => false,
                    "message" => "ID Daily Report tidak valid."
                ]);

                exit;
            }
        }

        // ==================================================
        // QUERY UTAMA
        // ==================================================

        $sql = "
            SELECT
                dr.id,
                u.id AS peserta_id,
                u.nama,
                u.nisn,
                p.id AS program_id,
                p.nama_program,
                m.judul AS nama_materi,
                dr.tanggal,
                dr.judul,
                dr.isi_laporan,
                dr.bukti_file,
                dr.link_bukti,
                dr.status,
                dr.catatan_mentor,
                dr.created_at,
                dr.updated_at

            FROM daily_report dr

            INNER JOIN users u
                ON dr.peserta_id = u.id

            INNER JOIN materi m
                ON dr.materi_id = m.id

            INNER JOIN program p
                ON m.program_id = p.id

            INNER JOIN mentor_program mp
                ON mp.program_id = p.id

            WHERE mp.mentor_id = :mentor_id
              AND u.role = 'peserta'
        ";

        $params = [
            ':mentor_id' => $mentor_id
        ];

        // ==================================================
        // FILTER DATA
        // ==================================================

        if ($modeDetail) {

            // Mengambil satu laporan berdasarkan ID
            $sql .= " AND dr.id = :report_id";

            $params[':report_id'] = (int) $_GET['id'];

        } else {

            // Dashboard dan halaman Kelola Daily Report
            // menggunakan filter tanggal
            $sql .= " AND dr.tanggal = :tanggal";

            $params[':tanggal'] = $tanggalDipilih;
        }

        // ==================================================
        // URUTAN DATA
        // ==================================================

        $sql .= "
            ORDER BY dr.created_at DESC, dr.id DESC
        ";

        // Maksimal 5 laporan untuk Dashboard Mentor
        if (!$modeDetail && $modeDashboard) {
            $sql .= " LIMIT 5";
        }

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        $laporan = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // ==================================================
        // DASHBOARD:
        // JIKA HARI INI KOSONG, AMBIL LAPORAN KEMARIN
        // ==================================================

        if (
            !$modeDetail &&
            $modeDashboard &&
            empty($laporan)
        ) {

            $params[':tanggal'] = $tanggalKemarin->format('Y-m-d');

            $stmt->execute($params);

            $laporan = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        // ==================================================
        // DETAIL SATU DAILY REPORT
        // ==================================================

        if ($modeDetail) {

            if (empty($laporan)) {

                http_response_code(404);

                echo json_encode([
                    "success" => false,
                    "message" => "Daily Report tidak ditemukan."
                ]);

                exit;
            }

            echo json_encode([
                "success" => true,
                "message" => "Detail Daily Report berhasil diambil.",
                "data" => $laporan[0]
            ], JSON_UNESCAPED_UNICODE);

            exit;
        }

        // ==================================================
        // MENGHITUNG TOTAL PESERTA BIMBINGAN MENTOR
        // ==================================================

        $stmtTotal = $pdo->prepare("
            SELECT COUNT(DISTINCT pp.peserta_id)

            FROM peserta_program pp

            INNER JOIN mentor_program mp
                ON mp.program_id = pp.program_id

            INNER JOIN users u
                ON u.id = pp.peserta_id

            WHERE mp.mentor_id = :mentor_id
              AND u.role = 'peserta'
        ");

        $stmtTotal->execute([
            ':mentor_id' => $mentor_id
        ]);

        $totalPeserta = (int) $stmtTotal->fetchColumn();

        // ==================================================
        // MENGHITUNG PESERTA YANG SUDAH MELAPOR
        // PADA TANGGAL PILIHAN
        // ==================================================

        $daftarPesertaSudahLapor = array_unique(
            array_column($laporan, 'peserta_id')
        );

        $siswaSudahLapor = count($daftarPesertaSudahLapor);

        // ==================================================
        // MENGHITUNG PESERTA YANG BELUM MELAPOR
        // ==================================================

        $siswaBelumLapor = max(
            0,
            $totalPeserta - $siswaSudahLapor
        );

        // ==================================================
        // PERSENTASE LAPORAN MASUK
        // ==================================================

        $persentaseMasuk = $totalPeserta > 0
            ? round(($siswaSudahLapor / $totalPeserta) * 100)
            : 0;

        // ==================================================
        // RESPONSE
        // ==================================================

        echo json_encode([

            "success" => true,

            "message" => "Data Daily Report berhasil diambil.",

            "tanggal" => $tanggalDipilih,

            "data" => $laporan,

            "statistik" => [
                "total_peserta" => $totalPeserta,
                "siswa_sudah_lapor" => $siswaSudahLapor,
                "siswa_belum_lapor" => $siswaBelumLapor,
                "persentase_masuk" => $persentaseMasuk
            ]

        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    // ==================================================
    // METHOD PUT: MEMPERBARUI STATUS DAILY REPORT
    // ==================================================

    if ($_SERVER['REQUEST_METHOD'] === 'PUT') {

        $input = json_decode(
            file_get_contents("php://input"),
            true
        );

        if (!is_array($input)) {

            http_response_code(400);

            echo json_encode([
                "success" => false,
                "message" => "Format data tidak valid."
            ]);

            exit;
        }

        $report_id = $input['id'] ?? null;
        $status = $input['status'] ?? null;
        $catatan = $input['catatan_mentor'] ?? null;

        // ==================================================
        // VALIDASI ID
        // ==================================================

        if (
            !filter_var($report_id, FILTER_VALIDATE_INT) ||
            (int) $report_id <= 0
        ) {

            http_response_code(400);

            echo json_encode([
                "success" => false,
                "message" => "ID Daily Report tidak valid."
            ]);

            exit;
        }

        // ==================================================
        // VALIDASI STATUS
        // ==================================================

        $status_valid = [
            'diterima',
            'ditolak'
        ];

        if (!in_array($status, $status_valid, true)) {

            http_response_code(400);

            echo json_encode([
                "success" => false,
                "message" => "Status hanya boleh diterima atau ditolak."
            ]);

            exit;
        }

        // ==================================================
        // VALIDASI CATATAN
        // ==================================================

        if ($catatan !== null && !is_string($catatan)) {

            http_response_code(400);

            echo json_encode([
                "success" => false,
                "message" => "Catatan mentor harus berupa teks."
            ]);

            exit;
        }

        // ==================================================
        // MEMASTIKAN LAPORAN MILIK MENTOR
        // ==================================================

        $stmt = $pdo->prepare("

            UPDATE daily_report dr

            SET
                status = :status,
                catatan_mentor = :catatan,
                updated_at = CURRENT_TIMESTAMP

            FROM users u,
                 materi m,
                 program p,
                 mentor_program mp

            WHERE dr.id = :report_id

              AND dr.peserta_id = u.id
              AND dr.materi_id = m.id
              AND m.program_id = p.id
              AND mp.program_id = p.id

              AND mp.mentor_id = :mentor_id
              AND u.role = 'peserta'

            RETURNING dr.id

        ");

        $stmt->execute([
            ':status' => $status,
            ':catatan' => $catatan,
            ':report_id' => (int) $report_id,
            ':mentor_id' => $mentor_id
        ]);

        $hasil = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$hasil) {

            http_response_code(404);

            echo json_encode([
                "success" => false,
                "message" => "Daily Report tidak ditemukan atau bukan tanggung jawab mentor ini."
            ]);

            exit;
        }

        // ==================================================
        // RESPONSE PEMBARUAN
        // ==================================================

        echo json_encode([

            "success" => true,

            "message" => "Penilaian Daily Report berhasil disimpan.",

            "data" => [
                "id" => (int) $hasil['id'],
                "status" => $status,
                "catatan_mentor" => $catatan
            ]

        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    // ==================================================
    // METHOD SELAIN GET DAN PUT
    // ==================================================

    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Method tidak diizinkan."
    ]);

} catch (Throwable $e) {

    error_log($e->getMessage());

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Terjadi kesalahan pada API Daily Report."
    ]);

}

?>
