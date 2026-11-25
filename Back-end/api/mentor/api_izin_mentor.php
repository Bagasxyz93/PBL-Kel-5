<?php

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
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

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Metode tidak diizinkan."
    ]);
    exit;
}

try {

    $mentorId = $userToken['user_id'];

    $sql = "
        SELECT
            pi.id,
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

    echo json_encode([
        "success" => true,
        "data" => $data
    ]);

} catch (PDOException $e) {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Gagal mengambil data pengajuan izin.",
        "error" => $e->getMessage()
    ]);
}