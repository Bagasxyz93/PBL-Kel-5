
<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../../config/auth_check.php';
require_once __DIR__ . '/../../config/koneksi.php';

// Pastikan pengguna adalah mentor
if (
    !isset($_SESSION['user_id']) ||
    $_SESSION['role'] !== 'mentor'
) {
    http_response_code(401);
    exit("Akses hanya untuk mentor.");
}

// Hanya menerima GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    exit("Metode tidak diizinkan.");
}

// Validasi ID pengajuan
$idPengajuan = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);

if (!$idPengajuan || $idPengajuan <= 0) {
    http_response_code(400);
    exit("ID pengajuan tidak valid.");
}

try {

    $mentorId = $_SESSION['user_id'];

    // Ambil file hanya jika pengajuan berasal dari program mentor
    $sql = "
        SELECT pi.bukti_file
        FROM pengajuan_izin pi

        INNER JOIN absensi a
            ON pi.absensi_id = a.id

        INNER JOIN mentor_program mp
            ON mp.program_id = a.program_id

        WHERE pi.id = :id
        AND mp.mentor_id = :mentor_id
        AND pi.bukti_file IS NOT NULL
        AND pi.bukti_file <> ''
        LIMIT 1
    ";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ':id' => $idPengajuan,
        ':mentor_id' => $mentorId
    ]);

    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$data) {
        http_response_code(404);
        exit("Lampiran tidak ditemukan atau tidak memiliki akses.");
    }

    // Lokasi folder backend
    $backendRoot = dirname(__DIR__, 2);

    // Lokasi folder upload
    $uploadDirectory = realpath(
        $backendRoot . DIRECTORY_SEPARATOR . 'uploads' .
        DIRECTORY_SEPARATOR . 'pengajuan_izin'
    );

    if ($uploadDirectory === false) {
        http_response_code(404);
        exit("Folder lampiran tidak ditemukan.");
    }

    // Bersihkan path dari database
    $relativePath = ltrim(
        str_replace('\\', '/', $data['bukti_file']),
        '/'
    );

    // Pastikan file berada di folder pengajuan_izin
    if (
        strpos($relativePath, 'uploads/pengajuan_izin/') !== 0
    ) {
        http_response_code(403);
        exit("Lokasi file tidak diizinkan.");
    }

    // Dapatkan lokasi asli file
    $filePath = realpath(
        $backendRoot . DIRECTORY_SEPARATOR .
        str_replace('/', DIRECTORY_SEPARATOR, $relativePath)
    );

    // Periksa lokasi dan keberadaan file
    if (
        $filePath === false ||
        strpos(
            $filePath,
            $uploadDirectory . DIRECTORY_SEPARATOR
        ) !== 0 ||
        !is_file($filePath) ||
        !is_readable($filePath)
    ) {
        http_response_code(404);
        exit("File tidak ditemukan di server.");
    }

    // Nama file
    $namaFile = basename($filePath);
    $namaFile = preg_replace('/[\r\n"]/', '', $namaFile);

    // Deteksi tipe file
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mimeType = $finfo->file($filePath);

    if (!$mimeType) {
        $mimeType = 'application/octet-stream';
    }

    // Bersihkan output buffer sebelum mengirim file
    while (ob_get_level()) {
        ob_end_clean();
    }

    // Header unduhan
    header("Content-Type: " . $mimeType);
    header("Content-Length: " . filesize($filePath));
    header(
        "Content-Disposition: attachment; filename=\"" .
        $namaFile .
        "\"; filename*=UTF-8''" .
        rawurlencode($namaFile)
    );

    header("Cache-Control: no-store, no-cache, must-revalidate");
    header("Pragma: no-cache");

    // Kirim file
    readfile($filePath);
    exit;

} catch (PDOException $e) {

    error_log("Download bukti izin: " . $e->getMessage());

    http_response_code(500);
    exit("Terjadi kesalahan saat mengunduh lampiran.");
}
