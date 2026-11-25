
<?php

ob_start();

header('Content-Type: application/json; charset=utf-8');

date_default_timezone_set('Asia/Jakarta');

require_once '../../config/koneksi.php';
require_once '../../config/tab_auth.php';

// =====================================================
// RESPONSE JSON
// =====================================================

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

// =====================================================
// 1. HANYA POST
// =====================================================

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responseJSON(405, 'Method tidak diizinkan.');
}

// =====================================================
// 2. AUTENTIKASI ADMIN
// =====================================================

$userToken = ambilUserToken();

if (!$userToken) {
    responseJSON(false, 'Token tidak valid atau sesi telah berakhir.', null, 401);
}

if ($userToken['role'] !== 'admin') {
    responseJSON(false, 'Akses ditolak. Hanya admin yang dapat melakukan penentuan Alpha.', null, 403);
}

if (!$userToken || !isset($userToken['role'])) {
    responseJSON(401, 'Token tidak valid atau kedaluwarsa.');
}

if ($userToken['role'] !== 'admin') {
    responseJSON(403, 'Akses hanya untuk admin.');
}

// =====================================================
// 3. KONEKSI DATABASE
// =====================================================

$db = $pdo ?? $conn ?? $koneksi ?? null;

if (!$db instanceof PDO) {
    responseJSON(500, 'Koneksi database tidak tersedia.');
}

$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// =====================================================
// 4. INPUT DAN VALIDASI TANGGAL
// =====================================================

$input = json_decode(file_get_contents('php://input'), true);

$tanggal = $input['tanggal'] ?? '';

if ($tanggal === '') {
    responseJSON(400, 'Tanggal absensi wajib diisi.');
}

$dateObj = DateTime::createFromFormat(
    '!Y-m-d',
    $tanggal,
    new DateTimeZone('Asia/Jakarta')
);

if (!$dateObj || $dateObj->format('Y-m-d') !== $tanggal) {
    responseJSON(400, 'Format tanggal tidak valid.');
}

$sekarang = new DateTime('now', new DateTimeZone('Asia/Jakarta'));

if ($dateObj > $sekarang) {
    responseJSON(400, 'Tanggal mendatang tidak dapat diproses.');
}

// =====================================================
// 5. BATAS WAKTU PENENTUAN ALPHA
// =====================================================

// Penentuan hanya boleh dilakukan mulai pukul 00.00
// pada hari berikutnya dari tanggal absensi.

$batasWaktu = clone $dateObj;
$batasWaktu->modify('+1 day');
$batasWaktu->setTime(0, 0, 0);

if ($sekarang < $batasWaktu) {
    responseJSON(
        400,
        'Penentuan alpha hanya dapat dilakukan setelah pukul 00.00 WIB pada hari berikutnya.',
        [
            'tanggal_absensi' => $tanggal,
            'waktu_mulai_proses' => $batasWaktu->format('Y-m-d H:i:s')
        ]
    );
}

// =====================================================
// 6. PROSES PENENTUAN ALPHA
// =====================================================

