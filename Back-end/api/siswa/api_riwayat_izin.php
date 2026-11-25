
<?php
// =====================================================
// API RIWAYAT IZIN SISWA
// =====================================================

header("Content-Type: application/json; charset=UTF-8");
require_once __DIR__ . '/../../config/cors.php';
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once '../../config/koneksi.php';
require_once '../../config/tab_auth.php';

function responseJSON($success, $message, $code = 200, $data = [])
{
    http_response_code($code);

    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ]);

    exit;
}

// =====================================================
// 1. CEK TOKEN DAN ROLE
// =====================================================

$userToken = ambilUserToken();

if (!$userToken) {
    responseJSON(false, 'Silakan login terlebih dahulu.', 401);
}

if ($userToken['role'] !== 'peserta') {
    responseJSON(false, 'Akses hanya untuk siswa.', 403);
}

$pesertaId = (int) $userToken['user_id'];

// =====================================================
// 2. CEK METHOD
// =====================================================

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    responseJSON(false, 'Method tidak diizinkan.', 405);
}

// =====================================================
// 3. AMBIL RIWAYAT IZIN
// =====================================================

try {

    $query = "
        SELECT
            pi.id,
            pi.tanggal_izin,
            pi.waktu_pengajuan,
            pi.waktu_persetujuan,
            pi.alasan,
            pi.bukti_file,
            pi.status,
            pi.catatan_mentor,
            a.tanggal AS tanggal_absensi
        FROM pengajuan_izin pi
        INNER JOIN absensi a
            ON pi.absensi_id = a.id
        WHERE a.peserta_id = :peserta_id
        ORDER BY
            pi.waktu_pengajuan DESC,
            pi.id DESC
    ";

    $stmt = $pdo->prepare($query);
    $stmt->execute([
        ':peserta_id' => $pesertaId
    ]);

    $riwayat = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($riwayat as &$item) {

        $item['tanggal_izin'] = $item['tanggal_izin']
            ? date('d-m-Y', strtotime($item['tanggal_izin']))
            : '-';

        $item['tanggal_absensi'] = $item['tanggal_absensi']
            ? date('d-m-Y', strtotime($item['tanggal_absensi']))
            : '-';

        $item['waktu_pengajuan'] = $item['waktu_pengajuan']
            ? date('d-m-Y H:i', strtotime($item['waktu_pengajuan']))
            : '-';

        $item['waktu_persetujuan'] = $item['waktu_persetujuan']
            ? date('d-m-Y H:i', strtotime($item['waktu_persetujuan']))
            : null;
    }

    unset($item);

    responseJSON(
        true,
        'Riwayat izin berhasil diambil.',
        200,
        $riwayat
    );

} catch (PDOException $e) {

    error_log($e->getMessage());

    responseJSON(
        false,
        'Gagal mengambil riwayat izin.',
        500
    );
}

?>
