<?php
header("Content-Type: application/json");
require_once '../../config/koneksi.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        // Ambil data absensi (bisa difilter berdasarkan peserta_id jika dikirim via GET)
        $peserta_id = $_GET['peserta_id'] ?? null;
        
        if ($peserta_id) {
            $stmt = $pdo->prepare("SELECT * FROM absensi WHERE peserta_id = :peserta_id ORDER BY tanggal DESC");
            $stmt->execute(['peserta_id' => $peserta_id]);
        } else {
            $stmt = $pdo->prepare("SELECT absensi.*, users.nama as nama_peserta FROM absensi JOIN users ON absensi.peserta_id = users.id ORDER BY tanggal DESC");
            $stmt->execute();
        }
        
        $absensiList = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "success" => true,
            "data" => $absensiList
        ]);
    } elseif ($method === 'POST') {
        // Kirim atau update absensi masuk
        $input = json_decode(file_get_contents("php://input"), true);
        $peserta_id = $input['peserta_id'] ?? null;
        $program_id = $input['program_id'] ?? null;
        $tanggal = $input['tanggal'] ?? date('Y-m-d');
        $status = $input['status'] ?? 'hadir';
        $waktu_masuk = date('Y-m-d H:i:s');

        $stmt = $pdo->prepare("INSERT INTO absensi (peserta_id, program_id, tanggal, status, waktu_masuk) 
                               VALUES (:peserta_id, :program_id, :tanggal, :status, :waktu_masuk)
                               ON CONFLICT (peserta_id, program_id, tanggal) 
                               DO UPDATE SET status = EXCLUDED.status, waktu_masuk = EXCLUDED.waktu_masuk");
        
        $stmt->execute([
            'peserta_id' => $peserta_id,
            'program_id' => $program_id,
            'tanggal' => $tanggal,
            'status' => $status,
            'waktu_masuk' => $waktu_masuk
        ]);

        echo json_encode([
            "success" => true,
            "message" => "Absensi berhasil dicatat."
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Gagal memproses absensi: " . $e->getMessage()
    ]);
}
?>