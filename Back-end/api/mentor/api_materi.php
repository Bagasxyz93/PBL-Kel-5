
<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once '../../config/koneksi.php';

// Pastikan mentor sudah login
if (
    !isset($_SESSION['user_id']) ||
    !isset($_SESSION['role']) ||
    $_SESSION['role'] !== 'mentor'
) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Sesi mentor tidak ditemukan."
    ]);
    exit;
}

$mentor_id = $_SESSION['user_id'];
$lokasiFile = null;

try {

    // ==========================================
    // METHOD GET: Mengambil data materi dan program
    // ==========================================
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {

        // Mengambil materi milik mentor
        $stmtMateri = $pdo->prepare("
            SELECT
                m.id,
                m.program_id,
                p.nama_program,
                m.judul,
                m.konten_materi,
                m.file_materi,
                m.tanggal_publikasi
            FROM materi m
            JOIN program p ON m.program_id = p.id
            WHERE m.mentor_id = ?
            ORDER BY m.created_at DESC, m.id DESC
        ");

        $stmtMateri->execute([$mentor_id]);
        $materi = $stmtMateri->fetchAll(PDO::FETCH_ASSOC);

        // Mengambil program yang diampu mentor
        $stmtProgram = $pdo->prepare("
            SELECT
                p.id,
                p.nama_program
            FROM mentor_program mp
            JOIN program p ON mp.program_id = p.id
            WHERE mp.mentor_id = ?
            ORDER BY p.nama_program ASC
        ");

        $stmtProgram->execute([$mentor_id]);
        $program = $stmtProgram->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "success" => true,
            "data" => [
                "materi" => $materi,
                "program" => $program
            ]
        ]);

        exit;
    }


    // ==========================================
    // METHOD POST: Menyimpan materi baru
    // ==========================================
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {

        $judul = trim($_POST['judul'] ?? '');
        $program_id = $_POST['program_id'] ?? '';
        $konten_materi = $_POST['konten_materi'] ?? '';

        // Validasi input wajib
        if ($judul === '' || $program_id === '') {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Judul dan program wajib diisi."
            ]);
            exit;
        }

        if (!ctype_digit((string) $program_id)) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Program tidak valid."
            ]);
            exit;
        }

        // Pastikan program memang diampu mentor
        $stmtCekProgram = $pdo->prepare("
            SELECT id
            FROM mentor_program
            WHERE mentor_id = ? AND program_id = ?
        ");

        $stmtCekProgram->execute([$mentor_id, $program_id]);

        if (!$stmtCekProgram->fetch()) {
            http_response_code(403);
            echo json_encode([
                "success" => false,
                "message" => "Program tersebut bukan program yang diampu."
            ]);
            exit;
        }

        $file_materi = null;

        // Proses upload file jika ada
        if (
            isset($_FILES['file_materi']) &&
            $_FILES['file_materi']['error'] !== UPLOAD_ERR_NO_FILE
        ) {

            $file = $_FILES['file_materi'];

            if ($file['error'] !== UPLOAD_ERR_OK) {
                throw new Exception("File gagal diunggah.");
            }

            // Maksimal ukuran file 50 MB
            if ($file['size'] > 50 * 1024 * 1024) {
                throw new Exception("Ukuran file maksimal 50 MB.");
            }

            // Format file yang diperbolehkan
            $formatDiizinkan = ['pdf', 'ppt', 'pptx', 'zip', 'mp4'];
            $ekstensi = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

            if (!in_array($ekstensi, $formatDiizinkan, true)) {
                throw new Exception("Format file tidak diizinkan.");
            }

            // Membuat folder upload jika belum tersedia
            $folderUpload = __DIR__ . '/../../uploads/materi/';

            if (!is_dir($folderUpload)) {
                mkdir($folderUpload, 0755, true);
            }

            // Membuat nama file baru agar tidak bentrok
            $namaFileBaru = bin2hex(random_bytes(16)) . '.' . $ekstensi;

            $lokasiFile = $folderUpload . $namaFileBaru;

            if (!move_uploaded_file($file['tmp_name'], $lokasiFile)) {
                throw new Exception("File gagal disimpan ke folder upload.");
            }

            // Path yang disimpan ke database
            $file_materi = 'uploads/materi/' . $namaFileBaru;
        }

        // Simpan data materi ke database
        $stmtInsert = $pdo->prepare("
            INSERT INTO materi (
                mentor_id,
                program_id,
                judul,
                konten_materi,
                file_materi,
                tanggal_publikasi,
                created_at,
                updated_at
            )
            VALUES (?, ?, ?, ?, ?, CURRENT_DATE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            RETURNING id
        ");

        $stmtInsert->execute([
            $mentor_id,
            $program_id,
            $judul,
            $konten_materi,
            $file_materi
        ]);

        $materi_id = $stmtInsert->fetchColumn();

        // File sudah tersimpan bersama data materi
        $lokasiFile = null;

        echo json_encode([
            "success" => true,
            "message" => "Materi berhasil dipublikasikan.",
            "data" => [
                "id" => $materi_id,
                "file_materi" => $file_materi
            ]
        ]);

        exit;
    }


    // ==========================================
    // METHOD DELETE: Menghapus materi
    // ==========================================
    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {

        // Mengambil ID materi dari JSON
        $input = json_decode(file_get_contents("php://input"), true);
        $materi_id = $input['id'] ?? '';

        // Validasi ID materi
        if (!ctype_digit((string) $materi_id) || (int) $materi_id < 1) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "ID materi tidak valid."
            ]);
            exit;
        }

        // Memastikan materi milik mentor yang sedang login
        $stmtCek = $pdo->prepare("
            SELECT file_materi
            FROM materi
            WHERE id = ? AND mentor_id = ?
        ");

        $stmtCek->execute([$materi_id, $mentor_id]);
        $dataMateri = $stmtCek->fetch(PDO::FETCH_ASSOC);

        if (!$dataMateri) {
            http_response_code(404);
            echo json_encode([
                "success" => false,
                "message" => "Materi tidak ditemukan atau bukan milik Anda."
            ]);
            exit;
        }

        $file_materi = $dataMateri['file_materi'];

        // Menghapus data materi dari database
        $pdo->beginTransaction();

        $stmtDelete = $pdo->prepare("
            DELETE FROM materi
            WHERE id = ? AND mentor_id = ?
        ");

        $stmtDelete->execute([$materi_id, $mentor_id]);

        if ($stmtDelete->rowCount() === 0) {
            $pdo->rollBack();

            http_response_code(404);
            echo json_encode([
                "success" => false,
                "message" => "Materi gagal dihapus."
            ]);
            exit;
        }

        $pdo->commit();

        // Menghapus file fisik jika berasal dari folder upload materi
        if (
            $file_materi &&
            preg_match(
                '/\Auploads\/materi\/[a-f0-9]{32}\.(pdf|ppt|pptx|zip|mp4)\z/i',
                $file_materi
            )
        ) {
            $folderBackend = realpath(__DIR__ . '/../../');

            if ($folderBackend !== false) {
                $lokasiHapus = $folderBackend . DIRECTORY_SEPARATOR .
                    str_replace('/', DIRECTORY_SEPARATOR, $file_materi);

                if (is_file($lokasiHapus)) {
                    if (!unlink($lokasiHapus)) {
                        error_log("File materi gagal dihapus: " . $lokasiHapus);
                    }
                }
            }
        }

        echo json_encode([
            "success" => true,
            "message" => "Materi berhasil dihapus."
        ]);

        exit;
    }


    // Method selain GET, POST, dan DELETE
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Method tidak diizinkan."
    ]);

} catch (Throwable $e) {

    // Hapus file jika upload berhasil tetapi penyimpanan database gagal
    if ($lokasiFile && file_exists($lokasiFile)) {
        unlink($lokasiFile);
    }

    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    error_log($e->getMessage());

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
?>
