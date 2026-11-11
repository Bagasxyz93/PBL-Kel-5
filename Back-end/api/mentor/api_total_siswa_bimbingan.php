<?php

session_start();

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once '../../config/koneksi.php';

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'mentor') {
    echo json_encode([
        "success" => false,
        "message" => "Akses ditolak."
    ]);
    exit;
}

try {
    $mentorId = $_SESSION['user_id'];

    // Menghitung total siswa bimbingan
    $stmtTotal = $pdo->prepare("
        SELECT COUNT(DISTINCT pp.peserta_id)
        FROM mentor_program mp
        JOIN peserta_program pp ON pp.program_id = mp.program_id
        WHERE mp.mentor_id = :mentor_id
    ");

    $stmtTotal->execute([':mentor_id' => $mentorId]);
    $totalSiswa = (int) $stmtTotal->fetchColumn();

    // Menghitung siswa yang hadir hari ini
    $stmtHadir = $pdo->prepare("
        SELECT COUNT(DISTINCT a.peserta_id)
        FROM absensi a
        JOIN mentor_program mp ON mp.program_id = a.program_id
        WHERE mp.mentor_id = :mentor_id
          AND a.tanggal = CURRENT_DATE
          AND a.status = 'hadir'
    ");

    $stmtHadir->execute([':mentor_id' => $mentorId]);
    $totalHadir = (int) $stmtHadir->fetchColumn();

    echo json_encode([
        "success" => true,
        "total_hadir" => $totalHadir,
        "total_siswa" => $totalSiswa
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Gagal mengambil data."
    ]);
}