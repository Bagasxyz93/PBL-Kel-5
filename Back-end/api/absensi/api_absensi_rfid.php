
<?php

ob_start();

header('Content-Type: application/json; charset=utf-8');

date_default_timezone_set('Asia/Jakarta');

require_once '../../config/koneksi.php';

function responseJSON($status, $message, $data = null)
{
    if (ob_get_length()) {
        ob_clean();
    }

    http_response_code($status);

    echo json_encode([
        'success' => $status >= 200 && $status < 300,
        'message' => $message,
        'data' => $data
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

// =========================================================
// 1. VALIDASI REQUEST
// =========================================================

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responseJSON(405, 'Method tidak diizinkan.');
}

$db = $pdo ?? $conn ?? $koneksi ?? null;

if (!$db instanceof PDO) {
    responseJSON(500, 'Koneksi database tidak tersedia.');
}

$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$input = json_decode(file_get_contents('php://input'), true);

$id_rfid = trim((string) (
    $input['id_rfid'] ?? $_POST['id_rfid'] ?? ''
));

if ($id_rfid === '') {
    responseJSON(400, 'ID RFID wajib diisi.');
}

// =========================================================
// 2. TENTUKAN JENIS ABSENSI BERDASARKAN JAM WIB
// =========================================================

$jamSekarang = date('H:i:s');

$jamMasukMulai = '06:00:00';
$jamMasukSelesai = '07:00:00';

$jamKeluarMulai = '13:00:00';
$jamKeluarSelesai = '14:00:00';

$jenisAbsen = null;

if (
    $jamSekarang >= $jamMasukMulai &&
    $jamSekarang < $jamMasukSelesai
) {
    $jenisAbsen = 'masuk';
} elseif (
    $jamSekarang >= $jamKeluarMulai &&
    $jamSekarang < $jamKeluarSelesai
) {
    $jenisAbsen = 'keluar';
} else {
    responseJSON(400, 'Waktu scan RFID di luar jadwal absensi.');
}

// =========================================================
// 3. PROSES ABSENSI RFID
// =========================================================

try {

    $db->beginTransaction();

    // -----------------------------------------------------
    // Cari peserta berdasarkan ID RFID
    // -----------------------------------------------------

    $stmtPeserta = $db->prepare("
        SELECT id, nama, id_rfid
        FROM users
        WHERE id_rfid = :id_rfid
          AND role = 'peserta'
          AND LOWER(status_akun) = 'aktif'
        LIMIT 1
    ");

    $stmtPeserta->execute([
        ':id_rfid' => $id_rfid
    ]);

    $peserta = $stmtPeserta->fetch(PDO::FETCH_ASSOC);

    if (!$peserta) {
        $db->rollBack();

        responseJSON(
            404,
            'RFID tidak terdaftar atau akun tidak aktif.'
        );
    }

    $peserta_id = (int) $peserta['id'];

    $tanggal = date('Y-m-d');
    $waktuSekarang = date('Y-m-d H:i:s');

    // -----------------------------------------------------
    // Ambil seluruh program aktif peserta
    // -----------------------------------------------------

    $stmtProgram = $db->prepare("
        SELECT program_id
        FROM peserta_program
        WHERE peserta_id = :peserta_id
          AND status = 'Aktif'
        ORDER BY program_id
    ");

    $stmtProgram->execute([
        ':peserta_id' => $peserta_id
    ]);

    $programIds = $stmtProgram->fetchAll(PDO::FETCH_COLUMN);

    if (empty($programIds)) {
        $db->rollBack();

        responseJSON(
            400,
            'Peserta tidak memiliki program aktif.'
        );
    }

    $hasil = [];

    // =====================================================
    // 4. PROSES SETIAP PROGRAM
    // =====================================================

    foreach ($programIds as $program_id) {

        $program_id = (int) $program_id;

        // -------------------------------------------------
        // Cari absensi hari ini beserta status pengajuan
        // -------------------------------------------------

        $stmtExisting = $db->prepare("
            SELECT
                a.id,
                a.status,
                a.waktu_masuk,
                a.waktu_keluar,
                a.keterangan,

                CASE
                    WHEN EXISTS (
                        SELECT 1
                        FROM pengajuan_izin pi
                        WHERE pi.absensi_id = a.id
                          AND pi.status = 'menunggu'
                    )
                    THEN 1
                    ELSE 0
                END AS ada_pengajuan_menunggu

            FROM absensi a

            WHERE a.peserta_id = :peserta_id
              AND a.program_id = :program_id
              AND a.tanggal = :tanggal

            FOR UPDATE OF a
        ");

        $parameterExisting = [
            ':peserta_id' => $peserta_id,
            ':program_id' => $program_id,
            ':tanggal' => $tanggal
        ];

        $stmtExisting->execute($parameterExisting);

        $absen = $stmtExisting->fetch(PDO::FETCH_ASSOC);

        // =================================================
        // 5. JIKA RECORD ABSENSI BELUM ADA
        // =================================================

        if (!$absen) {

            if ($jenisAbsen === 'masuk') {

                $stmtInsert = $db->prepare("
                    INSERT INTO absensi (
                        peserta_id,
                        program_id,
                        tanggal,
                        status,
                        waktu_masuk,
                        keterangan
                    )
                    VALUES (
                        :peserta_id,
                        :program_id,
                        :tanggal,
                        'hadir',
                        :waktu_masuk,
                        'Absensi RFID - Masuk'
                    )
                    ON CONFLICT (peserta_id, program_id, tanggal)
                    DO NOTHING
                    RETURNING id
                ");

                $stmtInsert->execute([
                    ':peserta_id' => $peserta_id,
                    ':program_id' => $program_id,
                    ':tanggal' => $tanggal,
                    ':waktu_masuk' => $waktuSekarang
                ]);

            } else {

                $stmtInsert = $db->prepare("
                    INSERT INTO absensi (
                        peserta_id,
                        program_id,
                        tanggal,
                        status,
                        waktu_keluar,
                        keterangan
                    )
                    VALUES (
                        :peserta_id,
                        :program_id,
                        :tanggal,
                        'hadir',
                        :waktu_keluar,
                        'Absensi RFID - Keluar'
                    )
                    ON CONFLICT (peserta_id, program_id, tanggal)
                    DO NOTHING
                    RETURNING id
                ");

                $stmtInsert->execute([
                    ':peserta_id' => $peserta_id,
                    ':program_id' => $program_id,
                    ':tanggal' => $tanggal,
                    ':waktu_keluar' => $waktuSekarang
                ]);
            }

            $idBaru = $stmtInsert->fetchColumn();

            if ($idBaru) {

                $hasil[] = [
                    'program_id' => $program_id,
                    'aksi' => $jenisAbsen,
                    'status' => 'hadir',
                    'waktu_masuk' => $jenisAbsen === 'masuk'
                        ? $waktuSekarang
                        : null,
                    'waktu_keluar' => $jenisAbsen === 'keluar'
                        ? $waktuSekarang
                        : null
                ];

                continue;
            }

            // Jika terjadi konflik, ambil ulang record.
            $stmtExisting->execute($parameterExisting);

            $absen = $stmtExisting->fetch(PDO::FETCH_ASSOC);

            if (!$absen) {
                $hasil[] = [
                    'program_id' => $program_id,
                    'aksi' => 'tidak_diproses',
                    'keterangan' => 'Gagal membaca data absensi.'
                ];

                continue;
            }
        }

        // =================================================
        // 6. PERIKSA STATUS ABSENSI
        // =================================================

        $status = strtolower(trim($absen['status']));

        $adaPengajuanMenunggu =
            (int) $absen['ada_pengajuan_menunggu'] === 1;

        // -------------------------------------------------
        // Jika status alpha sementara karena pengajuan
        // yang masih menunggu, scan boleh mengubahnya hadir.
        // -------------------------------------------------

        $alphaSementara =
            $status === 'alpha'
            && $absen['keterangan'] === 'Menunggu pengajuan izin'
            && $adaPengajuanMenunggu;

        // -------------------------------------------------
        // Status selain hadir atau alpha sementara
        // tidak boleh ditimpa oleh scan RFID.
        // -------------------------------------------------

        if ($status !== 'hadir' && !$alphaSementara) {

            $hasil[] = [
                'program_id' => $program_id,
                'aksi' => 'tidak_diproses',
                'status' => $status,
                'keterangan' => 'Status absensi sudah ditetapkan dan tidak dapat ditimpa RFID.'
            ];

            continue;
        }

        // =================================================
        // 7. PROSES ABSEN MASUK
        // =================================================

        if ($jenisAbsen === 'masuk') {

            if ($absen['waktu_masuk'] !== null) {

                $hasil[] = [
                    'program_id' => $program_id,
                    'aksi' => 'sudah_absen_masuk',
                    'status' => $status,
                    'waktu_masuk' => $absen['waktu_masuk']
                ];

                continue;
            }

            if ($alphaSementara) {

                $stmtUpdate = $db->prepare("
                    UPDATE absensi a

                    SET
                        status = 'hadir',
                        waktu_masuk = :waktu_masuk,
                        keterangan = 'Absensi RFID - Masuk'

                    WHERE a.id = :id
                      AND a.status = 'alpha'
                      AND a.keterangan = 'Menunggu pengajuan izin'
                      AND EXISTS (
                          SELECT 1
                          FROM pengajuan_izin pi
                          WHERE pi.absensi_id = a.id
                            AND pi.status = 'menunggu'
                      )
                      AND a.waktu_masuk IS NULL

                    RETURNING waktu_masuk
                ");

            } else {

                $stmtUpdate = $db->prepare("
                    UPDATE absensi

                    SET
                        waktu_masuk = :waktu_masuk,
                        keterangan = 'Absensi RFID - Masuk'

                    WHERE id = :id
                      AND status = 'hadir'
                      AND waktu_masuk IS NULL

                    RETURNING waktu_masuk
                ");
            }

            $stmtUpdate->execute([
                ':waktu_masuk' => $waktuSekarang,
                ':id' => $absen['id']
            ]);

            $waktuMasuk = $stmtUpdate->fetchColumn();

            if ($waktuMasuk) {

                $hasil[] = [
                    'program_id' => $program_id,
                    'aksi' => 'masuk',
                    'status' => 'hadir',
                    'waktu_masuk' => $waktuMasuk
                ];

            } else {

                $hasil[] = [
                    'program_id' => $program_id,
                    'aksi' => 'tidak_diproses',
                    'keterangan' => 'Absensi masuk gagal diperbarui.'
                ];
            }

            continue;
        }

        // =================================================
        // 8. PROSES ABSEN KELUAR
        // =================================================

        if ($jenisAbsen === 'keluar') {

            if ($absen['waktu_keluar'] !== null) {

                $hasil[] = [
                    'program_id' => $program_id,
                    'aksi' => 'sudah_absen_keluar',
                    'status' => $status,
                    'waktu_masuk' => $absen['waktu_masuk'],
                    'waktu_keluar' => $absen['waktu_keluar']
                ];

                continue;
            }

            if ($alphaSementara) {

                $stmtUpdate = $db->prepare("
                    UPDATE absensi a

                    SET
                        status = 'hadir',
                        waktu_keluar = :waktu_keluar,
                        keterangan = 'Absensi RFID - Keluar'

                    WHERE a.id = :id
                      AND a.status = 'alpha'
                      AND a.keterangan = 'Menunggu pengajuan izin'
                      AND EXISTS (
                          SELECT 1
                          FROM pengajuan_izin pi
                          WHERE pi.absensi_id = a.id
                            AND pi.status = 'menunggu'
                      )
                      AND a.waktu_keluar IS NULL

                    RETURNING waktu_keluar
                ");

            } else {

                $stmtUpdate = $db->prepare("
                    UPDATE absensi

                    SET
                        waktu_keluar = :waktu_keluar,
                        keterangan = 'Absensi RFID - Keluar'

                    WHERE id = :id
                      AND status = 'hadir'
                      AND waktu_keluar IS NULL

                    RETURNING waktu_keluar
                ");
            }

            $stmtUpdate->execute([
                ':waktu_keluar' => $waktuSekarang,
                ':id' => $absen['id']
            ]);

            $waktuKeluar = $stmtUpdate->fetchColumn();

            if ($waktuKeluar) {

                $hasil[] = [
                    'program_id' => $program_id,
                    'aksi' => 'keluar',
                    'status' => 'hadir',
                    'waktu_masuk' => $absen['waktu_masuk'],
                    'waktu_keluar' => $waktuKeluar
                ];

            } else {

                $hasil[] = [
                    'program_id' => $program_id,
                    'aksi' => 'tidak_diproses',
                    'keterangan' => 'Absensi keluar gagal diperbarui.'
                ];
            }
        }
    }

    // =====================================================
    // 9. SIMPAN TRANSAKSI
    // =====================================================

    $db->commit();

    // =====================================================
    // 10. RESPONS
    // =====================================================

    responseJSON(
        200,
        'Pencatatan absensi RFID berhasil diproses.',
        [
            'peserta_id' => $peserta_id,
            'nama' => $peserta['nama'],
            'tanggal' => $tanggal,
            'jenis_absen' => $jenisAbsen,
            'hasil_absensi' => $hasil
        ]
    );

} catch (Throwable $e) {

    if ($db->inTransaction()) {
        $db->rollBack();
    }

    error_log('API Absensi RFID: ' . $e->getMessage());

    responseJSON(
        500,
        'Terjadi kesalahan saat memproses absensi.'
    );
}
