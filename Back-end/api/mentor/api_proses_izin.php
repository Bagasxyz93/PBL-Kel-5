
<?php

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

date_default_timezone_set('Asia/Jakarta');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../../config/koneksi.php';
require_once __DIR__ . '/../../config/tab_auth.php';

function responseJSON($success, $message, $code = 200, $data = null)
{
    http_response_code($code);

    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

// =====================================================
// 1. AUTENTIKASI MENTOR
// =====================================================

$userToken = ambilUserToken();

if (!$userToken || $userToken['role'] !== 'mentor') {
    responseJSON(false, "Akses hanya untuk mentor.", 401);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responseJSON(false, "Metode tidak diizinkan.", 405);
}

// =====================================================
// 2. AMBIL INPUT
// =====================================================

$input = json_decode(file_get_contents("php://input"), true);

if (!is_array($input)) {
    responseJSON(false, "Format data tidak valid.", 400);
}

$idPengajuan = filter_var(
    $input['id'] ?? null,
    FILTER_VALIDATE_INT
);

$aksi = $input['aksi'] ?? '';
$catatan = trim($input['catatan'] ?? '');

if (!$idPengajuan || !in_array($aksi, ['disetujui', 'ditolak'], true)) {
    responseJSON(false, "Data pengajuan tidak valid.", 400);
}

if (mb_strlen($catatan) > 1000) {
    responseJSON(false, "Catatan mentor maksimal 1000 karakter.", 400);
}

// =====================================================
// 3. PROSES PENGAJUAN
// =====================================================

try {

    $mentorId = (int) $userToken['user_id'];

    $pdo->beginTransaction();

    // Ambil dan kunci pengajuan serta absensi.
    // Penguncian absensi membantu mencegah konflik
    // dengan proses scan RFID yang juga mengubah absensi.

    $sql = "
        SELECT
            pi.id,
            pi.absensi_id,
            pi.status,
            pi.alasan,
            a.status AS status_absensi,
            a.keterangan AS keterangan_absensi,
            a.waktu_masuk,
            a.waktu_keluar

        FROM pengajuan_izin pi

        INNER JOIN absensi a
            ON pi.absensi_id = a.id

        INNER JOIN mentor_program mp
            ON mp.program_id = a.program_id

        WHERE pi.id = :id
          AND mp.mentor_id = :mentor_id

        LIMIT 1
        FOR UPDATE OF pi, a
    ";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ':id' => $idPengajuan,
        ':mentor_id' => $mentorId
    ]);

    $pengajuan = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$pengajuan) {
        $pdo->rollBack();

        responseJSON(
            false,
            "Pengajuan tidak ditemukan atau bukan program mentor.",
            404
        );
    }

    if ($pengajuan['status'] !== 'menunggu') {
        $pdo->rollBack();

        responseJSON(
            false,
            "Pengajuan ini sudah diproses sebelumnya.",
            409
        );
    }

    // =================================================
    // 4. BACA JENIS PENGAJUAN
    // =================================================

    $jenisPengajuan = null;

    if (preg_match(
        '/^\s*Jenis:\s*(Izin|Sakit)\s*$/mi',
        $pengajuan['alasan'],
        $matches
    )) {
        $jenisPengajuan = strtolower($matches[1]);
    }

    if (!$jenisPengajuan) {
        $pdo->rollBack();

        responseJSON(
            false,
            "Jenis pengajuan tidak ditemukan. Periksa data pengajuan.",
            400
        );
    }

    // =================================================
    // 5. UPDATE STATUS PENGAJUAN
    // =================================================

    $sqlUpdate = "
        UPDATE pengajuan_izin
        SET
            status = :status,
            catatan_mentor = :catatan,
            disetujui_oleh = :mentor_id,
            waktu_persetujuan = CURRENT_TIMESTAMP
        WHERE id = :id
          AND status = 'menunggu'
    ";

    $stmtUpdate = $pdo->prepare($sqlUpdate);

    $stmtUpdate->execute([
        ':status' => $aksi,
        ':catatan' => $catatan !== '' ? $catatan : null,
        ':mentor_id' => $mentorId,
        ':id' => $idPengajuan
    ]);

    if ($stmtUpdate->rowCount() !== 1) {
        throw new Exception("Pengajuan gagal diperbarui.");
    }

    // =================================================
    // 6. UPDATE ABSENSI JIKA DISETUJUI
    // =================================================

    if ($aksi === 'disetujui') {

        // Hanya alpha sementara yang dibuat oleh pengajuan
        // yang boleh berubah menjadi izin atau sakit.
        //
        // Jika RFID sudah mengubah status menjadi hadir,
        // query ini tidak akan mengubah status hadir tersebut.

        $sqlAbsensi = "
            UPDATE absensi
            SET
                status = :status,
                keterangan = :keterangan
            WHERE id = :absensi_id
              AND status = 'alpha'
              AND keterangan = 'Menunggu pengajuan izin'
              AND waktu_masuk IS NULL
              AND waktu_keluar IS NULL
        ";

        $stmtAbsensi = $pdo->prepare($sqlAbsensi);

        $stmtAbsensi->execute([
            ':status' => $jenisPengajuan,
            ':keterangan' => 'Pengajuan ' . $jenisPengajuan . ' disetujui mentor.',
            ':absensi_id' => $pengajuan['absensi_id']
        ]);
    }

    // =================================================
    // 7. BACA STATUS ABSENSI AKTUAL
    // =================================================

    $sqlStatus = "
        SELECT status
        FROM absensi
        WHERE id = :absensi_id
    ";

    $stmtStatus = $pdo->prepare($sqlStatus);

    $stmtStatus->execute([
        ':absensi_id' => $pengajuan['absensi_id']
    ]);

    $statusAbsensiAktual = $stmtStatus->fetchColumn();

    $pdo->commit();

    // =================================================
    // 8. RESPONSE
    // =================================================

    responseJSON(
        true,
        $aksi === 'disetujui'
            ? "Pengajuan " . ucfirst($jenisPengajuan) . " berhasil disetujui."
            : "Pengajuan berhasil ditolak.",
        200,
        [
            'id_pengajuan' => (int) $idPengajuan,
            'status_pengajuan' => $aksi,
            'jenis_pengajuan' => $jenisPengajuan,
            'status_absensi' => $statusAbsensiAktual
        ]
    );

} catch (Throwable $e) {

    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    error_log("Proses izin mentor: " . $e->getMessage());

    responseJSON(
        false,
        "Terjadi kesalahan saat memproses pengajuan izin.",
        500
    );
}

?>
