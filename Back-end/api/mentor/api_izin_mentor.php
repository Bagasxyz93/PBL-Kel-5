
<?php

header("Content-Type: application/json; charset=UTF-8");
require_once __DIR__ . '/../../config/cors.php';
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../../config/koneksi.php';
require_once __DIR__ . '/../../config/tab_auth.php';

function responseJSON($success, $message, $code = 200, $data = null)
{
    http_response_code($code);

    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

$userToken = ambilUserToken();

if (!$userToken || $userToken['role'] !== 'mentor') {
    responseJSON(false, "Akses hanya untuk mentor.", 401);
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    responseJSON(false, "Metode tidak diizinkan.", 405);
}

try {

    $mentorId = (int) $userToken['user_id'];

    $sql = "
        SELECT
            pi.id,
            pi.absensi_id,
            siswa.nama AS nama_siswa,
            COALESCE(siswa.nisn, '-') AS nis,
            p.nama_program,
            pi.alasan,
            pi.bukti_file,
            pi.status,
            pi.catatan_mentor,
            pi.tanggal_izin,
            a.tanggal AS tanggal_absensi,
            pi.waktu_pengajuan,
            pi.waktu_persetujuan

        FROM pengajuan_izin pi

        INNER JOIN absensi a
            ON pi.absensi_id = a.id

        INNER JOIN users siswa
            ON a.peserta_id = siswa.id

        INNER JOIN program p
            ON a.program_id = p.id

        INNER JOIN mentor_program mp
            ON mp.program_id = p.id

        WHERE mp.mentor_id = :mentor_id

        ORDER BY pi.waktu_pengajuan DESC, pi.id DESC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':mentor_id' => $mentorId
    ]);

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($data as &$item) {

        $alasanLengkap = $item['alasan'] ?? '';

        $jenis = null;

        if (preg_match(
            '/^\s*Jenis:\s*(Izin|Sakit)\s*$/mi',
            $alasanLengkap,
            $matches
        )) {
            $jenis = strtolower($matches[1]);
        }

        $alasanBersih = preg_replace(
            '/^\s*Jenis:\s*(Izin|Sakit)\s*\R?/i',
            '',
            $alasanLengkap,
            1
        );

        $alasanBersih = preg_replace(
            '/^\s*Alasan:\s*/i',
            '',
            $alasanBersih,
            1
        );

        $item['jenis_pengajuan'] = $jenis;
        $item['alasan_pengajuan'] = trim($alasanBersih);
    }

    unset($item);

    responseJSON(
        true,
        "Data pengajuan izin berhasil diambil.",
        200,
        $data
    );

} catch (Throwable $e) {

    error_log("API izin mentor: " . $e->getMessage());

    responseJSON(
        false,
        "Gagal mengambil data pengajuan izin.",
        500
    );
}

?>
