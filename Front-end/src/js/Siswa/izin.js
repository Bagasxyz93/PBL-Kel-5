
const API_URL = `${API_BASE_URL}/api/siswa`;

const API_PENGAJUAN = `${API_URL}/api_pengajuan_izin.php`;
const API_RIWAYAT = `${API_URL}/api_riwayat_izin.php`;

const BASE_URL = API_BASE_URL;

// =====================================================
// TOKEN AUTHENTICATION
// =====================================================

function getAuthHeaders() {
    const token = sessionStorage.getItem("authToken");

    if (!token) {
        throw new Error("Token login tidak ditemukan. Silakan login kembali.");
    }

    return {
        Authorization: `Bearer ${token}`
    };
}

// =====================================================
// ELEMENT HTML
// =====================================================

const formIzin = document.getElementById("form-izin");
const containerRiwayat = document.getElementById("riwayat-izin-container");

const inputTanggal = document.getElementById("tanggal-izin");
const inputJenis = document.getElementById("jenis-pengajuan");
const inputAlasan = document.getElementById("alasan-izin");
const inputBukti = document.getElementById("bukti-izin");

const namaFile = document.getElementById("nama-file-izin");
const pesanIzin = document.getElementById("pesan-izin");
const tombolAjukan = document.getElementById("btn-ajukan-izin");

const jumlahKarakter = document.getElementById("jumlah-karakter");
const jumlahRiwayat = document.getElementById("jumlah-riwayat");

const TEKS_TOMBOL = `
    <span>AJUKAN IZIN</span>
    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M14 5l7 7m0 0l-7 7m7-7H3"/>
    </svg>
`;

// =====================================================
// STATE RIWAYAT
// =====================================================

let snapshotRiwayatIzin = null;
let sedangMemuatRiwayat = false;
let sudahMemuatRiwayat = false;
let intervalRiwayatIzin = null;
let halamanIzinSudahDiinisialisasi = false;

// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, karakter => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[karakter]);
}

// =====================================================
// FORMAT JENIS DAN ALASAN
// =====================================================

function pisahkanJenisAlasan(value) {
    const teks = String(value ?? "");

    const jenisMatch = teks.match(/^Jenis:\s*(Izin|Sakit)\s*$/im);
    const alasanMatch = teks.match(/^Alasan:\s*([\s\S]*)/im);

    return {
        jenis: jenisMatch
            ? jenisMatch[1].toLowerCase()
            : "-",

        alasan: alasanMatch
            ? alasanMatch[1].trim()
            : teks.trim()
    };
}

function formatJenis(jenis) {
    const nilai = String(jenis || "").toLowerCase();

    if (nilai === "izin") return "Izin";
    if (nilai === "sakit") return "Sakit";

    return "-";
}

// =====================================================
// FORMAT TANGGAL DAN WAKTU
// =====================================================

function formatTanggal(tanggal) {
    if (!tanggal) return "-";

    const teks = String(tanggal).substring(0, 10);
    const bagian = teks.split("-");

    if (bagian.length !== 3) return escapeHTML(tanggal);

    return `${bagian[2]}-${bagian[1]}-${bagian[0]}`;
}

function formatWaktu(waktu) {
    if (!waktu) return "-";

    const teks = String(waktu).replace("T", " ");
    const bagian = teks.split(" ");

    if (bagian.length < 2) {
        return escapeHTML(teks);
    }

    return `${escapeHTML(formatTanggal(bagian[0]))} ${escapeHTML(bagian[1].substring(0, 8))}`;
}

// =====================================================
// PESAN FORM
// =====================================================

function tampilkanPesan(pesan, berhasil = false) {
    if (!pesanIzin) return;

    pesanIzin.textContent = pesan;

    pesanIzin.classList.remove(
        "hidden",
        "text-emerald-600",
        "text-rose-600"
    );

    pesanIzin.classList.add(
        berhasil ? "text-emerald-600" : "text-rose-600"
    );
}

// =====================================================
// STATUS BADGE
// =====================================================

function formatStatus(status) {
    const statusLower = String(status || "").toLowerCase();

    if (statusLower === "menunggu") {
        return {
            teks: "Menunggu",
            warna: "bg-amber-50 text-amber-600 border border-amber-200"
        };
    }

    if (statusLower === "disetujui") {
        return {
            teks: "Disetujui",
            warna: "bg-emerald-50 text-emerald-600 border border-emerald-200"
        };
    }

    if (statusLower === "ditolak") {
        return {
            teks: "Ditolak",
            warna: "bg-rose-50 text-rose-600 border border-rose-200"
        };
    }

    return {
        teks: status || "-",
        warna: "bg-slate-50 text-slate-500 border border-slate-200"
    };
}

// =====================================================
// RENDER RIWAYAT IZIN
// =====================================================

