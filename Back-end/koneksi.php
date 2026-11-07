<?php
// Izinkan akses CORS agar frontend (Vite) bisa mengakses API PHP ini
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET");

$host = "localhost";
$port = "5432";
$dbname = "INKUBASI"; // <-- Ganti dengan nama database Anda di DBeaver
$user = "postgres";             // <-- Ganti username PostgreSQL Anda jika berbeda
$password = "bagas0903";    // <-- Ganti password PostgreSQL Anda

try {
    $pdo = new PDO("pgsql:host=$host;port=$port;dbname=$dbname", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo json_encode([
        "success" => true, 
        "message" => "Koneksi ke PostgreSQL di DBeaver berhasil!"
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Koneksi database gagal: " . $e->getMessage()
    ]);
    exit();
}
?>