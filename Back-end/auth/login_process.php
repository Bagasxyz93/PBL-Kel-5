<?php

session_start();

require_once '../config/koneksi.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: ../login.php");
    exit;
}

$username = trim($_POST['username'] ?? '');
$password = $_POST['password'] ?? '';

if (empty($username) || empty($password)) {
    header("Location: http://localhost:5173/?error=empty");
    exit;
}

try {
    $query = "SELECT * FROM users WHERE username = :username";

    $stmt = $pdo->prepare($query);
    $stmt->execute([
        ':username' => $username
    ]);

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password'])) {

        session_regenerate_id(true);

        $_SESSION['user_id'] = $user['id'];
        $_SESSION['nama'] = $user['nama'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['role'] = $user['role'];

        switch ($user['role']) {
            case 'admin':
                header("Location: http://localhost:5173/pages/Admin/Dashboard.html");
                break;

            case 'mentor':
                header("Location: http://localhost:5173/pages/Mentor/Dashboard.html");
                break;

            case 'peserta':
                header("Location: http://localhost:5173/pages/Siswa/Dashboard.html");
                break;

            default:
                session_destroy();
                header("Location: http://localhost:5173/login.php");
                break;
        }

        exit;

        } else {
            header("Location: http://localhost:5173/?error=invalid");
            exit;
        }

} catch (PDOException $e) {
    die("Terjadi kesalahan database.");
}

?>
