<?php

// Pengaturan CORS
$allowedOrigin = 'http://localhost:5173';

if (isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['HTTP_ORIGIN'] === $allowedOrigin) {
    header("Access-Control-Allow-Origin: $allowedOrigin");
}

header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Accept");

// Menangani preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Hanya menerima request GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Metode request tidak diizinkan."
    ]);

    exit;
}

session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'domain' => 'localhost',
    'secure' => false,
    'httponly' => true,
    'samesite' => 'Lax'
]);

session_start();


/* =========================================================
   KONEKSI DATABASE
========================================================= */

// Lokasi file: Back-end/api/mentor/api_absensi_mentor.php
// File koneksi: Back-end/config/koneksi.php

require_once dirname(__DIR__, 2) . '/config/koneksi.php';

$pdo = $pdo ?? ($conn ?? ($koneksi ?? null));

if (!$pdo instanceof PDO) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Koneksi database tidak ditemukan."
    ]);

    exit;
}


/* =========================================================
   IDENTITAS DAN HAK AKSES MENTOR
========================================================= */

$mentorId = $_SESSION['user_id'] ?? null;

if (!$mentorId || ($_SESSION['role'] ?? '') !== 'mentor') {
    http_response_code(401);

    echo json_encode([
        "success" => false,
        "message" => "Akses hanya untuk mentor. Silakan login kembali."
    ]);

    exit;
}


/* =========================================================
   PROSES API
========================================================= */

