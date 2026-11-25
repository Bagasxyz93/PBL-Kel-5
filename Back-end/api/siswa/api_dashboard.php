
<?php

require_once __DIR__ . '/../../config/cors.php';header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/../../config/koneksi.php';
require_once __DIR__ . '/../../config/tab_auth.php';

try {

    // =========================================
    // VALIDASI TOKEN
    // =========================================

    $userToken = ambilUserToken();

    if (!$userToken || $userToken['role'] !== 'peserta') {
        http_response_code(401);

        echo json_encode([
            "success" => false,
            "message" => "Token tidak valid atau bukan akun siswa."
        ]);

        exit;
    }

    $pesertaId = (int) $userToken['user_id'];

    // =========================================
    // KONEKSI DATABASE
    // =========================================

    if (isset($pdo) && $pdo instanceof PDO) {
        $db = $pdo;
    } elseif (isset($conn) && $conn instanceof PDO) {
        $db = $conn;
    } elseif (isset($koneksi) && $koneksi instanceof PDO) {
        $db = $koneksi;
    } else {
        throw new Exception("Koneksi PDO tidak ditemukan.");
    }

    // =========================================
    // DATA SISWA
    // =========================================

    $stmt = $db->prepare("
        SELECT nama
        FROM users
        WHERE id = :id
          AND role = 'peserta'
    ");

    $stmt->execute([':id' => $pesertaId]);

    $siswa = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$siswa) {
        throw new Exception("Data siswa tidak ditemukan.");
    }

    // =========================================
    // PROGRAM SISWA
    // =========================================

    $stmt = $db->prepare("
        SELECT DISTINCT program_id
        FROM peserta_program
        WHERE peserta_id = :id
    ");

    $stmt->execute([':id' => $pesertaId]);

    $programIds = $stmt->fetchAll(PDO::FETCH_COLUMN);

    // =========================================
    // RENTANG BULAN BERJALAN
    // =========================================

    $awalBulan = date('Y-m-01');
    $awalBulanBerikutnya = date('Y-m-01', strtotime('+1 month'));

    // =========================================
    // STATISTIK ABSENSI
    // =========================================

    $stmt = $db->prepare("
        SELECT
            COUNT(*) AS total_absensi,
            COUNT(*) FILTER (
                WHERE LOWER(status::text) = 'hadir'
            ) AS total_hadir
        FROM absensi
        WHERE peserta_id = :id
          AND tanggal >= :awal
          AND tanggal < :akhir
    ");

    $stmt->execute([
        ':id' => $pesertaId,
        ':awal' => $awalBulan,
        ':akhir' => $awalBulanBerikutnya
    ]);

    $absensi = $stmt->fetch(PDO::FETCH_ASSOC);

    $totalAbsensi = (int) ($absensi['total_absensi'] ?? 0);
    $totalHadir = (int) ($absensi['total_hadir'] ?? 0);

    $persentaseHadir = $totalAbsensi > 0
        ? round(($totalHadir / $totalAbsensi) * 100)
        : 0;

    // =========================================
    // STATISTIK IZIN
    // =========================================

    $stmt = $db->prepare("
        SELECT
            COUNT(*) AS total_izin,
            COUNT(*) FILTER (
                WHERE LOWER(pi.status::text) IN ('disetujui', 'diterima')
            ) AS izin_disetujui
        FROM pengajuan_izin pi
        JOIN absensi a ON a.id = pi.absensi_id
        WHERE a.peserta_id = :id
          AND pi.tanggal_izin >= :awal
          AND pi.tanggal_izin < :akhir
    ");

    $stmt->execute([
        ':id' => $pesertaId,
        ':awal' => $awalBulan,
        ':akhir' => $awalBulanBerikutnya
    ]);

    $izin = $stmt->fetch(PDO::FETCH_ASSOC);

    // =========================================
    // STATISTIK DAILY REPORT
    // =========================================

    $stmt = $db->prepare("
        SELECT
            COUNT(*) AS total_report,
            COUNT(*) FILTER (
                WHERE LOWER(status::text) = 'diterima'
            ) AS report_diterima
        FROM daily_report
        WHERE peserta_id = :id
          AND tanggal >= :awal
          AND tanggal < :akhir
    ");

    $stmt->execute([
        ':id' => $pesertaId,
        ':awal' => $awalBulan,
        ':akhir' => $awalBulanBerikutnya
    ]);

    $report = $stmt->fetch(PDO::FETCH_ASSOC);

    // =========================================
    // STATISTIK MATERI
    // =========================================

    $totalMateri = 0;

    if (!empty($programIds)) {

        $placeholder = implode(
            ',',
            array_fill(0, count($programIds), '?')
        );

        $stmt = $db->prepare("
            SELECT COUNT(DISTINCT id)
            FROM materi
            WHERE program_id IN ($placeholder)
        ");

        $stmt->execute($programIds);

        $totalMateri = (int) $stmt->fetchColumn();
    }

    // =========================================
    // AKTIVITAS DAILY REPORT
    // =========================================

    $aktivitas = [];

    $stmt = $db->prepare("
        SELECT
            judul,
            tanggal,
            created_at,
            status
        FROM daily_report
        WHERE peserta_id = :id
        ORDER BY created_at DESC
        LIMIT 5
    ");

    $stmt->execute([':id' => $pesertaId]);

    foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {

        $aktivitas[] = [
            "jenis" => "dailyreport",
            "judul" => "Mengirimkan Daily Report",
            "deskripsi" => $row['judul'],
            "tanggal" => $row['tanggal'],
            "created_at" => $row['created_at'],
            "status" => $row['status']
        ];
    }

    // =========================================
    // AKTIVITAS ABSENSI
    // =========================================

    $stmt = $db->prepare("
        SELECT
            tanggal,
            status,
            waktu_masuk,
            created_at
        FROM absensi
        WHERE peserta_id = :id
        ORDER BY created_at DESC
        LIMIT 5
    ");

    $stmt->execute([':id' => $pesertaId]);

    foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {

        $aktivitas[] = [
            "jenis" => "absensi",
            "judul" => "Aktivitas Absensi",
            "deskripsi" => "Status: " . $row['status'],
            "tanggal" => $row['tanggal'],
            "created_at" => $row['created_at']
        ];
    }

    // =========================================
    // AKTIVITAS IZIN
    // =========================================

    $stmt = $db->prepare("
        SELECT
            pi.tanggal_izin,
            pi.status,
            pi.waktu_pengajuan,
            pi.alasan
        FROM pengajuan_izin pi
        JOIN absensi a ON a.id = pi.absensi_id
        WHERE a.peserta_id = :id
        ORDER BY pi.waktu_pengajuan DESC
        LIMIT 5
    ");

    $stmt->execute([':id' => $pesertaId]);

    foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {

        $aktivitas[] = [
            "jenis" => "izin",
            "judul" => "Mengajukan Izin",
            "deskripsi" => $row['alasan'],
            "tanggal" => $row['tanggal_izin'],
            "created_at" => $row['waktu_pengajuan'],
            "status" => $row['status']
        ];
    }

    // =========================================
    // AKTIVITAS MATERI
    // =========================================

    if (!empty($programIds)) {

        $placeholder = implode(
            ',',
            array_fill(0, count($programIds), '?')
        );

        $stmt = $db->prepare("
            SELECT
                judul,
                tanggal_publikasi,
                created_at
            FROM materi
            WHERE program_id IN ($placeholder)
            ORDER BY created_at DESC
            LIMIT 5
        ");

        $stmt->execute($programIds);

        foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {

            $aktivitas[] = [
                "jenis" => "materi",
                "judul" => "Materi Baru Ditambahkan",
                "deskripsi" => $row['judul'],
                "tanggal" => $row['tanggal_publikasi'],
                "created_at" => $row['created_at']
            ];
        }
    }

    // =========================================
    // URUTKAN AKTIVITAS
    // =========================================

    usort($aktivitas, function ($a, $b) {
        return strtotime($b['created_at'])
            - strtotime($a['created_at']);
    });

    $aktivitas = array_slice($aktivitas, 0, 5);

    // =========================================
    // FORMAT WAKTU AKTIVITAS
    // =========================================

    foreach ($aktivitas as &$item) {

        $waktu = strtotime($item['created_at']);

        $tanggalAktivitas = date('Y-m-d', $waktu);
        $tanggalSekarang = date('Y-m-d');
        $tanggalKemarin = date('Y-m-d', strtotime('-1 day'));

        if ($tanggalAktivitas === $tanggalSekarang) {
            $item['waktu'] = 'Hari ini';
        } elseif ($tanggalAktivitas === $tanggalKemarin) {
            $item['waktu'] = 'Kemarin';
        } else {
            $item['waktu'] = date('d M Y', $waktu);
        }

        $item['jam'] = date('H:i', $waktu) . ' WIB';
    }

    unset($item);

    // =========================================
    // RESPONSE
    // =========================================

    echo json_encode([
        "success" => true,
        "data" => [
            "nama" => $siswa['nama'],

            "statistik" => [
                "kehadiran" => $persentaseHadir,
                "total_absensi" => $totalAbsensi,
                "total_hadir" => $totalHadir,

                "total_izin" => (int) ($izin['total_izin'] ?? 0),
                "izin_disetujui" => (int) ($izin['izin_disetujui'] ?? 0),

                "total_report" => (int) ($report['total_report'] ?? 0),
                "report_diterima" => (int) ($report['report_diterima'] ?? 0),

                "total_materi" => $totalMateri
            ],

            "aktivitas" => $aktivitas
        ]
    ]);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
