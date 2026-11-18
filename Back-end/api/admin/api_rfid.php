
<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once '../../config/koneksi.php';

try {

    // Mengambil daftar peserta beserta ID RFID
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {

        $stmt = $pdo->prepare("
            SELECT
                u.id,
                u.nama,
                u.nisn,
                u.id_rfid,
                u.rfid_assigned_at,
                p.nama_program
            FROM users u
            LEFT JOIN peserta_program pp
                ON u.id = pp.peserta_id
            LEFT JOIN program p
                ON pp.program_id = p.id
            WHERE u.role = 'peserta'
            ORDER BY u.id DESC
        ");

        $stmt->execute();

        echo json_encode([
            "success" => true,
            "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)
        ]);

        exit;
    }

    // Menyimpan atau memperbarui ID RFID
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {

        $input = json_decode(file_get_contents("php://input"), true);

        $userId = $input['user_id'] ?? null;
        $idRfid = trim($input['id_rfid'] ?? '');

        if (!$userId || !is_numeric($userId)) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "ID peserta tidak valid."
            ]);
            exit;
        }

        // Input kosong berarti menghapus ID RFID
        $idRfid = $idRfid === '' ? null : $idRfid;

        $stmt = $pdo->prepare("
            UPDATE users
            SET
                rfid_assigned_at = CASE
                    WHEN NULLIF(TRIM(:rfid_tanggal), '') IS NULL
                        THEN NULL
                    WHEN id_rfid IS DISTINCT FROM NULLIF(TRIM(:rfid_lama), '')
                        THEN CURRENT_TIMESTAMP
                    ELSE rfid_assigned_at
                END,
                id_rfid = NULLIF(TRIM(:id_rfid), '')
            WHERE id = :id
              AND role = 'peserta'
        ");
        
        $stmt->execute([
            ':rfid_tanggal' => $idRfid,
            ':rfid_lama' => $idRfid,
            ':id_rfid' => $idRfid,
            ':id' => $userId
        ]);

        if ($stmt->rowCount() === 0) {
            // Memastikan peserta memang ada, termasuk jika nilainya tidak berubah
            $check = $pdo->prepare("
                SELECT id FROM users
                WHERE id = :id AND role = 'peserta'
            ");
            $check->execute([':id' => $userId]);

            if (!$check->fetch()) {
                http_response_code(404);
                echo json_encode([
                    "success" => false,
                    "message" => "Data peserta tidak ditemukan."
                ]);
                exit;
            }
        }

        echo json_encode([
            "success" => true,
            "message" => "ID RFID berhasil disimpan."
        ]);

        exit;
    }

    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Metode tidak diizinkan."
    ]);

} catch (PDOException $e) {

    if ($e->getCode() === '23505') {
        http_response_code(409);
        echo json_encode([
            "success" => false,
            "message" => "ID RFID tersebut sudah digunakan peserta lain."
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Terjadi kesalahan database."
        ]);
    }

} catch (Exception $e) {

    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Terjadi kesalahan server."
    ]);
}
?>
