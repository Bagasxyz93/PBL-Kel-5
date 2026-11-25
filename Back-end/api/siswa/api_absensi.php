<?php

ob_start();

require_once __DIR__ . '/../../config/cors.php';header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

ini_set('display_errors', '0');
error_reporting(E_ALL);

date_default_timezone_set('Asia/Jakarta');

function responseJSON($success, $message, $data = null, $code = 200)
{
    if (ob_get_length()) {
        ob_clean();
    }

    http_response_code($code);

    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

// Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Hanya GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    responseJSON(false, 'Metode tidak diizinkan.', null, 405);
}

try {

    require_once __DIR__ . '/../../config/koneksi.php';
    require_once __DIR__ . '/../../config/tab_auth.php';

    // ==============================
    // AUTENTIKASI
    // ==============================

    if (!function_exists('ambilUserToken')) {
        responseJSON(false, 'Fungsi autentikasi tidak ditemukan.', null, 500);
    }

    $user = ambilUserToken();

    if (!$user) {
        responseJSON(false, 'Token tidak valid atau sesi berakhir.', null, 401);
    }

    if (($user['role'] ?? '') !== 'peserta') {
        responseJSON(false, 'Akses ditolak.', null, 403);
    }

    $pesertaId = $user['id']
        ?? $user['user_id']
        ?? $user['peserta_id']
        ?? null;

    if (!$pesertaId) {
        responseJSON(false, 'ID peserta tidak ditemukan.', null, 401);
    }

    // ==============================
    // KONEKSI DATABASE
    // ==============================

    $db = $pdo ?? $conn ?? $koneksi ?? null;

    if (!$db instanceof PDO) {
        responseJSON(false, 'Koneksi database tidak tersedia.', null, 500);
    }

    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $tanggalHariIni = date('Y-m-d');

    // ==============================
    // PROGRAM DAN MENTOR AKTIF
    // DIAMBIL DARI PESERTA_PROGRAM
    // ==============================

    $queryProgram = "
        SELECT
            STRING_AGG(DISTINCT p.nama_program, ', ') AS nama_program,

            STRING_AGG(
                DISTINCT mentor.nama,
                '|'
            ) AS nama_mentor

        FROM peserta_program pp

        JOIN program p
            ON p.id = pp.program_id

        LEFT JOIN mentor_program mp
            ON mp.program_id = pp.program_id

        LEFT JOIN users mentor
            ON mentor.id = mp.mentor_id
            AND mentor.role = 'mentor'

        WHERE pp.peserta_id = :peserta_id
          AND pp.status = 'Aktif'
    ";

    $stmtProgram = $db->prepare($queryProgram);

    $stmtProgram->execute([
        ':peserta_id' => $pesertaId
    ]);

    $programAktif = $stmtProgram->fetch(PDO::FETCH_ASSOC);

    // ==============================
    // ABSENSI HARI INI
    // ==============================

    $queryHariIni = "
        SELECT
            a.id,
            a.program_id,
            a.tanggal,
            a.status,

            TO_CHAR(
                a.waktu_masuk,
                'HH24:MI'
            ) AS jam_masuk,

            TO_CHAR(
                a.waktu_keluar,
                'HH24:MI'
            ) AS jam_keluar,

            p.nama_program

        FROM absensi a

        LEFT JOIN program p
            ON p.id = a.program_id

        WHERE a.peserta_id = :peserta_id
          AND a.tanggal = :tanggal

        ORDER BY a.id DESC

        LIMIT 1
    ";

    $stmtHariIni = $db->prepare($queryHariIni);

    $stmtHariIni->execute([
        ':peserta_id' => $pesertaId,
        ':tanggal' => $tanggalHariIni
    ]);

    $absensiHariIni = $stmtHariIni->fetch(PDO::FETCH_ASSOC);

    // ==============================
    // DATA SESI HARI INI
    // ==============================

    $dataHariIni = [
        'status' => $absensiHariIni
            ? $absensiHariIni['status']
            : 'BELUM ABSEN',

        'program' => $programAktif['nama_program'] ?? '-',

        'tanggal' => $tanggalHariIni,

        'mentor' => $programAktif['nama_mentor'] ?? '-',

        'jam_masuk' => $absensiHariIni['jam_masuk'] ?? null,

        'jam_keluar' => $absensiHariIni['jam_keluar'] ?? null
    ];

    // ==============================
    // RIWAYAT ABSENSI
    // ==============================

    $queryRiwayat = "
        SELECT
            a.id,
            a.peserta_id,
            a.program_id,
            a.tanggal,
            a.status,

            u.nama AS nama_peserta,

            TO_CHAR(
                a.waktu_masuk,
                'HH24:MI'
            ) AS jam_masuk,

            TO_CHAR(
                a.waktu_keluar,
                'HH24:MI'
            ) AS jam_keluar,

            p.nama_program

        FROM absensi a

        LEFT JOIN users u
            ON u.id = a.peserta_id

        LEFT JOIN program p
            ON p.id = a.program_id

        WHERE a.peserta_id = :peserta_id

        ORDER BY a.tanggal DESC, a.id DESC
    ";

    $stmtRiwayat = $db->prepare($queryRiwayat);

    $stmtRiwayat->execute([
        ':peserta_id' => $pesertaId
    ]);

    $riwayat = $stmtRiwayat->fetchAll(PDO::FETCH_ASSOC);

    // ==============================
    // FORMAT RIWAYAT
    // ==============================
    
    $dataRiwayat = [];
    
    foreach ($riwayat as $row) {
    
        $dataRiwayat[] = [
            'nama' => $row['nama_peserta'] ?? '-',
            'program' => $row['nama_program'] ?? '-',
            'tanggal' => $row['tanggal'],
            'jam_masuk' => $row['jam_masuk'],
            'jam_keluar' => $row['jam_keluar'],
            'status' => $row['status']
        ];
    
    }

    // ==============================
    // RESPONSE
    // ==============================

    responseJSON(
        true,
        'Data absensi berhasil diambil.',
        [
            'hari_ini' => $dataHariIni,
            'riwayat' => $dataRiwayat
        ]
    );

} catch (Throwable $e) {

    error_log("API ABSENSI SISWA: " . $e->getMessage());

    responseJSON(
        false,
        'Terjadi kesalahan pada server saat mengambil data absensi.',
        null,
        500
    );

}