try {

    $db->beginTransaction();

    // Ambil peserta dan program yang masih aktif
    $stmtPeserta = $db->prepare("
        SELECT
            pp.peserta_id,
            pp.program_id
        FROM peserta_program pp
        JOIN users u
            ON u.id = pp.peserta_id
        WHERE pp.status = 'Aktif'
          AND u.role = 'peserta'
          AND LOWER(u.status_akun) = 'aktif'
          AND pp.tanggal_daftar <= :tanggal
        ORDER BY pp.peserta_id, pp.program_id
    ");

    $stmtPeserta->execute([
        ':tanggal' => $tanggal
    ]);

    $daftarPeserta = $stmtPeserta->fetchAll(PDO::FETCH_ASSOC);

    $jumlahAlpha = 0;
    $jumlahIzin = 0;
    $jumlahSakit = 0;
    $jumlahMenunggu = 0;
    $jumlahDilewati = 0;

    $hasil = [];

    // =================================================
    // 7. PERIKSA SETIAP PESERTA
    // =================================================

    foreach ($daftarPeserta as $peserta) {

        $pesertaId = (int) $peserta['peserta_id'];
        $programId = (int) $peserta['program_id'];

        // -------------------------------------------------
        // Cari record absensi dan kunci jika tersedia
        // -------------------------------------------------

        $stmtCek = $db->prepare("
            SELECT
                id,
                status,
                waktu_masuk,
                waktu_keluar
            FROM absensi
            WHERE peserta_id = :peserta_id
              AND program_id = :program_id
              AND tanggal = :tanggal
            LIMIT 1
            FOR UPDATE
        ");

        $stmtCek->execute([
            ':peserta_id' => $pesertaId,
            ':program_id' => $programId,
            ':tanggal' => $tanggal
        ]);

        $absen = $stmtCek->fetch(PDO::FETCH_ASSOC);

        // -------------------------------------------------
        // Jika absensi belum tersedia, buat Alpha
        // -------------------------------------------------

        if (!$absen) {

            $stmtAlpha = $db->prepare("
                INSERT INTO absensi (
                    peserta_id,
                    program_id,
                    tanggal,
                    status,
                    keterangan
                )
                VALUES (
                    :peserta_id,
                    :program_id,
                    :tanggal,
                    'alpha',
                    'Alpha - Tidak melakukan absensi'
                )
                ON CONFLICT (peserta_id, program_id, tanggal)
                DO NOTHING
                RETURNING id
            ");

            $stmtAlpha->execute([
                ':peserta_id' => $pesertaId,
                ':program_id' => $programId,
                ':tanggal' => $tanggal
            ]);

            $idBaru = $stmtAlpha->fetchColumn();

            if ($idBaru) {

                $jumlahAlpha++;

                $hasil[] = [
                    'peserta_id' => $pesertaId,
                    'program_id' => $programId,
                    'aksi' => 'alpha',
                    'absensi_id' => $idBaru,
                    'keterangan' => 'Tidak melakukan absensi dan tidak memiliki pengajuan.'
                ];

            } else {

                $jumlahDilewati++;

                $hasil[] = [
                    'peserta_id' => $pesertaId,
                    'program_id' => $programId,
                    'aksi' => 'dilewati',
                    'keterangan' => 'Record absensi sudah dibuat oleh proses lain.'
                ];
            }

            continue;
        }

        $absensiId = (int) $absen['id'];
        $statusAbsensi = strtolower($absen['status']);

        // -------------------------------------------------
        // Jika sudah hadir, jangan diubah
        // -------------------------------------------------

        if ($statusAbsensi === 'hadir') {

            $jumlahDilewati++;

            $hasil[] = [
                'peserta_id' => $pesertaId,
                'program_id' => $programId,
                'absensi_id' => $absensiId,
                'aksi' => 'dilewati',
                'status' => 'hadir',
                'keterangan' => 'Peserta sudah melakukan absensi.'
            ];

            continue;
        }

        // -------------------------------------------------
        // Cari pengajuan izin peserta
        // -------------------------------------------------

        $stmtPengajuan = $db->prepare("
            SELECT
                id,
                alasan,
                status
            FROM pengajuan_izin
            WHERE absensi_id = :absensi_id
            ORDER BY id DESC
            LIMIT 1
        ");

        $stmtPengajuan->execute([
            ':absensi_id' => $absensiId
        ]);

        $pengajuan = $stmtPengajuan->fetch(PDO::FETCH_ASSOC);

        // -------------------------------------------------
        // Jika ada pengajuan
        // -------------------------------------------------

        if ($pengajuan) {

            $statusPengajuan = strtolower($pengajuan['status']);

            // =============================================
            // PENGAJUAN MASIH MENUNGGU
            // =============================================

            if ($statusPengajuan === 'menunggu') {

                $jumlahMenunggu++;

                $hasil[] = [
                    'peserta_id' => $pesertaId,
                    'program_id' => $programId,
                    'absensi_id' => $absensiId,
                    'aksi' => 'menunggu',
                    'status' => 'menunggu',
                    'keterangan' => 'Menunggu keputusan mentor. Tidak ditetapkan Alpha.'
                ];

                continue;
            }

            // =============================================
            // PENGAJUAN DISETUJUI
            // =============================================

            if ($statusPengajuan === 'disetujui') {

                // Baca jenis pengajuan dari kolom alasan
                $jenisPengajuan = null;

                if (preg_match(
                    '/^\s*Jenis:\s*(Izin|Sakit)\s*$/mi',
                    $pengajuan['alasan'],
                    $matches
                )) {
                    $jenisPengajuan = strtolower($matches[1]);
                }

                if (!$jenisPengajuan) {

                    $jumlahDilewati++;

                    $hasil[] = [
                        'peserta_id' => $pesertaId,
                        'program_id' => $programId,
                        'absensi_id' => $absensiId,
                        'aksi' => 'dilewati',
                        'keterangan' => 'Jenis pengajuan tidak dapat dikenali.'
                    ];

                    continue;
                }

                // Jangan mengubah absensi yang sudah memiliki scan
                if (
                    $absen['waktu_masuk'] !== null ||
                    $absen['waktu_keluar'] !== null
                ) {

                    $jumlahDilewati++;

                    $hasil[] = [
                        'peserta_id' => $pesertaId,
                        'program_id' => $programId,
                        'absensi_id' => $absensiId,
                        'aksi' => 'dilewati',
                        'keterangan' => 'Data scan sudah tersedia.'
                    ];

                    continue;
                }

                // Ubah status sesuai jenis pengajuan
                $stmtUpdate = $db->prepare("
                    UPDATE absensi
                    SET
                        status = :status,
                        keterangan = :keterangan
                    WHERE id = :id
                      AND status = 'alpha'
                      AND waktu_masuk IS NULL
                      AND waktu_keluar IS NULL
                ");

                $stmtUpdate->execute([
                    ':status' => $jenisPengajuan,
                    ':keterangan' => 'Pengajuan ' . $jenisPengajuan . ' disetujui mentor.',
                    ':id' => $absensiId
                ]);

                if ($stmtUpdate->rowCount() > 0) {

                    if ($jenisPengajuan === 'izin') {
                        $jumlahIzin++;
                    } else {
                        $jumlahSakit++;
                    }

                    $hasil[] = [
                        'peserta_id' => $pesertaId,
                        'program_id' => $programId,
                        'absensi_id' => $absensiId,
                        'aksi' => $jenisPengajuan,
                        'status' => $jenisPengajuan,
                        'keterangan' => 'Pengajuan telah disetujui mentor.'
                    ];

                } else {

                    $jumlahDilewati++;

                    $hasil[] = [
                        'peserta_id' => $pesertaId,
                        'program_id' => $programId,
                        'absensi_id' => $absensiId,
                        'aksi' => 'dilewati',
                        'keterangan' => 'Status absensi tidak dapat diperbarui.'
                    ];
                }

                continue;
            }

            // =============================================
            // PENGAJUAN DITOLAK
            // =============================================

            if ($statusPengajuan === 'ditolak') {

                // Jika belum ada scan, pastikan status Alpha
                if (
                    $absen['waktu_masuk'] === null &&
                    $absen['waktu_keluar'] === null &&
                    $statusAbsensi === 'alpha'
                ) {

                    $jumlahAlpha++;

                    $hasil[] = [
                        'peserta_id' => $pesertaId,
                        'program_id' => $programId,
                        'absensi_id' => $absensiId,
                        'aksi' => 'alpha',
                        'status' => 'alpha',
                        'keterangan' => 'Pengajuan ditolak mentor.'
                    ];

                } else {

                    $jumlahDilewati++;

                    $hasil[] = [
                        'peserta_id' => $pesertaId,
                        'program_id' => $programId,
                        'absensi_id' => $absensiId,
                        'aksi' => 'dilewati',
                        'keterangan' => 'Status absensi tidak perlu diubah.'
                    ];
                }

                continue;
            }

        }

        // -------------------------------------------------
        // Jika tidak ada pengajuan
        // -------------------------------------------------

        if ($statusAbsensi === 'alpha') {

            $jumlahAlpha++;

            $hasil[] = [
                'peserta_id' => $pesertaId,
                'program_id' => $programId,
                'absensi_id' => $absensiId,
                'aksi' => 'alpha',
                'status' => 'alpha',
                'keterangan' => 'Tidak melakukan absensi.'
            ];

            continue;
        }

        // -------------------------------------------------
        // Status lain tidak ditimpa
        // -------------------------------------------------

        $jumlahDilewati++;

        $hasil[] = [
            'peserta_id' => $pesertaId,
            'program_id' => $programId,
            'absensi_id' => $absensiId,
            'aksi' => 'dilewati',
            'status' => $statusAbsensi,
            'keterangan' => 'Status absensi dipertahankan.'
        ];
    }

    // =================================================
    // 8. COMMIT TRANSAKSI
    // =================================================

    $db->commit();

    responseJSON(200, 'Penentuan absensi berhasil diproses.', [
        'tanggal' => $tanggal,
        'waktu_proses' => $sekarang->format('Y-m-d H:i:s'),
        'jumlah_alpha' => $jumlahAlpha,
        'jumlah_izin' => $jumlahIzin,
        'jumlah_sakit' => $jumlahSakit,
        'jumlah_menunggu' => $jumlahMenunggu,
        'jumlah_dilewati' => $jumlahDilewati,
        'hasil' => $hasil
    ]);

} catch (Throwable $e) {

    if ($db->inTransaction()) {
        $db->rollBack();
    }

    error_log('API Penentuan Alpha: ' . $e->getMessage());

    responseJSON(
        500,
        'Terjadi kesalahan saat menentukan alpha.'
    );
}

?>
