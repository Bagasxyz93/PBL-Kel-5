<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once '../../config/koneksi.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $peserta_id = $_GET['peserta_id'] ?? null;

        if ($peserta_id) {
            $stmt = $pdo->prepare("SELECT * FROM daily_report WHERE peserta_id = :peserta_id ORDER BY tanggal DESC");
            $stmt->execute(['peserta_id' => $peserta_id]);
        } else {
            $stmt = $pdo->prepare("SELECT daily_report.*, users.nama as nama_peserta FROM daily_report JOIN users ON daily_report.peserta_id = users.id ORDER BY tanggal DESC");
            $stmt->execute();
        }

        $reportList = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Menghitung jumlah laporan yang perlu direview
        $stmtReview = $pdo->prepare("
            SELECT COUNT(*) 
            FROM daily_report 
            WHERE status = 'menunggu'
        ");
        $stmtReview->execute();
        $totalPerluReview = $stmtReview->fetchColumn();

        echo json_encode([
            "success" => true,
            "data" => $reportList,
            "total_perlu_review" => (int) $totalPerluReview
        ]);
    } elseif ($method === 'POST') {
        $input = json_decode(file_get_contents("php://input"), true);
        
        $peserta_id = $input['peserta_id'] ?? null;
        $materi_id = $input['materi_id'] ?? null;
        $tanggal = $input['tanggal'] ?? date('Y-m-d');
        $judul = $input['judul'] ?? '';
        $isi_laporan = $input['isi_laporan'] ?? '';
        $bukti_file = $input['bukti_file'] ?? '';

        if (empty($peserta_id) || empty($materi_id) || empty($judul) || empty($isi_laporan)) {
            echo json_encode(["success" => false, "message" => "Data laporan harian belum lengkap."]);
            exit();
        }

        $stmt = $pdo->prepare("INSERT INTO daily_report (peserta_id, materi_id, tanggal, judul, isi_laporan, bukti_file, status) 
                               VALUES (:peserta_id, :materi_id, :tanggal, :judul, :isi_laporan, :bukti_file, 'menunggu')");
        
        $stmt->execute([
            'peserta_id' => $peserta_id,
            'materi_id' => $materi_id,
            'tanggal' => $tanggal,
            'judul' => $judul,
            'isi_laporan' => $isi_laporan,
            'bukti_file' => $bukti_file
        ]);

        echo json_encode([
            "success" => true,
            "message" => "Daily report berhasil dikirim."
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Gagal memproses daily report: " . $e->getMessage()
    ]);
}
?>