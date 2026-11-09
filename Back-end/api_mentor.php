
<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once 'config/koneksi.php';

try {
    $stmt = $pdo->prepare("
        SELECT
            u.id,
            u.nama,
            u.email,
            u.nip,
            u.no_hp,
            u.status_akun,
            COALESCE(
                STRING_AGG(DISTINCT p.nama_program, ', '),
                'Belum ada program'
            ) AS program
        FROM users u
        LEFT JOIN mentor_program mp ON u.id = mp.mentor_id
        LEFT JOIN program p ON mp.program_id = p.id
        WHERE u.role = 'mentor'
        GROUP BY
            u.id,
            u.nama,
            u.email,
            u.nip,
            u.no_hp,
            u.status_akun
        ORDER BY u.id DESC
    ");

    $stmt->execute();
    $dataMentor = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "data" => $dataMentor
    ]);

} catch (PDOException $e) {
    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Gagal mengambil data mentor."
    ]);
}
?>
