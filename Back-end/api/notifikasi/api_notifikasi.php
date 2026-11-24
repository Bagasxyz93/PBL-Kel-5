
<?php

date_default_timezone_set('Asia/Jakarta');

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/../../config/koneksi.php';
require_once __DIR__ . '/../../config/tab_auth.php';

$userToken = ambilUserToken();

if (!$userToken) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Silakan login terlebih dahulu."
    ]);
    exit;
}

$userId = (int) $userToken['user_id'];
$role = $userToken['role'];

try {

    $notifikasi = [];

    /*
    =====================================================
    1. NOTIFIKASI AKUN BARU
    =====================================================
    */

    if ($role === 'peserta' || $role === 'mentor') {

        $queryAkun = "
            SELECT nama, username, created_at
            FROM users
            WHERE id = :user_id
        ";

        $stmtAkun = $pdo->prepare($queryAkun);
        $stmtAkun->execute(['user_id' => $userId]);

        $akun = $stmtAkun->fetch(PDO::FETCH_ASSOC);

        if ($akun) {
            $notifikasi[] = [
                "id" => "akun-" . $userId,
                "kategori" => "akun",
                "judul" => "Akun Berhasil Ditambahkan",
                "pesan" => "Akun Anda telah ditambahkan oleh Admin. Username: " . $akun['username'],
                "waktu" => $akun['created_at'],
                "status" => "info"
            ];
        }
    }

    /*
    =====================================================
    2. NOTIFIKASI DAILY REPORT
    =====================================================
    */

    if ($role === 'peserta') {

        $queryReport = "
            SELECT
                id,
                judul,
                status,
                catatan_mentor,
                created_at,
                updated_at
            FROM daily_report
            WHERE peserta_id = :user_id
            ORDER BY updated_at DESC NULLS LAST, created_at DESC
        ";

        $stmtReport = $pdo->prepare($queryReport);
        $stmtReport->execute(['user_id' => $userId]);

        while ($row = $stmtReport->fetch(PDO::FETCH_ASSOC)) {

            if ($row['status'] === 'diterima' || $row['status'] === 'ditolak') {

                $diterima = $row['status'] === 'diterima';

                $notifikasi[] = [
                    "id" => "report-" . $row['id'],
                    "kategori" => "laporan",
                    "judul" => $diterima
                        ? "Daily Report Diterima"
                        : "Daily Report Ditolak",
                    "pesan" => "Daily Report \"" . $row['judul'] . "\" " .
                        ($diterima ? "telah diterima." : "ditolak.") .
                        ($row['catatan_mentor'] ? " Catatan: " . $row['catatan_mentor'] : ""),
                    "waktu" => $row['updated_at'] ?: $row['created_at'],
                    "status" => $row['status']
                ];
            }
        }
    }

    if ($role === 'mentor') {

        $queryReport = "
            SELECT
                dr.id,
                u.nama,
                dr.judul,
                dr.created_at
            FROM daily_report dr
            JOIN users u ON dr.peserta_id = u.id
            WHERE EXISTS (
                SELECT 1
                FROM peserta_program pp
                JOIN mentor_program mp
                    ON pp.program_id = mp.program_id
                WHERE pp.peserta_id = dr.peserta_id
                  AND mp.mentor_id = :mentor_id
            )
            ORDER BY dr.created_at DESC
        ";

        $stmtReport = $pdo->prepare($queryReport);
        $stmtReport->execute(['mentor_id' => $userId]);

        while ($row = $stmtReport->fetch(PDO::FETCH_ASSOC)) {
            $notifikasi[] = [
                "id" => "report-" . $row['id'],
                "kategori" => "laporan",
                "judul" => "Daily Report Baru",
                "pesan" => $row['nama'] . " mengirim Daily Report: " . $row['judul'],
                "waktu" => $row['created_at'],
                "status" => "info"
            ];
        }
    }

    /*
    =====================================================
    3. NOTIFIKASI PENGAJUAN IZIN
    =====================================================
    */

    if ($role === 'peserta') {

        $queryIzin = "
            SELECT
                pi.id,
                pi.status,
                pi.alasan,
                pi.catatan_mentor,
                pi.waktu_pengajuan,
                pi.waktu_persetujuan
            FROM pengajuan_izin pi
            JOIN absensi a ON pi.absensi_id = a.id
            WHERE a.peserta_id = :user_id
            ORDER BY pi.waktu_pengajuan DESC
        ";

        $stmtIzin = $pdo->prepare($queryIzin);
        $stmtIzin->execute(['user_id' => $userId]);

        while ($row = $stmtIzin->fetch(PDO::FETCH_ASSOC)) {

            if ($row['status'] === 'disetujui' || $row['status'] === 'ditolak') {

                $disetujui = $row['status'] === 'disetujui';

                $notifikasi[] = [
                    "id" => "izin-" . $row['id'],
                    "kategori" => "izin",
                    "judul" => $disetujui
                        ? "Pengajuan Izin Disetujui"
                        : "Pengajuan Izin Ditolak",
                    "pesan" => $disetujui
                        ? "Pengajuan izin Anda telah disetujui."
                        : "Pengajuan izin Anda ditolak.",
                    "waktu" => $row['waktu_persetujuan'] ?: $row['waktu_pengajuan'],
                    "status" => $row['status']
                ];
            }
        }
    }

    if ($role === 'mentor') {

        $queryIzin = "
            SELECT
                pi.id,
                pi.alasan,
                pi.waktu_pengajuan,
                u.nama
            FROM pengajuan_izin pi
            JOIN absensi a ON pi.absensi_id = a.id
            JOIN users u ON a.peserta_id = u.id
            WHERE pi.status = 'menunggu'
              AND EXISTS (
                  SELECT 1
                  FROM peserta_program pp
                  JOIN mentor_program mp
                      ON pp.program_id = mp.program_id
                  WHERE pp.peserta_id = a.peserta_id
                    AND mp.mentor_id = :mentor_id
                    AND pp.program_id = a.program_id
              )
            ORDER BY pi.waktu_pengajuan DESC
        ";

        $stmtIzin = $pdo->prepare($queryIzin);
        $stmtIzin->execute(['mentor_id' => $userId]);

        while ($row = $stmtIzin->fetch(PDO::FETCH_ASSOC)) {
            $notifikasi[] = [
                "id" => "izin-" . $row['id'],
                "kategori" => "izin",
                "judul" => "Pengajuan Izin Baru",
                "pesan" => $row['nama'] . " mengajukan izin.",
                "waktu" => $row['waktu_pengajuan'],
                "status" => "info"
            ];
        }
    }

    /*
    =====================================================
    4. NOTIFIKASI PENGGUNA BARU UNTUK ADMIN
    =====================================================
    */

    if ($role === 'admin') {

        $queryUser = "
            SELECT id, nama, username, role, created_at
            FROM users
            WHERE id != :user_id
            ORDER BY created_at DESC
        ";

        $stmtUser = $pdo->prepare($queryUser);
        $stmtUser->execute(['user_id' => $userId]);

        while ($row = $stmtUser->fetch(PDO::FETCH_ASSOC)) {
            $notifikasi[] = [
                "id" => "user-" . $row['id'],
                "kategori" => "akun",
                "judul" => "Pengguna Baru Ditambahkan",
                "pesan" => "Pengguna " . $row['nama'] .
                    " dengan username " . $row['username'] .
                    " telah terdaftar.",
                "waktu" => $row['created_at'],
                "status" => "info"
            ];
        }
    }

    /*
    =====================================================
    5. NOTIFIKASI PENAMBAHAN PROGRAM MENTOR
    =====================================================
    */

    if ($role === 'admin' || $role === 'mentor') {

        $queryProgram = "
            SELECT
                mp.id AS assignment_id,
                mp.created_at,
                u.id AS mentor_id,
                u.nama AS nama_mentor,
                p.nama_program
            FROM mentor_program mp
            JOIN users u ON mp.mentor_id = u.id
            JOIN program p ON mp.program_id = p.id
        ";

        if ($role === 'mentor') {
            $queryProgram .= " WHERE mp.mentor_id = :mentor_id";
        }

        $queryProgram .= " ORDER BY mp.created_at DESC";

        $stmtProgram = $pdo->prepare($queryProgram);

        if ($role === 'mentor') {
            $stmtProgram->execute([
                'mentor_id' => $userId
            ]);
        } else {
            $stmtProgram->execute();
        }

        while ($row = $stmtProgram->fetch(PDO::FETCH_ASSOC)) {

            $notifikasi[] = [
                "id" => "program-assign-" . $row['assignment_id'],
                "kategori" => "akun",
                "judul" => "Program Mentor Diperbarui",
                "pesan" => "Program " . $row['nama_program'] .
                    " ditambahkan untuk Mentor " . $row['nama_mentor'] . ".",
                "waktu" => $row['created_at'],
                "status" => "info"
            ];
        }
    }

    /*
    =====================================================
    6. FILTER NOTIFIKASI HARI INI
    =====================================================
    */

    $tanggalHariIni = date('Y-m-d');

    $notifikasi = array_filter($notifikasi, function ($item) use ($tanggalHariIni) {

        if (empty($item['waktu'])) {
            return false;
        }

        $timestamp = strtotime($item['waktu']);

        if ($timestamp === false) {
            return false;
        }

        return date('Y-m-d', $timestamp) === $tanggalHariIni;
    });

    $notifikasi = array_values($notifikasi);

    /*
    =====================================================
    7. URUTKAN BERDASARKAN WAKTU TERBARU
    =====================================================
    */

    usort($notifikasi, function ($a, $b) {
        return strtotime($b['waktu'] ?? '1970-01-01')
            <=> strtotime($a['waktu'] ?? '1970-01-01');
    });

    echo json_encode([
        "success" => true,
        "data" => $notifikasi
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {

    error_log("Error API Notifikasi: " . $e->getMessage());

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Gagal mengambil data notifikasi."
    ]);

} catch (Exception $e) {

    error_log("Error API Notifikasi: " . $e->getMessage());

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Terjadi kesalahan pada server."
    ]);
}