function renderRiwayatIzin(data) {
    if (!containerRiwayat) return;

    if (jumlahRiwayat) {
        jumlahRiwayat.textContent =
            `Menampilkan ${data.length} riwayat pengajuan.`;
    }

    if (data.length === 0) {
        containerRiwayat.innerHTML = `
            <tr>
                <td colspan="6" class="py-10 text-center">
                    <p class="text-sm font-semibold text-slate-500">
                        Belum ada riwayat izin
                    </p>
                    <p class="mt-1 text-xs text-slate-400">
                        Pengajuan yang kamu kirim akan muncul di sini.
                    </p>
                </td>
            </tr>
        `;
        return;
    }

    containerRiwayat.innerHTML = data.map(item => {
        const status = formatStatus(item.status);
        const detail = pisahkanJenisAlasan(item.alasan);

        const jenis = formatJenis(
            item.jenis_pengajuan || detail.jenis
        );

        const alasan = item.alasan_pengajuan || detail.alasan;

        const fileHTML = item.bukti_file
            ? `
                <a
                    href="${escapeHTML(BASE_URL + "/" + String(item.bukti_file).replace(/^\/+/, ""))}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-1.5 rounded-lg border border-rose-100 bg-rose-50/50 px-2.5 py-1 text-[11px] font-medium text-rose-600 hover:bg-rose-100 transition"
                >
                    Lihat Bukti
                </a>
            `
            : `
                <span class="text-[11px] text-slate-400 italic">
                    Tidak ada dokumen
                </span>
            `;

        return `
            <tr class="hover:bg-slate-50/60 transition-colors">

                <td class="py-4 pl-2 font-bold text-slate-800 align-top">
                    ${escapeHTML(formatTanggal(item.tanggal_izin))}
                </td>

                <td class="py-4 align-top max-w-[200px]">
                    <span class="inline-block mb-1 rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-bold text-indigo-600">
                        ${escapeHTML(jenis)}
                    </span>

                    <p class="text-xs text-slate-600 whitespace-normal break-words">
                        ${escapeHTML(alasan)}
                    </p>
                </td>

                <td class="py-4 align-top">
                    ${fileHTML}
                </td>

                <td class="py-4 align-top">
                    <span class="font-medium text-slate-700 block">
                        ${formatWaktu(item.waktu_pengajuan)}
                    </span>
                </td>

                <td class="py-4 align-top">
                    <span class="inline-block rounded-full px-3 py-1 text-[10px] font-bold ${status.warna}">
                        ● ${escapeHTML(status.teks)}
                    </span>
                </td>

                <td class="py-4 pr-2 align-top max-w-[220px]">
                    <p class="text-[11px] text-slate-500 leading-snug whitespace-normal break-words">
                        ${item.catatan_mentor
                            ? escapeHTML(item.catatan_mentor)
                            : "Belum ada catatan mentor."
                        }
                    </p>
                </td>

            </tr>
        `;
    }).join("");
}

// =====================================================
// LOAD RIWAYAT IZIN TANPA KEDUT-KEDUT
// =====================================================

async function loadRiwayatIzin() {
    if (!containerRiwayat || sedangMemuatRiwayat) return;

    sedangMemuatRiwayat = true;

    // Loading hanya ditampilkan saat pertama kali membuka halaman.
    // Polling berikutnya tidak mengubah tampilan tabel.
    if (!sudahMemuatRiwayat) {
        containerRiwayat.innerHTML = `
            <tr>
                <td colspan="6" class="py-8 text-center text-xs text-slate-400">
                    Memuat riwayat izin...
                </td>
            </tr>
        `;
    }

    try {
        const response = await fetch(API_RIWAYAT, {
            method: "GET",
            headers: getAuthHeaders(),
            cache: "no-store"
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message || "Gagal mengambil riwayat izin."
            );
        }

        const data = Array.isArray(result.data)
            ? result.data
            : [];

        // Bandingkan data baru dengan data sebelumnya.
        // Jika sama, tidak perlu render ulang tabel.
        const snapshotBaru = JSON.stringify(data);

        if (snapshotBaru !== snapshotRiwayatIzin) {
            snapshotRiwayatIzin = snapshotBaru;

            renderRiwayatIzin(data);
        } else if (jumlahRiwayat) {
            jumlahRiwayat.textContent =
                `Menampilkan ${data.length} riwayat pengajuan.`;
        }

        sudahMemuatRiwayat = true;

    } catch (error) {
        console.error("Error riwayat izin:", error);

        // Jangan menghapus data lama saat polling gagal.
        // Pesan error hanya ditampilkan jika pemuatan pertama gagal.
        if (!sudahMemuatRiwayat) {
            containerRiwayat.innerHTML = `
                <tr>
                    <td colspan="6" class="py-8 text-center text-xs text-rose-500">
                        ${escapeHTML(error.message)}
                    </td>
                </tr>
            `;

            if (jumlahRiwayat) {
                jumlahRiwayat.textContent = "Gagal memuat riwayat izin.";
            }
        }

    } finally {
        sedangMemuatRiwayat = false;
    }
}

