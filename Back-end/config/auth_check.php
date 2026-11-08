<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function checkLogin() {
    if (!isset($_SESSION['user_id'])) {
        header("Location: ../login.php");
        exit;
    }
}

function checkRole($role) {
    checkLogin();

    if ($_SESSION['role'] !== $role) {
        http_response_code(403);
        die("Akses ditolak!");
    }
}

?>
