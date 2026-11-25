
<?php

require_once __DIR__ . '/../../config/cors.php';
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once '../../config/koneksi.php';
require_once '../../config/tab_auth.php';

// ==================================================
// VALIDASI TOKEN ADMIN
// ==================================================

$userToken = ambilUserToken();

if (!$userToken || $userToken['role'] !== 'admin') {
    http_response_code(401);

    echo json_encode([
        "success" => false,
        "message" => "Akses ditolak. Silakan login sebagai Admin."
    ]);

    exit;
}

// ==================================================
// AMBIL DATA AKTIVITAS DASHBOARD
// ==================================================

try {

    $stmt = $pdo->prepare("
        SELECT
            TO_CHAR(t.tanggal, 'DD/MM') AS tanggal,
            COALESCE(a.jumlah, 0) + COALESCE(d.jumlah, 0) AS total
        FROM generate_series(
            CURRENT_DATE - INTERVAL '6 days',
            CURRENT_DATE,
            INTERVAL '1 day'
        ) AS t(tanggal)

        LEFT JOIN (
            SELECT tanggal::date AS tanggal, COUNT(*) AS jumlah
            FROM absensi
            WHERE status = 'hadir'
            GROUP BY tanggal::date
        ) a ON a.tanggal = t.tanggal::date

        LEFT JOIN (
            SELECT tanggal::date AS tanggal, COUNT(*) AS jumlah
            FROM daily_report
            GROUP BY tanggal::date
        ) d ON d.tanggal = t.tanggal::date

        ORDER BY t.tanggal ASC
    ");

    $stmt->execute();

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "data" => $data
    ]);

} catch (PDOException $e) {

    error_log($e->getMessage());

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Gagal mengambil aktivitas dashboard."
    ]);

}

?>
