
<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once '../../config/koneksi.php';

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
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Gagal mengambil aktivitas dashboard."
    ]);
}
?>