try {

    $aksi = $_GET['aksi'] ?? 'rekap';


    /* =====================================================
       1. REKAP ABSENSI PESERTA
    ===================================================== */

    if ($aksi === 'rekap') {

        $sql = "
            SELECT
                u.id AS peserta_id,
                u.nama,
                u.nisn,

                p.id AS program_id,
                p.nama_program AS program,

                latest_absen.status::text AS status_absen,
                latest_absen.tanggal,
                latest_absen.waktu_masuk,
                latest_absen.waktu_keluar,

                latest_report.status::text AS status_report,

                COALESCE(statistik.total_absensi, 0) AS total_absensi,
                COALESCE(statistik.total_hadir, 0) AS total_hadir,

                CASE
                    WHEN COALESCE(statistik.total_absensi, 0) = 0
                    THEN 0

                    ELSE ROUND(
                        statistik.total_hadir * 100.0 /
                        statistik.total_absensi
                    )
                END AS persentase_kehadiran

            FROM mentor_program mp

            JOIN program p
                ON p.id = mp.program_id

            JOIN peserta_program pp
                ON pp.program_id = p.id
                AND LOWER(pp.status) = 'aktif'

            JOIN users u
                ON u.id = pp.peserta_id

            LEFT JOIN LATERAL (
                SELECT
                    a.status,
                    a.tanggal,
                    a.waktu_masuk,
                    a.waktu_keluar

                FROM absensi a

                WHERE a.peserta_id = u.id
                  AND a.program_id = p.id

                ORDER BY a.tanggal DESC, a.id DESC

                LIMIT 1

            ) latest_absen ON TRUE

            LEFT JOIN LATERAL (
                SELECT
                    dr.status

                FROM daily_report dr

                JOIN materi m
                    ON m.id = dr.materi_id

                WHERE dr.peserta_id = u.id
                  AND m.program_id = p.id
                  AND m.mentor_id = mp.mentor_id

                ORDER BY dr.tanggal DESC, dr.id DESC

                LIMIT 1

            ) latest_report ON TRUE

            LEFT JOIN LATERAL (
                SELECT
                    COUNT(*) AS total_absensi,

                    COUNT(*) FILTER (
                        WHERE a.status::text = 'hadir'
                    ) AS total_hadir

                FROM absensi a

                WHERE a.peserta_id = u.id
                  AND a.program_id = p.id

            ) statistik ON TRUE

            WHERE mp.mentor_id = :mentor_id

            ORDER BY u.nama ASC
        ";

        $stmt = $pdo->prepare($sql);

        $stmt->execute([
            ':mentor_id' => $mentorId
        ]);

        $hasil = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $data = [];

        foreach ($hasil as $row) {

            // Status absensi terbaru
            $status = $row['status_absen']
                ? ucfirst($row['status_absen'])
                : 'Belum ada';

            // Status Daily Report terbaru
            $statusReport = $row['status_report']
                ? ucfirst($row['status_report'])
                : 'Belum ada';

            // Format waktu masuk
            $jamMasuk = $row['waktu_masuk']
                ? date('H:i', strtotime($row['waktu_masuk'])) . ' WIB'
                : '-';

            // Format waktu keluar
            $jamKeluar = $row['waktu_keluar']
                ? date('H:i', strtotime($row['waktu_keluar'])) . ' WIB'
                : '-';

            // Format tanggal
            $tanggal = $row['tanggal']
                ? date('d-m-Y', strtotime($row['tanggal']))
                : '-';

            $tanggalTerbaru = $row['tanggal']
                ? date('d F Y', strtotime($row['tanggal']))
                : '-';

            $data[] = [

                'peserta_id' => (int) $row['peserta_id'],

                'nama' => $row['nama'],

                'nis' => $row['nisn'] ?? '-',

                'nisn' => $row['nisn'] ?? '-',

                'sub' => '-',

                'program' => $row['program'],

                'waktu' => $tanggal,

                'statusAbsen' => $status,

                'statusReport' => $statusReport,

                'persentaseKehadiran' =>
                    $row['persentase_kehadiran'] . '%',

                'tanggalTerbaru' => $tanggalTerbaru,

                'jamMasuk' => $jamMasuk,

                'jamKeluar' => $jamKeluar,

                'statusTerbaru' => '● ' . $status,

                'inisial' => strtoupper(
                    substr($row['nama'], 0, 1)
                )
            ];
        }

        echo json_encode([
            'success' => true,
            'data' => $data
        ]);

        exit;
    }


    /* =====================================================
       2. DETAIL DAN RIWAYAT ABSENSI PESERTA
    ===================================================== */

    if ($aksi === 'detail') {

        $pesertaId = $_GET['peserta_id'] ?? null;

        // Validasi ID peserta
        if (!$pesertaId || !ctype_digit((string) $pesertaId)) {

            http_response_code(400);

            echo json_encode([
                'success' => false,
                'message' => 'ID peserta tidak valid.'
            ]);

            exit;
        }


        /* -------------------------------------------------
           MEMASTIKAN PESERTA BERADA DI PROGRAM MENTOR
        ------------------------------------------------- */

        $sqlSiswa = "
            SELECT
                u.id,
                u.nama,
                u.nisn,

                p.id AS program_id,
                p.nama_program AS program

            FROM mentor_program mp

            JOIN program p
                ON p.id = mp.program_id

            JOIN peserta_program pp
                ON pp.program_id = p.id
                AND LOWER(pp.status) = 'aktif'

            JOIN users u
                ON u.id = pp.peserta_id

            WHERE mp.mentor_id = :mentor_id
              AND u.id = :peserta_id

            LIMIT 1
        ";

        $stmtSiswa = $pdo->prepare($sqlSiswa);

        $stmtSiswa->execute([
            ':mentor_id' => $mentorId,
            ':peserta_id' => $pesertaId
        ]);

        $siswa = $stmtSiswa->fetch(PDO::FETCH_ASSOC);

        // Jika peserta tidak berada di program mentor
        if (!$siswa) {

            http_response_code(404);

            echo json_encode([
                'success' => false,
                'message' => 'Data peserta tidak ditemukan.'
            ]);

            exit;
        }


        /* -------------------------------------------------
           MENGAMBIL 5 RIWAYAT ABSENSI TERAKHIR
        ------------------------------------------------- */

        $sqlRiwayat = "
            SELECT
                id,
                tanggal,
                waktu_masuk,
                waktu_keluar,
                status,
                keterangan

            FROM absensi

            WHERE peserta_id = :peserta_id
              AND program_id = :program_id

            ORDER BY tanggal DESC, id DESC

            LIMIT 5
        ";

        $stmtRiwayat = $pdo->prepare($sqlRiwayat);

        $stmtRiwayat->execute([
            ':peserta_id' => $pesertaId,
            ':program_id' => $siswa['program_id']
        ]);

        $riwayatDB = $stmtRiwayat->fetchAll(PDO::FETCH_ASSOC);

        $riwayat = [];

        foreach ($riwayatDB as $index => $row) {

            $status = ucfirst($row['status']);

            $statusClass = 'text-slate-600 font-bold';

            if ($row['status'] === 'hadir') {

                $statusClass = 'text-emerald-600 font-bold';

            } elseif ($row['status'] === 'izin') {

                $statusClass = 'text-blue-600 font-bold';

            } elseif ($row['status'] === 'sakit' || $row['status'] === 'alpha') {

                $statusClass = 'text-rose-600 font-bold';
            }

            $riwayat[] = [

                'no' => $index + 1,

                'tanggal' => date(
                    'd F Y',
                    strtotime($row['tanggal'])
                ),

                'jamMasuk' => $row['waktu_masuk']
                    ? date('H:i', strtotime($row['waktu_masuk'])) . ' WIB'
                    : '-',

                'jamKeluar' => $row['waktu_keluar']
                    ? date('H:i', strtotime($row['waktu_keluar'])) . ' WIB'
                    : '-',

                'status' => $status,

                'statusClass' => $statusClass,

                'keterangan' => $row['keterangan'] ?? '-'
            ];
        }


        /* -------------------------------------------------
           MENGHITUNG PERSENTASE KEHADIRAN
        ------------------------------------------------- */

        $sqlStatistik = "
            SELECT
                COUNT(*) AS total,

                COUNT(*) FILTER (
                    WHERE status::text = 'hadir'
                ) AS hadir

            FROM absensi

            WHERE peserta_id = :peserta_id
              AND program_id = :program_id
        ";

        $stmtStatistik = $pdo->prepare($sqlStatistik);

        $stmtStatistik->execute([
            ':peserta_id' => $pesertaId,
            ':program_id' => $siswa['program_id']
        ]);

        $statistik = $stmtStatistik->fetch(PDO::FETCH_ASSOC);

        $total = (int) $statistik['total'];
        $hadir = (int) $statistik['hadir'];

        $persentase = $total > 0
            ? round(($hadir / $total) * 100)
            : 0;


        /* -------------------------------------------------
           DATA ABSENSI TERBARU
        ------------------------------------------------- */

        $terbaru = $riwayatDB[0] ?? null;

        $tanggalTerbaru = $terbaru
            ? date('d F Y', strtotime($terbaru['tanggal']))
            : '-';

        $jamMasukTerbaru = $terbaru && $terbaru['waktu_masuk']
            ? date('H:i', strtotime($terbaru['waktu_masuk'])) . ' WIB'
            : '-';

        $jamKeluarTerbaru = $terbaru && $terbaru['waktu_keluar']
            ? date('H:i', strtotime($terbaru['waktu_keluar'])) . ' WIB'
            : '-';

        $statusTerbaru = $terbaru
            ? '● ' . ucfirst($terbaru['status'])
            : '● Belum ada data';


        /* -------------------------------------------------
           RESPONS DETAIL PESERTA
        ------------------------------------------------- */

        echo json_encode([

            'success' => true,

            'data' => [

                'peserta_id' => (int) $siswa['id'],

                'nama' => $siswa['nama'],

                'nisn' => $siswa['nisn'] ?? '-',

                'program' => $siswa['program'],

                'inisial' => strtoupper(
                    substr($siswa['nama'], 0, 1)
                ),

                'persentaseKehadiran' => $persentase . '%',

                'tanggalTerbaru' => $tanggalTerbaru,

                'jamMasuk' => $jamMasukTerbaru,

                'jamKeluar' => $jamKeluarTerbaru,

                'statusTerbaru' => $statusTerbaru,

                'riwayat' => $riwayat
            ]
        ]);

        exit;
    }


    /* =====================================================
       3. REKAP ABSENSI BERDASARKAN TANGGAL UNTUK PDF
    ===================================================== */

    if ($aksi === 'cetak') {

        $tanggal = $_GET['tanggal'] ?? '';

        // Validasi format tanggal
        $date = DateTime::createFromFormat('!Y-m-d', $tanggal);

        if (!$date || $date->format('Y-m-d') !== $tanggal) {

            http_response_code(400);

            echo json_encode([
                'success' => false,
                'message' => 'Format tanggal tidak valid.'
            ]);

            exit;
        }

        // Mengambil nama mentor
        $sqlMentor = "
            SELECT nama
            FROM users
            WHERE id = :mentor_id
            LIMIT 1
        ";

        $stmtMentor = $pdo->prepare($sqlMentor);

        $stmtMentor->execute([
            ':mentor_id' => $mentorId
        ]);

        $mentor = $stmtMentor->fetchColumn();


        // Mengambil seluruh peserta aktif dan absensi sesuai tanggal
        $sql = "
            SELECT
                p.id AS program_id,
                p.nama_program,

                u.id AS peserta_id,
                u.nama,
                u.nisn,

                a.status::text AS status_absen,
                a.tanggal,
                a.waktu_masuk,
                a.waktu_keluar,
                a.keterangan

            FROM mentor_program mp

            JOIN program p
                ON p.id = mp.program_id

            JOIN peserta_program pp
                ON pp.program_id = p.id
                AND LOWER(pp.status) = 'aktif'

            JOIN users u
                ON u.id = pp.peserta_id

            LEFT JOIN absensi a
                ON a.peserta_id = u.id
                AND a.program_id = p.id
                AND a.tanggal = :tanggal

            WHERE mp.mentor_id = :mentor_id

            ORDER BY p.nama_program ASC, u.nama ASC
        ";

        $stmt = $pdo->prepare($sql);

        $stmt->execute([
            ':tanggal' => $tanggal,
            ':mentor_id' => $mentorId
        ]);

        $hasil = $stmt->fetchAll(PDO::FETCH_ASSOC);


        // Mengelompokkan peserta berdasarkan program
        $programList = [];

        $statistik = [
            'total_peserta' => 0,
            'hadir' => 0,
            'izin' => 0,
            'sakit' => 0,
            'alpha' => 0,
            'belum_ada' => 0
        ];

        foreach ($hasil as $row) {

            $programId = $row['program_id'];

            if (!isset($programList[$programId])) {

                $programList[$programId] = [
                    'program_id' => (int) $programId,
                    'nama_program' => $row['nama_program'],
                    'peserta' => [],
                    'total_peserta' => 0,
                    'hadir' => 0,
                    'izin' => 0,
                    'sakit' => 0,
                    'alpha' => 0,
                    'belum_ada' => 0
                ];

            }

            $statusAsli = strtolower(
                $row['status_absen'] ?? ''
            );

            $status = $statusAsli !== ''
                ? ucfirst($statusAsli)
                : 'Belum ada';

            $jamMasuk = $row['waktu_masuk']
                ? date('H:i', strtotime($row['waktu_masuk'])) . ' WIB'
                : '-';

            $jamKeluar = $row['waktu_keluar']
                ? date('H:i', strtotime($row['waktu_keluar'])) . ' WIB'
                : '-';


            $programList[$programId]['peserta'][] = [

                'peserta_id' => (int) $row['peserta_id'],

                'nama' => $row['nama'],

                'nisn' => $row['nisn'] ?? '-',

                'status' => $status,

                'jam_masuk' => $jamMasuk,

                'jam_keluar' => $jamKeluar,

                'keterangan' => $row['keterangan'] ?? '-'

            ];


            // Statistik per program
            $programList[$programId]['total_peserta']++;

            // Statistik keseluruhan
            $statistik['total_peserta']++;


            if ($statusAsli === 'hadir') {

                $programList[$programId]['hadir']++;
                $statistik['hadir']++;

            } elseif ($statusAsli === 'izin') {

                $programList[$programId]['izin']++;
                $statistik['izin']++;

            } elseif ($statusAsli === 'sakit') {

                $programList[$programId]['sakit']++;
                $statistik['sakit']++;

            } elseif ($statusAsli === 'alpha') {

                $programList[$programId]['alpha']++;
                $statistik['alpha']++;

            } else {

                $programList[$programId]['belum_ada']++;
                $statistik['belum_ada']++;

            }

        }


        // Mengubah array program menjadi array biasa
        $dataProgram = array_values($programList);


        // Menghitung persentase kehadiran
        $persentase = $statistik['total_peserta'] > 0
            ? round(
                ($statistik['hadir'] / $statistik['total_peserta']) * 100
            )
            : 0;


        echo json_encode([

            'success' => true,

            'mentor' => $mentor ?: '-',

            'tanggal' => $tanggal,

            'statistik' => $statistik,

            'persentase_kehadiran' => $persentase,

            'data' => $dataProgram

        ], JSON_UNESCAPED_UNICODE);

        exit;
    }



    /* =====================================================
       4. AKSI TIDAK DIKENALI
    ===================================================== */

    http_response_code(400);

    echo json_encode([
        'success' => false,
        'message' => 'Aksi tidak dikenali.'
    ]);

    exit;


} catch (PDOException $e) {

    // Detail error hanya dicatat di log server
    error_log("API Absensi Mentor: " . $e->getMessage());

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'message' => 'Terjadi kesalahan saat mengambil data absensi.'
    ]);

    exit;
}
