<?php

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../../config/koneksi.php';
require_once __DIR__ . '/../../config/tab_auth.php';

$userToken = ambilUserToken();

if (!$userToken || $userToken['role'] !== 'mentor') {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Akses hanya untuk mentor."
    ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Metode tidak diizinkan."
    ]);
    exit;
}

// Ambil data JSON
$input = json_decode(file_get_contents("php://input"), true);

$idPengajuan = filter_var(
    $input['id'] ?? null,
    FILTER_VALIDATE_INT
);

$aksi = $input['aksi'] ?? '';
$catatan = trim($input['catatan'] ?? '');

if (!$idPengajuan || !in_array($aksi, ['disetujui', 'ditolak'])) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Data pengajuan tidak valid."
    ]);
    exit;
}

try {

    $mentorId = $userToken['user_id'];

    $pdo->beginTransaction();

    // Periksa pengajuan dan hak akses mentor
    $sql = "
        SELECT
            pi.id,
            pi.absensi_id,
            pi.status
        FROM pengajuan_izin pi

        INNER JOIN absensi a
            ON pi.absensi_id = a.id

        INNER JOIN mentor_program mp
            ON mp.program_id = a.program_id

        WHERE pi.id = :id
        AND mp.mentor_id = :mentor_id

        LIMIT 1
        FOR UPDATE OF pi
    ";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ':id' => $idPengajuan,
        ':mentor_id' => $mentorId
    ]);

    $pengajuan = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$pengajuan) {
        $pdo->rollBack();

        http_response_code(404);

        echo json_encode([
            "success" => false,
            "message" => "Pengajuan tidak ditemukan atau bukan program mentor."
        ]);
        exit;
    }

    // Pastikan belum pernah diproses
    if ($pengajuan['status'] !== 'menunggu') {
        $pdo->rollBack();

        http_response_code(400);

        echo json_encode([
            "success" => false,
            "message" => "Pengajuan ini sudah diproses sebelumnya."
        ]);
        exit;
    }

    // Perbarui pengajuan izin
    $sqlUpdate = "
        UPDATE pengajuan_izin
        SET
            status = :status,
            catatan_mentor = :catatan,
            disetujui_oleh = :mentor_id
        WHERE id = :id
    ";

    $stmtUpdate = $pdo->prepare($sqlUpdate);

    $stmtUpdate->execute([
        ':status' => $aksi,
        ':catatan' => $catatan !== '' ? $catatan : null,
        ':mentor_id' => $mentorId,
        ':id' => $idPengajuan
    ]);

    // Perbarui status absensi
    $statusAbsensi = ($aksi === 'disetujui')
        ? 'izin'
        : 'alpha';

    $sqlAbsensi = "
        UPDATE absensi
        SET status = :status
        WHERE id = :absensi_id
    ";

    $stmtAbsensi = $pdo->prepare($sqlAbsensi);

    $stmtAbsensi->execute([
        ':status' => $statusAbsensi,
        ':absensi_id' => $pengajuan['absensi_id']
    ]);

    $pdo->commit();

    echo json_encode([
        "success" => true,
        "message" => $aksi === 'disetujui'
            ? "Pengajuan izin berhasil disetujui."
            : "Pengajuan izin berhasil ditolak."
    ]);

} catch (PDOException $e) {

    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    error_log("Proses izin mentor: " . $e->getMessage());

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Terjadi kesalahan saat memproses pengajuan izin."
    ]);
}