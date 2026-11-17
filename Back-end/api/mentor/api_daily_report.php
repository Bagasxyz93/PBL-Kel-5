<?php

session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'domain' => 'localhost',
    'secure' => false,
    'httponly' => true,
    'samesite' => 'Lax'
]);

session_start();

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/../../config/koneksi.php';

// Pastikan mentor sudah login.
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
    // METHOD GET: Mengambil Daily Report
    // ==================================================

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {

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

            JOIN users u
                ON dr.peserta_id = u.id

            JOIN materi m
                ON dr.materi_id = m.id

            JOIN program p
                ON m.program_id = p.id

            JOIN mentor_program mp
                ON mp.program_id = p.id

            WHERE mp.mentor_id = ?
              AND u.role = 'peserta'
        ";

        // Jika ada parameter ID, ambil satu laporan saja.
        if (isset($_GET['id'])) {
            $sql .= " AND dr.id = ?";
        }

        $sql .= "
            ORDER BY dr.created_at DESC, dr.id DESC
        ";

        $stmt = $pdo->prepare($sql);

        if (isset($_GET['id'])) {

            $stmt->execute([
                $mentor_id,
                $_GET['id']
            ]);

        } else {

            $stmt->execute([$mentor_id]);

        }

        $laporan = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Jika mengambil detail satu laporan.
        if (isset($_GET['id'])) {

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
            ]);

            exit;

        }

        // ==================================================
        // MENGHITUNG TOTAL SISWA BIMBINGAN MENTOR
        // ==================================================

        $stmtTotal = $pdo->prepare("
            SELECT COUNT(DISTINCT pp.peserta_id)
            FROM peserta_program pp

            JOIN mentor_program mp
                ON mp.program_id = pp.program_id

            JOIN users u
                ON u.id = pp.peserta_id

            WHERE mp.mentor_id = ?
              AND u.role = 'peserta'
        ");

        $stmtTotal->execute([$mentor_id]);

        $totalPeserta = (int) $stmtTotal->fetchColumn();

        // ==================================================
        // MENGHITUNG SISWA YANG SUDAH MENGIRIM LAPORAN
        // ==================================================

        $daftarPesertaSudahLapor = array_unique(
            array_column($laporan, 'peserta_id')
        );

        $siswaSudahLapor = count($daftarPesertaSudahLapor);

        // ==================================================
        // MENGHITUNG PERSENTASE LAPORAN MASUK
        // ==================================================

        $persentaseMasuk = $totalPeserta > 0
            ? round(($siswaSudahLapor / $totalPeserta) * 100)
            : 0;

        // ==================================================
        // RESPONSE SELURUH DAILY REPORT DAN STATISTIK
        // ==================================================

        echo json_encode([
            "success" => true,
            "message" => "Data Daily Report berhasil diambil.",

            "data" => $laporan,

            "statistik" => [
                "total_peserta" => $totalPeserta,
                "siswa_sudah_lapor" => $siswaSudahLapor,
                "persentase_masuk" => $persentaseMasuk
            ]
        ]);

        exit;

    }


    // ==================================================
    // METHOD PUT: Memperbarui Status Daily Report
    // ==================================================

    if ($_SERVER['REQUEST_METHOD'] === 'PUT') {

        // Ambil data JSON dari frontend.
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

        // Validasi ID.
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

        // Validasi status.
        $status_valid = ['diterima', 'ditolak'];

        if (!in_array($status, $status_valid, true)) {

            http_response_code(400);

            echo json_encode([
                "success" => false,
                "message" => "Status hanya boleh diterima atau ditolak."
            ]);

            exit;

        }

        // Validasi catatan mentor.
        if ($catatan !== null && !is_string($catatan)) {

            http_response_code(400);

            echo json_encode([
                "success" => false,
                "message" => "Catatan mentor harus berupa teks."
            ]);

            exit;

        }

        // Pastikan laporan merupakan tanggung jawab mentor.
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

        echo json_encode([
            "success" => true,
            "message" => "Penilaian Daily Report berhasil disimpan.",

            "data" => [
                "id" => (int) $hasil['id'],
                "status" => $status,
                "catatan_mentor" => $catatan
            ]
        ]);

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
