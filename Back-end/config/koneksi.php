<?php

$host = "localhost";
$port = "5432";
$dbname = "pbl_kelompok5";
$username = "postgres";
$password = "postgres123";

try {
    $pdo = new PDO(
        "pgsql:host=$host;port=$port;dbname=$dbname",
        $username,
        $password
    );

    $pdo->setAttribute(
        PDO::ATTR_ERRMODE,
        PDO::ERRMODE_EXCEPTION
    );

} catch (PDOException $e) {
    die("Koneksi database gagal: " . $e->getMessage());
}
