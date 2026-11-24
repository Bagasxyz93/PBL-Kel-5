
const API_URL = "http://localhost:8000/api/siswa";

const API_PENGAJUAN = `${API_URL}/api_pengajuan_izin.php`;
const API_RIWAYAT = `${API_URL}/api_riwayat_izin.php`;

// =====================================================
// TOKEN AUTHENTICATION
// =====================================================

function getAuthHeaders() {
    const token = sessionStorage.getItem("authToken");

    if (!token) {
        throw new Error("Token login tidak ditemukan. Silakan login kembali.");
    }

    return {
        "Authorization": `Bearer ${token}`
    };
}

// =====================================================
// ELEMENT HTML
// =====================================================

const formIzin = document.getElementById("form-izin");
const containerRiwayat = document.getElementById("riwayat-izin-container");

const inputTanggal = document.getElementById("tanggal-izin");
const inputAlasan = document.getElementById("alasan-izin");
const inputBukti = document.getElementById("bukti-izin");

const namaFile = document.getElementById("nama-file-izin");
const pesanIzin = document.getElementById("pesan-izin");
const tombolAjukan = document.getElementById("btn-ajukan-izin");

const jumlahKarakter = document.getElementById("jumlah-karakter");
const jumlahRiwayat = document.getElementById("jumlah-riwayat");

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
// LOAD RIWAYAT IZIN
// =====================================================

async function loadRiwayatIzin() {

    if (!containerRiwayat) return;

    containerRiwayat.innerHTML = `
        <tr>
            <td colspan="6" class="py-8 text-center text-xs text-slate-400">
                Memuat riwayat izin...
            </td>
        </tr>
    `;

    try {

        const response = await fetch(API_RIWAYAT, {
            method: "GET",
            headers: getAuthHeaders()
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Gagal mengambil riwayat izin.");
        }

        const data = result.data || [];

        if (jumlahRiwayat) {
            jumlahRiwayat.textContent =
                `Menampilkan ${data.length} riwayat pengajuan izin.`;
        }

        if (data.length === 0) {

            containerRiwayat.innerHTML = `
                <tr>
                    <td colspan="6" class="py-10 text-center">
                        <p class="text-sm font-semibold text-slate-500">
                            Belum ada riwayat izin
                        </p>
                        <p class="mt-1 text-xs text-slate-400">
                            Pengajuan izin yang kamu kirim akan muncul di sini.
                        </p>
                    </td>
                </tr>
            `;

            return;
        }

        containerRiwayat.innerHTML = data.map(item => {

            const status = formatStatus(item.status);

            const fileHTML = item.bukti_file
                ? `
                    <a
                        href="http://localhost:8000/${encodeURI(item.bukti_file)}"
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
                        ${escapeHTML(item.tanggal_izin)}
                    </td>

                    <td class="py-4 align-top max-w-[200px]">
                        <p class="text-xs text-slate-600 whitespace-normal break-words">
                            ${escapeHTML(item.alasan)}
                        </p>
                    </td>

                    <td class="py-4 align-top">
                        ${fileHTML}
                    </td>

                    <td class="py-4 align-top">
                        <span class="font-medium text-slate-700 block">
                            ${escapeHTML(item.waktu_pengajuan)}
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

    } catch (error) {

        console.error("Error riwayat izin:", error);

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

}

// =====================================================
// SUBMIT PENGAJUAN IZIN
// =====================================================

async function submitPengajuanIzin(event) {

    event.preventDefault();

    const tanggal = inputTanggal.value;
    const alasan = inputAlasan.value.trim();
    const file = inputBukti.files[0];

    if (!tanggal || !alasan) {
        tampilkanPesan("Tanggal dan alasan wajib diisi.");
        return;
    }

    if (alasan.length > 250) {
        tampilkanPesan("Alasan maksimal 250 karakter.");
        return;
    }

    if (file && file.size > 5 * 1024 * 1024) {
        tampilkanPesan("Ukuran file maksimal 5 MB.");
        return;
    }

    const formData = new FormData();

    formData.append("tanggal_izin", tanggal);
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

        tampilkanPesan(result.message, true);

        formIzin.reset();

        if (namaFile) {
            namaFile.textContent = "Belum ada file dipilih";
        }

        if (jumlahKarakter) {
            jumlahKarakter.textContent = "0 / 250 KARAKTER";
        }

        await loadRiwayatIzin();

    } catch (error) {

        console.error("Error pengajuan izin:", error);

        tampilkanPesan(error.message);

    } finally {

        tombolAjukan.disabled = false;

        tombolAjukan.innerHTML = `
            AJUKAN IZIN

            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
            </svg>
        `;

    }

}

// =====================================================
// INIT HALAMAN IZIN
// =====================================================

export function initIzin() {

    if (formIzin) {
        formIzin.addEventListener("submit", submitPengajuanIzin);
    }

    // Hitung karakter alasan
    if (inputAlasan && jumlahKarakter) {

        inputAlasan.addEventListener("input", () => {
            jumlahKarakter.textContent =
                `${inputAlasan.value.length} / 250 KARAKTER`;
        });

    }

    // Tampilkan nama file
    if (inputBukti && namaFile) {

        inputBukti.addEventListener("change", () => {
            namaFile.textContent = inputBukti.files.length
                ? inputBukti.files[0].name
                : "Belum ada file dipilih";
        });

    }

    loadRiwayatIzin();

}
