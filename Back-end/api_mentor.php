<?php

// Mengizinkan Front-end mengakses API
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once 'config/koneksi.php';

try {
    $stmt = $pdo->prepare("SELECT id, nama, username, email, role, created_at FROM users WHERE role = 'mentor' ORDER BY id DESC");
    $stmt->execute();
    $mentorList = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "data" => $mentorList
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Gagal memuat data mentor: " . $e->getMessage()
    ]);
}
?>