// =====================================================
// POLLING RIWAYAT OTOMATIS
// =====================================================

function mulaiPollingRiwayat() {
    // Hindari interval ganda.
    if (intervalRiwayatIzin) {
        clearInterval(intervalRiwayatIzin);
    }

    intervalRiwayatIzin = setInterval(() => {
        if (!document.hidden) {
            loadRiwayatIzin();
        }
    }, 5000);
}

// =====================================================
// VALIDASI FORM
// =====================================================

function validasiForm(tanggal, jenis, alasan, file) {
    if (!tanggal || !jenis || !alasan) {
        return "Tanggal, jenis pengajuan, dan alasan wajib diisi.";
    }

    if (!["izin", "sakit"].includes(jenis)) {
        return "Pilih jenis pengajuan yang valid.";
    }

    if (alasan.length > 250) {
        return "Alasan maksimal 250 karakter.";
    }

    if (file && file.size > 5 * 1024 * 1024) {
        return "Ukuran file maksimal 5 MB.";
    }

    if (file) {
        const tipeDiizinkan = [
            "application/pdf",
            "image/jpeg",
            "image/png"
        ];

        if (!tipeDiizinkan.includes(file.type)) {
            return "Format bukti harus PDF, JPG, atau PNG.";
        }
    }

    return null;
}

// =====================================================
// SUBMIT PENGAJUAN IZIN
// =====================================================

async function submitPengajuanIzin(event) {
    event.preventDefault();

    if (!formIzin || !tombolAjukan) return;

    const tanggal = inputTanggal?.value;
    const jenis = inputJenis?.value;
    const alasan = inputAlasan?.value.trim() || "";
    const file = inputBukti?.files?.[0] || null;

    const pesanValidasi = validasiForm(
        tanggal,
        jenis,
        alasan,
        file
    );

    if (pesanValidasi) {
        tampilkanPesan(pesanValidasi);
        return;
    }

    const formData = new FormData();

    formData.append("tanggal_izin", tanggal);
    formData.append("jenis_pengajuan", jenis);
    formData.append("alasan", alasan);

    if (file) {
        formData.append("bukti_file", file);
    }

    tombolAjukan.disabled = true;
    tombolAjukan.textContent = "MENGIRIM...";

    try {
        const response = await fetch(API_PENGAJUAN, {
            method: "POST",
            headers: getAuthHeaders(),
            body: formData
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message || "Pengajuan gagal dikirim."
            );
        }

        tampilkanPesan(
            result.message || "Pengajuan berhasil dikirim.",
            true
        );

        formIzin.reset();

        if (namaFile) {
            namaFile.textContent = "Belum ada file dipilih";
        }

        if (jumlahKarakter) {
            jumlahKarakter.textContent = "0 / 250 KARAKTER";
        }

        // Paksa render karena ada pengajuan baru.
        snapshotRiwayatIzin = null;
        await loadRiwayatIzin();

    } catch (error) {
        console.error("Error pengajuan izin:", error);
        tampilkanPesan(error.message);

    } finally {
        tombolAjukan.disabled = false;
        tombolAjukan.innerHTML = TEKS_TOMBOL;
    }
}

// =====================================================
// INIT HALAMAN IZIN
// =====================================================

export function initIzin() {
    if (!formIzin) {
        console.error("Elemen form-izin tidak ditemukan.");
        return;
    }

    // Mencegah listener dan interval terpasang berkali-kali.
    if (halamanIzinSudahDiinisialisasi) {
        loadRiwayatIzin();
        return;
    }

    halamanIzinSudahDiinisialisasi = true;

    if (!inputJenis) {
        console.error(
            "Elemen jenis-pengajuan tidak ditemukan. Periksa HTML form izin."
        );
    }

    formIzin.addEventListener("submit", submitPengajuanIzin);

    if (inputAlasan && jumlahKarakter) {
        inputAlasan.addEventListener("input", () => {
            jumlahKarakter.textContent =
                `${inputAlasan.value.length} / 250 KARAKTER`;
        });
    }

    if (inputBukti && namaFile) {
        inputBukti.addEventListener("change", () => {
            namaFile.textContent = inputBukti.files.length
                ? inputBukti.files[0].name
                : "Belum ada file dipilih";
        });
    }

    // Ambil data pertama kali.
    loadRiwayatIzin();

    // Periksa perubahan status setiap 5 detik.
    mulaiPollingRiwayat();

    // Periksa ulang ketika siswa kembali ke tab halaman.
    window.addEventListener("focus", loadRiwayatIzin);

    document.addEventListener("visibilitychange", () => {
        if (!document.hidden) {
            loadRiwayatIzin();
        }
    });
}
