
<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Menangani preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/../../config/koneksi.php';
require_once __DIR__ . '/../../config/tab_auth.php';

// Memastikan token mentor valid
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

try {

    $mentorId = $userToken['user_id'];

    // ==================================================
    // MENGHITUNG TOTAL SISWA BIMBINGAN
    // ==================================================

    $stmtTotal = $pdo->prepare("
        SELECT COUNT(DISTINCT pp.peserta_id)

        FROM mentor_program mp

        JOIN peserta_program pp
            ON pp.program_id = mp.program_id

        JOIN users u
            ON u.id = pp.peserta_id

        WHERE mp.mentor_id = :mentor_id_siswa
          AND u.role = 'peserta'
    ");

    $stmtTotal->execute([
        ':mentor_id_siswa' => $mentorId
    ]);

    $totalSiswa = (int) $stmtTotal->fetchColumn();

    // ==================================================
    // MENGAMBIL REKAP STATUS KEHADIRAN HARI INI
    // ==================================================

    $sqlKehadiran = "

        WITH siswa_bimbingan AS (

            SELECT DISTINCT
                pp.peserta_id

            FROM mentor_program mp

            JOIN peserta_program pp
                ON pp.program_id = mp.program_id

            JOIN users u
                ON u.id = pp.peserta_id

            WHERE mp.mentor_id = :mentor_id_siswa
              AND u.role = 'peserta'
        ),

        status_harian AS (

            SELECT
                sb.peserta_id,

                CASE

                    WHEN BOOL_OR(
                        a.waktu_masuk IS NOT NULL
                        OR a.waktu_keluar IS NOT NULL
                    )
                    THEN 'hadir'

                    WHEN BOOL_OR(pi.status = 'menunggu')
                    THEN 'menunggu'

                    WHEN BOOL_OR(
                        pi.status = 'disetujui'
                        OR a.status = 'izin'
                    )
                    THEN 'izin'

                    WHEN BOOL_OR(a.status = 'sakit')
                    THEN 'sakit'

                    ELSE 'alpha'

                END AS status_hari_ini

            FROM siswa_bimbingan sb

            JOIN peserta_program pp
                ON pp.peserta_id = sb.peserta_id

            JOIN mentor_program mp
                ON mp.program_id = pp.program_id
               AND mp.mentor_id = :mentor_id_program

            LEFT JOIN absensi a
                ON a.peserta_id = pp.peserta_id
               AND a.program_id = pp.program_id
               AND a.tanggal = CURRENT_DATE

            LEFT JOIN pengajuan_izin pi
                ON pi.absensi_id = a.id

            WHERE EXTRACT(ISODOW FROM CURRENT_DATE) BETWEEN 1 AND 5

            GROUP BY sb.peserta_id
        )

        SELECT

            COUNT(*) FILTER (
                WHERE status_hari_ini = 'hadir'
            ) AS total_hadir,

            COUNT(*) FILTER (
                WHERE status_hari_ini = 'izin'
            ) AS total_izin,

            COUNT(*) FILTER (
                WHERE status_hari_ini = 'sakit'
            ) AS total_sakit,

            COUNT(*) FILTER (
                WHERE status_hari_ini = 'alpha'
            ) AS total_alpha,

            COUNT(*) FILTER (
                WHERE status_hari_ini = 'menunggu'
            ) AS total_belum_ada

        FROM status_harian
    ";

    $stmtKehadiran = $pdo->prepare($sqlKehadiran);

    $stmtKehadiran->execute([
        ':mentor_id_siswa' => $mentorId,
        ':mentor_id_program' => $mentorId
    ]);

    $kehadiran = $stmtKehadiran->fetch(PDO::FETCH_ASSOC);

    // ==================================================
    // MENGAMBIL HASIL PERHITUNGAN
    // ==================================================

    $totalHadir = (int) $kehadiran['total_hadir'];
    $totalIzin = (int) $kehadiran['total_izin'];
    $totalSakit = (int) $kehadiran['total_sakit'];
    $totalAlpha = (int) $kehadiran['total_alpha'];
    $totalBelumAda = (int) $kehadiran['total_belum_ada'];

    // ==================================================
    // MENGHITUNG PERSENTASE KEHADIRAN
    // ==================================================

    $totalDihitung = max(
        0,
        $totalSiswa - $totalBelumAda
    );

    $persentase = $totalDihitung > 0
        ? round(($totalHadir / $totalDihitung) * 100)
        : 0;

    // ==================================================
    // RESPONSE DATA DASHBOARD MENTOR
    // ==================================================

    echo json_encode([
        "success" => true,
        "message" => "Data dashboard mentor berhasil diambil.",

        "total_siswa" => $totalSiswa,

        "total_hadir" => $totalHadir,
        "total_izin" => $totalIzin,
        "total_sakit" => $totalSakit,
        "total_alpha" => $totalAlpha,
        "total_belum_ada" => $totalBelumAda,

        "total_dihitung" => $totalDihitung,
        "persentase_kehadiran" => $persentase
    ]);

} catch (PDOException $e) {

    error_log($e->getMessage());

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Gagal mengambil data kehadiran mentor."
    ]);
}

?>
