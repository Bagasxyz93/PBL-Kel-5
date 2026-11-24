
<?php

session_start();

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

// Menangani preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/../../config/koneksi.php';

// Memastikan mentor sudah login
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

try {

    $mentorId = $_SESSION['user_id'];

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

    // Nama parameter harus sama dengan query
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

                    -- Jika waktu masuk atau keluar terisi,
                    -- siswa dihitung hadir.
                    WHEN BOOL_OR(
                        a.waktu_masuk IS NOT NULL
                        OR a.waktu_keluar IS NOT NULL
                    )
                    THEN 'hadir'

                    -- Pengajuan izin masih menunggu.
                    WHEN BOOL_OR(pi.status = 'menunggu')
                    THEN 'menunggu'

                    -- Izin sudah disetujui mentor.
                    WHEN BOOL_OR(
                        pi.status = 'disetujui'
                        OR a.status = 'izin'
                    )
                    THEN 'izin'

                    -- Status sakit.
                    WHEN BOOL_OR(a.status = 'sakit')
                    THEN 'sakit'

                    -- Tidak ada kehadiran atau izin.
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

            -- Sabtu dan Minggu tidak dihitung.
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

    // Kedua parameter memiliki nama yang berbeda.
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

    // Siswa yang pengajuan izinnya masih menunggu
    // tidak dimasukkan ke dalam perhitungan sementara.

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

    // Detail error disimpan di log PHP.
    error_log($e->getMessage());

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Gagal mengambil data kehadiran mentor."
    ]);
}

?>
