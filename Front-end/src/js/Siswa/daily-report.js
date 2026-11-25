import { API_BASE_URL } from "../api-config.js";


const API_DAILY_REPORT = `${API_BASE_URL}/api/siswa/api_daily_report_siswa.php`;
const BASE_BACKEND_DAILY_REPORT = `${API_BASE_URL}/`;

let dataMateriDailyReport = [];
let dataRiwayatDailyReport = [];
let filterDailyReport = "semua";
let pencarianDailyReport = "";
let bulanFilterDailyReport = "";

// =====================================================
// HELPER
// =====================================================

function getTokenDailyReport() {
    return sessionStorage.getItem("authToken");
}

function headerDailyReport() {
    return {
        Authorization: `Bearer ${getTokenDailyReport()}`
    };
}

function escapeDailyReport(value) {
    return String(value ?? "").replace(/[&<>"']/g, karakter => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[karakter]));
}

function formatTanggalDailyReport(tanggal) {
    if (!tanggal) return "-";

    const date = new Date(`${String(tanggal).substring(0, 10)}T00:00:00`);

    if (isNaN(date.getTime())) return tanggal;

    return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
}

function formatWaktuDailyReport(tanggal) {
    if (!tanggal) return "";

    const date = new Date(tanggal);

    if (isNaN(date.getTime())) return "";

    return date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Jakarta"
    }) + " WIB";
}

function formatTanggalWaktuDailyReport(tanggal) {
    if (!tanggal) return "-";

    const date = new Date(tanggal);

    if (isNaN(date.getTime())) return "-";

    return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        timeZone: "Asia/Jakarta"
    }) + " • " + formatWaktuDailyReport(tanggal);
}

function statusDailyReport(status) {
    const statusLower = String(status || "").toLowerCase();

    if (statusLower === "diterima") {
        return {
            label: "DITERIMA",
            badge: "bg-emerald-50 text-emerald-600 border border-emerald-200",
            card: "border-emerald-100 bg-white",
            feedback: "bg-indigo-50/70"
        };
    }

    if (statusLower === "ditolak") {
        return {
            label: "PERLU REVISI",
            badge: "bg-rose-50 text-rose-600 border border-rose-200",
            card: "border-rose-100 bg-rose-50/30",
            feedback: "bg-rose-50/70"
        };
    }

    return {
        label: "MENUNGGU",
        badge: "bg-amber-50 text-amber-600 border border-amber-200",
        card: "border-amber-100 bg-amber-50/30",
        feedback: "bg-amber-50/70"
    };
}

function linkBuktiDailyReport(path) {
    if (!path) return null;

    const bersih = String(path).replace(/^\/+/, "");

    return BASE_BACKEND_DAILY_REPORT + bersih;
}

function hitungStatistikDailyReport() {
    const total = dataRiwayatDailyReport.length;

    const diterima = dataRiwayatDailyReport.filter(
        item => item.status === "diterima"
    ).length;

    const menunggu = dataRiwayatDailyReport.filter(
        item => item.status === "menunggu"
    ).length;

    const ditolak = dataRiwayatDailyReport.filter(
        item => item.status === "ditolak"
    ).length;

    return {
        total,
        diterima,
        menunggu,
        ditolak
    };
}

function hitungLaporanMingguIni() {
    // Ambil tanggal hari ini berdasarkan WIB
    const formatter = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Jakarta",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    });

    const tanggalHariIni = formatter.format(new Date());

    // Pecah tanggal WIB menjadi komponen tahun, bulan, hari
    const [tahun, bulan, hari] = tanggalHariIni
        .split("-")
        .map(Number);

    // Gunakan UTC agar perhitungan hari tidak terpengaruh timezone browser
    const tanggalSekarang = new Date(Date.UTC(tahun, bulan - 1, hari));

    // Cari hari dalam minggu (Minggu = 0, Senin = 1, dst.)
    const hariDalamMinggu = tanggalSekarang.getUTCDay();

    // Hitung selisih menuju Senin
    const selisihKeSenin = hariDalamMinggu === 0
        ? 6
        : hariDalamMinggu - 1;

    // Tentukan tanggal Senin minggu ini
    const senin = new Date(tanggalSekarang);

    senin.setUTCDate(
        senin.getUTCDate() - selisihKeSenin
    );

    // Tentukan tanggal Minggu minggu ini
    const minggu = new Date(senin);

    minggu.setUTCDate(
        minggu.getUTCDate() + 6
    );

    // Format menjadi YYYY-MM-DD agar perbandingan tanggal konsisten
    const formatTanggal = tanggal => {
        return tanggal.toISOString().slice(0, 10);
    };

    const tanggalAwal = formatTanggal(senin);
    const tanggalAkhir = formatTanggal(minggu);

    // Hitung seluruh laporan berdasarkan tanggal pelaksanaan
    return dataRiwayatDailyReport.filter(item => {
        if (!item.tanggal) return false;

        const tanggalLaporan = String(item.tanggal).substring(0, 10);

        return (
            tanggalLaporan >= tanggalAwal &&
            tanggalLaporan <= tanggalAkhir
        );
    }).length;
}

// =====================================================
// FETCH DATA
// =====================================================

async function fetchMateriDailyReport() {
    const response = await fetch(
        `${API_DAILY_REPORT}?aksi=materi`,
        {
            method: "GET",
            headers: headerDailyReport()
        }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
        throw new Error(result.message || "Gagal mengambil data materi.");
    }

    dataMateriDailyReport = result.data || [];
}

async function fetchRiwayatDailyReport() {
    const response = await fetch(
        `${API_DAILY_REPORT}?aksi=riwayat`,
        {
            method: "GET",
            headers: headerDailyReport()
        }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
        throw new Error(result.message || "Gagal mengambil riwayat laporan.");
    }

    dataRiwayatDailyReport = result.data || [];
}

// =====================================================
// RENDER STATISTIK
// =====================================================

function renderStatistikDailyReport() {
    const statistik = hitungStatistikDailyReport();

    return `
        <div class="grid grid-cols-2 gap-4 md:grid-cols-5">

            <div class="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <p class="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    TOTAL DILAPORKAN
                </p>

                <p class="mt-1 text-lg font-extrabold text-slate-800">
                    ${statistik.total}
                    <span class="text-xs font-normal text-slate-400">Laporan</span>
                </p>
            </div>

            <div class="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <p class="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    STATUS DITERIMA
                </p>

                <p class="mt-1 text-lg font-extrabold text-emerald-600">
                    ${statistik.diterima}
                    <span class="text-xs font-normal text-slate-400">Laporan</span>
                </p>
            </div>

            <div class="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <p class="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    MENUNGGU
                </p>

                <p class="mt-1 text-lg font-extrabold text-amber-500">
                    ${statistik.menunggu}
                    <span class="text-xs font-normal text-slate-400">Laporan</span>
                </p>
            </div>

            <div class="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <p class="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    PERLU REVISI
                </p>

                <p class="mt-1 text-lg font-extrabold text-rose-500">
                    ${statistik.ditolak}
                    <span class="text-xs font-normal text-slate-400">Laporan</span>
                </p>
            </div>

            <div class="col-span-2 md:col-span-1 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <p class="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    LAPORAN MINGGU INI
                </p>

                <p class="mt-1 text-lg font-extrabold text-indigo-600">
                    ${hitungLaporanMingguIni()}
                    <span class="text-xs font-normal text-slate-400">Laporan</span>
                </p>
            </div>

        </div>
    `;
}

// =====================================================
// RENDER CARD RIWAYAT
// =====================================================

function renderCardDailyReport(item, nomor = null, lengkap = false) {
    const status = statusDailyReport(item.status);

    const feedback = item.catatan_mentor;

    const fileURL = linkBuktiDailyReport(item.bukti_file);

    const mentorNama = item.nama_mentor || "Menunggu Verifikasi Mentor";

    const tanggal = formatTanggalDailyReport(item.tanggal);

    const waktuSubmit = formatWaktuDailyReport(item.created_at);

    const judulMateri = item.judul_materi || "Materi";

    return `
        <article class="rounded-2xl border ${status.card} p-5 shadow-sm">

            <div class="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">

                <div class="flex flex-wrap items-center gap-3">

                    ${nomor !== null ? `
                        <span class="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-extrabold text-indigo-600">
                            #${nomor}
                        </span>
                    ` : ""}

                    <span class="text-xs font-bold text-slate-800">
                        ${escapeDailyReport(tanggal)}
                    </span>

                    ${waktuSubmit ? `
                        <span class="text-xs text-slate-400">
                            ${escapeDailyReport(waktuSubmit)}
                        </span>
                    ` : ""}

                </div>

                <span class="rounded-full px-3 py-1 text-[10px] font-bold ${status.badge}">
                    ● ${status.label}
                </span>

            </div>

            <div class="py-4 space-y-3">

                <div>
                    <p class="text-[10px] font-bold uppercase tracking-wider text-indigo-500 mb-1">
                        MATERI
                    </p>

                    <p class="text-xs font-semibold text-slate-600">
                        ${escapeDailyReport(judulMateri)}
                    </p>
                </div>

                <div>
                    <h3 class="text-sm font-extrabold text-slate-800">
                        ${escapeDailyReport(item.judul)}
                    </h3>

                    <p class="mt-2 text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                        ${escapeDailyReport(item.isi_laporan)}
                    </p>
                </div>

                ${item.link_bukti ? `
                    <div>
                        <p class="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            LINK TAMBAHAN
                        </p>

                        <a
                            href="${escapeDailyReport(item.link_bukti)}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-xs text-indigo-600 underline break-all"
                        >
                            ${escapeDailyReport(item.link_bukti)}
                        </a>
                    </div>
                ` : ""}

                ${fileURL ? `
                    <div>
                        <p class="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            LAMPIRAN BUKTI
                        </p>

                        <div class="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3">

                            <div class="flex items-center gap-3 min-w-0">

                                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                                    📎
                                </div>

                                <div class="min-w-0">
                                    <p class="text-xs font-bold text-slate-800">
                                        Bukti pekerjaan
                                    </p>

                                    <p class="text-[10px] text-slate-400">
                                        File lampiran
                                    </p>
                                </div>

                            </div>

                            <a
                                href="${escapeDailyReport(fileURL)}"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-indigo-600 hover:bg-slate-50 shadow-sm shrink-0"
                            >
                                Lihat
                            </a>

                        </div>
                    </div>
                ` : ""}

            </div>

                        ${feedback && String(feedback).trim() !== "" ? `
                            <div class="rounded-xl ${status.feedback} p-3.5 mt-2">

                                <div class="flex items-start gap-3">

                                    <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                                        M
                                    </span>

                                    <div class="min-w-0">

                                        <p class="text-xs font-bold text-slate-800">
                                            ${escapeDailyReport(mentorNama)}
                                        </p>

                                        <p class="mt-1 text-[11px] text-slate-600 leading-relaxed whitespace-pre-line">
                                            ${escapeDailyReport(feedback)}
                                        </p>

                                    </div>

                                </div>

                            </div>
                        ` : ""}

        </article>
    `;
}

// =====================================================
// RENDER RIWAYAT SINGKAT
// =====================================================

function renderRiwayatSingkatDailyReport() {
    const container = document.getElementById("riwayat-singkat-container");

    if (!container) return;

    const data = [...dataRiwayatDailyReport]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 4);

    if (data.length === 0) {
        container.innerHTML = `
            <div class="rounded-xl border border-dashed border-slate-200 p-6 text-center">
                <p class="text-xs font-semibold text-slate-500">
                    Belum ada laporan harian.
                </p>

                <p class="mt-1 text-[10px] text-slate-400">
                    Laporan yang dikirim akan muncul di sini.
                </p>
            </div>
        `;

        return;
    }

    container.innerHTML = data.map(item => {
        const status = statusDailyReport(item.status);

        return `
            <div class="rounded-xl border ${status.card} p-3.5 transition-all hover:border-slate-200">

                <div class="flex items-center justify-between gap-2">

                    <span class="text-[10px] font-semibold text-slate-400">
                        ${escapeDailyReport(formatTanggalWaktuDailyReport(item.created_at))}
                    </span>

                    <span class="rounded-full px-2.5 py-0.5 text-[9px] font-bold ${status.badge}">
                        ${status.label}
                    </span>

                </div>

                <h3 class="mt-1 text-xs font-bold text-slate-800">
                    ${escapeDailyReport(item.judul)}
                </h3>

                <p class="mt-1 text-[10px] text-indigo-500">
                    ${escapeDailyReport(item.judul_materi || "Materi")}
                </p>

                ${item.catatan_mentor ? `
                    <div class="mt-2.5 rounded-lg ${status.feedback} p-2">

                        <p class="text-[10px] font-bold text-slate-800">
                            Feedback Mentor
                        </p>

                        <p class="mt-1 text-[10px] text-slate-600 leading-snug">
                            ${escapeDailyReport(item.catatan_mentor)}
                        </p>

                    </div>
                ` : item.status === "menunggu" ? `
                    <div class="mt-2.5 flex items-center justify-between rounded-lg bg-amber-50/80 p-2 text-[10px] text-amber-700">
                        <span>Menunggu verifikasi mentor</span>
                        <span>⏳</span>
                    </div>
                ` : ""}

            </div>
        `;
    }).join("");
}

// =====================================================
// RENDER SEMUA RIWAYAT
// =====================================================



function renderSemuaRiwayatView() {
    const mainContainer = document.getElementById("main-content-area");

    if (!mainContainer) return;

    const waktuWIB = new Date().toLocaleDateString("en-CA", {
        timeZone: "Asia/Jakarta",
        year: "numeric",
        month: "2-digit"
    });

    bulanFilterDailyReport = waktuWIB;

    filterDailyReport = "semua";
    pencarianDailyReport = "";

    mainContainer.innerHTML = `
        <div class="space-y-6">

            <div class="flex flex-wrap items-center justify-between gap-4">

                <div>
                    <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        <span>INKUBASI SISWA</span>
                        <span>•</span>
                        <span>DAILY REPORT</span>
                        <span>•</span>
                        <span class="text-indigo-600">SEMUA RIWAYAT</span>
                    </div>

                    <h1 class="mt-1 text-2xl font-bold tracking-tight text-slate-800">
                        Riwayat Laporan Harian
                    </h1>

                    <p class="mt-1 text-xs text-slate-400">
                        Arsip laporan harian berdasarkan bulan pelaksanaan.
                    </p>
                </div>

                <button
                    id="btn-kembali-form"
                    type="button"
                    class="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition"
                >
                    ← Kembali ke Form
                </button>

            </div>

            <!-- ARSIP BULANAN -->
            <div class="relative overflow-hidden rounded-2xl border border-indigo-100 bg-white shadow-sm">

                <div
                    class="absolute inset-x-0 top-0 h-1"
                    style="background: linear-gradient(90deg, #5865ff, #8050ff);"
                ></div>

                <div class="p-5 md:p-6">

                    <div class="flex flex-wrap items-start justify-between gap-4">

                        <div class="flex items-center gap-3">

                            <div
                                class="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="1.8"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <rect x="3" y="4" width="18" height="17" rx="2"/>
                                    <path d="M16 2v4"/>
                                    <path d="M8 2v4"/>
                                    <path d="M3 10h18"/>
                                    <path d="M8 14h2"/>
                                    <path d="M14 14h2"/>
                                    <path d="M8 17h2"/>
                                </svg>
                            </div>

                            <div>
                                <h2 class="text-sm font-extrabold text-slate-800">
                                    Arsip Bulanan
                                </h2>

                                <p class="mt-1 text-xs text-slate-400">
                                    Telusuri laporan berdasarkan periode.
                                </p>
                            </div>

                        </div>

                        <span
                            class="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[10px] font-bold text-indigo-600"
                        >
                            <span class="mr-1">●</span>
                            ARSIP DAILY REPORT
                        </span>

                    </div>

                    <div class="mt-5 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">

                        <div class="flex flex-wrap items-center justify-between gap-4">

                            <div class="flex items-center gap-3">

                                <button
                                    id="btn-bulan-sebelumnya"
                                    type="button"
                                    class="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                                    title="Bulan sebelumnya"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    >
                                        <path d="m15 18-6-6 6-6"/>
                                    </svg>
                                </button>

                                <div class="min-w-[190px]">

                                    <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        PERIODE TERPILIH
                                    </p>

                                    <h3
                                        id="label-periode-daily-report"
                                        class="mt-1 text-base font-extrabold text-indigo-600"
                                    ></h3>

                                </div>

                                <button
                                    id="btn-bulan-berikutnya"
                                    type="button"
                                    class="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                                    title="Bulan berikutnya"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    >
                                        <path d="m9 18 6-6-6-6"/>
                                    </svg>
                                </button>

                            </div>

                            <button
                                id="btn-bulan-sekarang"
                                type="button"
                                class="rounded-xl border border-indigo-100 bg-white px-4 py-2.5 text-xs font-bold text-indigo-600 shadow-sm transition hover:bg-indigo-50"
                            >
                                ↻ Bulan Sekarang
                            </button>

                        </div>

                        <div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">

                            <div>

                                <label
                                    for="select-bulan-daily-report"
                                    class="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500"
                                >
                                    BULAN
                                </label>

                                <select
                                    id="select-bulan-daily-report"
                                    class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                >
                                    <option value="01">Januari</option>
                                    <option value="02">Februari</option>
                                    <option value="03">Maret</option>
                                    <option value="04">April</option>
                                    <option value="05">Mei</option>
                                    <option value="06">Juni</option>
                                    <option value="07">Juli</option>
                                    <option value="08">Agustus</option>
                                    <option value="09">September</option>
                                    <option value="10">Oktober</option>
                                    <option value="11">November</option>
                                    <option value="12">Desember</option>
                                </select>

                            </div>

                            <div>

                                <label
                                    for="select-tahun-daily-report"
                                    class="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500"
                                >
                                    TAHUN
                                </label>

                                <select
                                    id="select-tahun-daily-report"
                                    class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                >
                                </select>

                            </div>

                        </div>

                        <div class="mt-4 flex items-center gap-2">

                            <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <circle cx="12" cy="12" r="10"/>
                                    <path d="M12 16v-4"/>
                                    <path d="M12 8h.01"/>
                                </svg>
                            </div>

                            <p class="text-[10px] font-medium text-slate-500">
                                Laporan tersimpan tetap tersedia pada arsip bulan lainnya.
                            </p>

                        </div>

                    </div>

                </div>

            </div>

            <div id="statistik-arsip-daily-report"></div>

            <div class="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">

                <div class="relative flex-1 min-w-[240px]">

                    <input
                        id="input-cari-riwayat-daily-report"
                        type="text"
                        placeholder="Cari judul laporan atau materi..."
                        class="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-4 text-xs font-medium text-slate-700 outline-none focus:border-indigo-400 focus:bg-white transition"
                    />

                </div>

                <div
                    id="filter-status-arsip-daily-report"
                    class="flex flex-wrap items-center gap-2"
                ></div>

            </div>

            <div
                id="semua-riwayat-daily-report-container"
                class="space-y-4"
            ></div>

        </div>
    `;

    const selectBulan = document.getElementById(
        "select-bulan-daily-report"
    );

    const selectTahun = document.getElementById(
        "select-tahun-daily-report"
    );

    const [tahun, bulan] = bulanFilterDailyReport.split("-");

    selectBulan.value = bulan;

    // Pilihan tahun: 5 tahun sebelum dan 5 tahun sesudah tahun sekarang,
    // tetap memasukkan tahun arsip yang sedang dipilih.
    const tahunSekarang = Number(
        new Date().toLocaleDateString("en-CA", {
            timeZone: "Asia/Jakarta",
            year: "numeric"
        })
    );

    const tahunTerpilih = Number(tahun);

    const tahunAwal = Math.min(
        tahunSekarang - 5,
        tahunTerpilih
    );

    const tahunAkhir = Math.max(
        tahunSekarang + 5,
        tahunTerpilih
    );

    const daftarTahun = [];

    for (let t = tahunAkhir; t >= tahunAwal; t--) {
        daftarTahun.push(t);
    }

    selectTahun.innerHTML = daftarTahun.map(t => `
        <option value="${t}">${t}</option>
    `).join("");

    selectTahun.value = tahun;

    function updatePeriode() {
        bulanFilterDailyReport =
            `${selectTahun.value}-${selectBulan.value}`;

        const tanggalPeriode = new Date(
            Number(selectTahun.value),
            Number(selectBulan.value) - 1,
            1
        );

        document.getElementById(
            "label-periode-daily-report"
        ).textContent = tanggalPeriode.toLocaleDateString("id-ID", {
            month: "long",
            year: "numeric"
        });

        filterDailyReport = "semua";

        renderDaftarSemuaRiwayatDailyReport();
    }

    document.getElementById("btn-kembali-form")
        .addEventListener("click", () => {
            initDailyReport();
        });

    selectBulan.addEventListener("change", updatePeriode);

    selectTahun.addEventListener("change", updatePeriode);

    document.getElementById("btn-bulan-sebelumnya")
        .addEventListener("click", () => {

            let [t, b] = bulanFilterDailyReport.split("-").map(Number);

            b--;

            if (b < 1) {
                b = 12;
                t--;
            }

            selectBulan.value = String(b).padStart(2, "0");

            if (!Array.from(selectTahun.options).some(o => o.value == t)) {
                selectTahun.add(new Option(t, t));
            }

            selectTahun.value = t;

            updatePeriode();
        });

    document.getElementById("btn-bulan-berikutnya")
        .addEventListener("click", () => {

            let [t, b] = bulanFilterDailyReport.split("-").map(Number);

            b++;

            if (b > 12) {
                b = 1;
                t++;
            }

            selectBulan.value = String(b).padStart(2, "0");

            if (!Array.from(selectTahun.options).some(o => o.value == t)) {
                selectTahun.add(new Option(t, t));
            }

            selectTahun.value = t;

            updatePeriode();
        });

    document.getElementById("btn-bulan-sekarang")
        .addEventListener("click", () => {

            const sekarang = new Date().toLocaleDateString("en-CA", {
                timeZone: "Asia/Jakarta",
                year: "numeric",
                month: "2-digit"
            });

            const [t, b] = sekarang.split("-");

            selectBulan.value = b;

            if (!Array.from(selectTahun.options).some(o => o.value == t)) {
                selectTahun.add(new Option(t, t));
            }

            selectTahun.value = t;

            updatePeriode();
        });

    document.getElementById("filter-status-arsip-daily-report")
        .addEventListener("click", event => {

            const button = event.target.closest(
                ".btn-filter-daily-report"
            );

            if (!button) return;

            filterDailyReport = button.dataset.filter;

            renderDaftarSemuaRiwayatDailyReport();
        });

    document.getElementById("input-cari-riwayat-daily-report")
        .addEventListener("input", event => {

            pencarianDailyReport = event.target.value
                .toLowerCase()
                .trim();

            renderDaftarSemuaRiwayatDailyReport();
        });

    updatePeriode();
}



function renderDaftarSemuaRiwayatDailyReport() {
    const container = document.getElementById(
        "semua-riwayat-daily-report-container"
    );

    if (!container) return;

    // Data berdasarkan bulan dan tahun terpilih
    let dataBulanan = [...dataRiwayatDailyReport].filter(item => {

        if (!item.tanggal || !bulanFilterDailyReport) return false;

        return String(item.tanggal).substring(0, 7) === bulanFilterDailyReport;
    });

    const total = dataBulanan.length;

    const diterima = dataBulanan.filter(
        item => item.status === "diterima"
    ).length;

    const menunggu = dataBulanan.filter(
        item => item.status === "menunggu"
    ).length;

    const ditolak = dataBulanan.filter(
        item => item.status === "ditolak"
    ).length;

    const statistikContainer = document.getElementById(
        "statistik-arsip-daily-report"
    );

    if (statistikContainer) {
        statistikContainer.innerHTML = `
            <div class="grid grid-cols-2 gap-4 md:grid-cols-4">

                <div class="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                    <p class="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                        TOTAL LAPORAN
                    </p>

                    <p class="mt-1 text-lg font-extrabold text-slate-800">
                        ${total}
                        <span class="text-xs font-normal text-slate-400">Laporan</span>
                    </p>
                </div>

                <div class="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                    <p class="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                        DITERIMA
                    </p>

                    <p class="mt-1 text-lg font-extrabold text-emerald-600">
                        ${diterima}
                        <span class="text-xs font-normal text-slate-400">Laporan</span>
                    </p>
                </div>

                <div class="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                    <p class="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                        MENUNGGU
                    </p>

                    <p class="mt-1 text-lg font-extrabold text-amber-500">
                        ${menunggu}
                        <span class="text-xs font-normal text-slate-400">Laporan</span>
                    </p>
                </div>

                <div class="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                    <p class="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                        PERLU REVISI
                    </p>

                    <p class="mt-1 text-lg font-extrabold text-rose-500">
                        ${ditolak}
                        <span class="text-xs font-normal text-slate-400">Laporan</span>
                    </p>
                </div>

            </div>
        `;
    }

    // Filter status
    const filterContainer = document.getElementById(
        "filter-status-arsip-daily-report"
    );

    if (filterContainer) {

        const daftarFilter = [
            {
                key: "semua",
                label: `Semua (${total})`
            },
            {
                key: "diterima",
                label: `Diterima (${diterima})`
            },
            {
                key: "menunggu",
                label: `Menunggu (${menunggu})`
            },
            {
                key: "ditolak",
                label: `Revisi (${ditolak})`
            }
        ];

        filterContainer.innerHTML = daftarFilter.map(item => `
            <button
                data-filter="${item.key}"
                class="btn-filter-daily-report rounded-xl ${
                    filterDailyReport === item.key
                        ? "bg-indigo-600 px-3 py-2 text-xs font-bold text-white shadow-sm"
                        : "border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                }"
            >
                ${item.label}
            </button>
        `).join("");
    }

    // Filter status
    let data = [...dataBulanan];

    if (filterDailyReport !== "semua") {
        data = data.filter(item => item.status === filterDailyReport);
    }

    // Filter pencarian
    if (pencarianDailyReport) {
        data = data.filter(item => {

            const judul = String(item.judul || "").toLowerCase();

            const materi = String(item.judul_materi || "").toLowerCase();

            const isi = String(item.isi_laporan || "").toLowerCase();

            return (
                judul.includes(pencarianDailyReport) ||
                materi.includes(pencarianDailyReport) ||
                isi.includes(pencarianDailyReport)
            );
        });
    }

    // Urutkan laporan terbaru
    data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // Empty state
    if (data.length === 0) {

        container.innerHTML = `
            <div class="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">

                <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="26"
                        height="26"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <rect x="3" y="4" width="18" height="17" rx="2"/>
                        <path d="M16 2v4"/>
                        <path d="M8 2v4"/>
                        <path d="M3 10h18"/>
                    </svg>

                </div>

                <p class="mt-4 text-sm font-bold text-slate-700">
                    ${
                        dataBulanan.length === 0
                            ? "Belum ada laporan pada periode ini."
                            : "Tidak ada laporan ditemukan."
                    }
                </p>

                <p class="mt-2 text-xs text-slate-400">
                    ${
                        dataBulanan.length === 0
                            ? "Pilih bulan atau tahun lainnya untuk melihat arsip."
                            : "Coba ubah filter status atau kata pencarian."
                    }
                </p>

            </div>
        `;

        return;
    }

    // Render laporan
    container.innerHTML = data.map((item, index) => {
        return renderCardDailyReport(item, index + 1, true);
    }).join("");
}

// =====================================================
// RENDER FORM DAILY REPORT
// =====================================================

function renderFormDailyReport() {
    const mainContainer = document.getElementById("main-content-area");

    if (!mainContainer) return;

    const statistik = hitungStatistikDailyReport();

    const tanggalHariIni = new Date().toLocaleDateString("en-CA", {
        timeZone: "Asia/Jakarta"
    });

    mainContainer.innerHTML = `
        <div class="space-y-6">

            <div class="mb-6 flex flex-wrap items-center justify-between gap-4">

                <div>

                    <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        <span>INKUBASI SISWA</span>
                        <span>•</span>
                        <span class="text-indigo-600">DAILY REPORT PAGE</span>
                    </div>

                    <div class="mt-1 flex items-center gap-3 flex-wrap">

                        <h1 class="text-2xl font-bold tracking-tight text-slate-800">
                            Form &amp; Riwayat Laporan Harian
                        </h1>

                        <span class="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[10px] font-bold text-indigo-600">
                            DAILY REPORT
                        </span>

                    </div>

                </div>

                <div class="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">

                    <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        📅
                    </div>

                    <div>
                        <p class="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                            TOTAL DILAPORKAN
                        </p>

                        <p class="text-lg font-extrabold text-slate-800">
                            ${statistik.total} Laporan
                        </p>
                    </div>

                </div>

            </div>

            ${renderStatistikDailyReport()}

            <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">

                <div class="lg:col-span-7">

                    <article class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">

                        <div class="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">

                            <div class="flex items-center gap-3">

                                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-white shadow-md shadow-indigo-500/20">
                                    📝
                                </div>

                                <div>

                                    <div class="flex items-center gap-1.5">

                                        <h2 class="text-sm font-bold text-slate-800">
                                            DAILY REPORT
                                        </h2>

                                        <span class="h-2 w-2 rounded-full bg-emerald-400"></span>

                                    </div>

                                    <p class="text-[11px] text-slate-400">
                                        Dokumentasikan progres kegiatan inkubasi harian Anda
                                    </p>

                                </div>

                            </div>

                        </div>

                        <form id="form-daily-report" class="space-y-5">

                            <div>

                                <label class="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                    TANGGAL PELAKSANAAN <span class="text-rose-500">*</span>
                                </label>

                                <input
                                    id="tanggal-daily-report"
                                    type="date"
                                    value="${tanggalHariIni}"
                                    max="${tanggalHariIni}"
                                    required
                                    class="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs font-semibold text-slate-700 outline-none focus:border-indigo-400 focus:bg-white"
                                />

                            </div>

                            <div>

                                <label class="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                    MATERI PEMBELAJARAN <span class="text-rose-500">*</span>
                                </label>

                                <select
                                    id="materi-daily-report"
                                    required
                                    class="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs font-semibold text-slate-700 outline-none focus:border-indigo-400 focus:bg-white"
                                >

                                    <option value="">
                                        -- Pilih materi --
                                    </option>

                                    ${dataMateriDailyReport.map(item => `
                                        <option value="${item.id}">
                                            ${escapeDailyReport(item.judul)} - ${escapeDailyReport(item.nama_program)}
                                        </option>
                                    `).join("")}

                                </select>

                            </div>

                            <div>

                                <label class="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                    KEGIATAN UTAMA <span class="text-rose-500">*</span>
                                </label>

                                <input
                                    id="judul-daily-report"
                                    type="text"
                                    maxlength="150"
                                    placeholder="Contoh: Implementasi REST API & State Management"
                                    required
                                    class="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs font-semibold text-slate-700 outline-none focus:border-indigo-400 focus:bg-white"
                                />

                            </div>

                            <div>

                                <label class="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                    YANG DIDAPATKAN / HASIL <span class="text-rose-500">*</span>
                                </label>

                                <textarea
                                    id="isi-daily-report"
                                    rows="4"
                                    minlength="30"
                                    required
                                    placeholder="Jelaskan kegiatan yang dilakukan, hasil yang didapatkan, kendala, atau hal yang dipelajari..."
                                    class="w-full resize-y rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs font-medium text-slate-700 outline-none focus:border-indigo-400 focus:bg-white"
                                ></textarea>

                                <p class="mt-1 text-[10px] text-slate-400">
                                    Minimal 30 karakter.
                                </p>

                            </div>

                            <div>

                                <label class="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                    UPLOAD DOKUMEN / BUKTI PEKERJAAN <span class="text-rose-500">*</span>
                                </label>

                                <div class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/20 p-6 text-center">

                                    <p class="text-xs font-bold text-slate-700">

                                        Tarik file bukti ke sini atau klik

                                        <label class="cursor-pointer text-indigo-600 underline">

                                            PILIH FILE

                                            <input
                                                id="file-daily-report"
                                                type="file"
                                                name="bukti_pekerjaan"
                                                accept=".png,.jpg,.jpeg,.pdf,.zip"
                                                required
                                                class="hidden"
                                            />

                                        </label>

                                    </p>

                                    <p class="mt-1 text-[10px] text-slate-400">
                                        PNG, JPG, PDF, atau ZIP (Maks. 10MB)
                                    </p>

                                    <p
                                        id="nama-file-daily-report"
                                        class="mt-3 text-xs font-semibold text-indigo-600"
                                    ></p>

                                </div>

                            </div>

                            <div
                                id="pesan-daily-report"
                                class="hidden rounded-xl p-3 text-xs font-semibold"
                            ></div>

                            <button
                                id="btn-submit-daily-report"
                                type="submit"
                                class="flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:opacity-95"
                                style="background: linear-gradient(135deg, #5865ff 0%, #8050ff 100%) !important;"
                            >
                                KIRIM DAILY REPORT
                            </button>

                        </form>

                    </article>

                </div>

                <div class="space-y-6 lg:col-span-5">

                    <article class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">

                        <div class="mb-5 flex items-center justify-between">

                            <div>
                                <h2 class="text-sm font-bold text-slate-800">
                                    RIWAYAT
                                </h2>

                                <p class="text-[10px] text-slate-400">
                                    4 laporan terbaru
                                </p>
                            </div>

                            <span class="rounded-lg bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-600">
                                ${statistik.total} Laporan
                            </span>

                        </div>

                        <div
                            id="riwayat-singkat-container"
                            class="space-y-3.5 mb-5"
                        ></div>

                        <button
                            id="btn-lihat-semua"
                            type="button"
                            class="w-full rounded-xl bg-slate-50 py-2.5 text-center text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                        >
                            LIHAT SEMUA RIWAYAT (${statistik.total} LAPORAN) →
                        </button>

                    </article>

                    <article
                        class="rounded-2xl p-6 text-white shadow-lg shadow-indigo-500/20"
                        style="background: linear-gradient(135deg, #5865ff 0%, #8050ff 100%) !important;"
                    >

                        <div class="mb-4 flex items-center justify-between">

                            <div class="flex items-center gap-2">

                                <span class="h-2 w-2 rounded-full bg-emerald-400"></span>

                                <span class="text-[10px] font-bold uppercase tracking-wider text-indigo-100">
                                    PROGRES LAPORAN
                                </span>

                            </div>

                        </div>

                        <div class="flex items-baseline gap-2">

                            <span class="text-4xl font-extrabold tracking-tight text-white">
                                ${hitungLaporanMingguIni()}
                            </span>

                            <span class="text-xs text-indigo-100">
                                Laporan minggu ini
                            </span>

                        </div>

                        <p class="mt-4 text-[11px] leading-relaxed text-indigo-100">
                            Dokumentasikan kegiatan inkubasi secara konsisten dan periksa feedback mentor pada riwayat laporan.
                        </p>

                    </article>

                </div>

            </div>

        </div>
    `;

    renderRiwayatSingkatDailyReport();

    // ---------------------------------------------
    // TOMBOL SEMUA RIWAYAT
    // ---------------------------------------------

    const btnLihatSemua = document.getElementById("btn-lihat-semua");

    if (btnLihatSemua) {
        btnLihatSemua.addEventListener("click", () => {
            renderSemuaRiwayatView();
        });
    }

    // ---------------------------------------------
    // FILE SELECT
    // ---------------------------------------------

    const inputFile = document.getElementById("file-daily-report");

    if (inputFile) {
        inputFile.addEventListener("change", () => {

            const file = inputFile.files[0];

            const namaFile = document.getElementById("nama-file-daily-report");

            if (!namaFile) return;

            namaFile.textContent = file
                ? `📎 ${file.name}`
                : "";
        });
    }

    // ---------------------------------------------
    // FORM SUBMIT
    // ---------------------------------------------

    const form = document.getElementById("form-daily-report");

    form.addEventListener("submit", async event => {

        event.preventDefault();

        const tombol = document.getElementById("btn-submit-daily-report");

        const pesan = document.getElementById("pesan-daily-report");

        const file = inputFile.files[0];

        if (!file) {
            tampilkanPesanDailyReport(
                pesan,
                "Silakan pilih bukti pekerjaan.",
                false
            );

            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            tampilkanPesanDailyReport(
                pesan,
                "Ukuran file maksimal 10 MB.",
                false
            );

            return;
        }

        tombol.disabled = true;

        tombol.textContent = "MENGIRIM LAPORAN...";

        tombol.classList.add("opacity-60", "cursor-not-allowed");

        try {

            const formData = new FormData();

            formData.append(
                "tanggal",
                document.getElementById("tanggal-daily-report").value
            );

            formData.append(
                "materi_id",
                document.getElementById("materi-daily-report").value
            );

            formData.append(
                "judul",
                document.getElementById("judul-daily-report").value.trim()
            );

            formData.append(
                "isi_laporan",
                document.getElementById("isi-daily-report").value.trim()
            );

            formData.append(
                "bukti_pekerjaan",
                file
            );

            const response = await fetch(API_DAILY_REPORT, {
                method: "POST",
                headers: headerDailyReport(),
                body: formData
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Gagal mengirim laporan.");
            }

            tampilkanPesanDailyReport(
                pesan,
                result.message || "Daily Report berhasil dikirim.",
                true
            );

            form.reset();

            document.getElementById("tanggal-daily-report").value = tanggalHariIni;

            document.getElementById("nama-file-daily-report").textContent = "";

            await fetchRiwayatDailyReport();

            renderFormDailyReport();

            const pesanBaru = document.getElementById("pesan-daily-report");

            tampilkanPesanDailyReport(
                pesanBaru,
                result.message || "Daily Report berhasil dikirim.",
                true
            );

        } catch (error) {

            tampilkanPesanDailyReport(
                pesan,
                error.message || "Terjadi kesalahan saat mengirim laporan.",
                false
            );

        } finally {

            if (document.getElementById("btn-submit-daily-report")) {

                const tombolBaru = document.getElementById("btn-submit-daily-report");

                tombolBaru.disabled = false;

                tombolBaru.textContent = "KIRIM DAILY REPORT";

                tombolBaru.classList.remove("opacity-60", "cursor-not-allowed");
            }
        }
    });
}

function tampilkanPesanDailyReport(container, pesan, sukses) {
    if (!container) return;

    container.classList.remove("hidden");

    container.className = sukses
        ? "rounded-xl p-3 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100"
        : "rounded-xl p-3 text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-100";

    container.textContent = pesan;
}

// =====================================================
// INIT
// =====================================================

export async function initDailyReport() {
    const mainContainer = document.getElementById("main-content-area");

    if (!mainContainer) return;

    mainContainer.innerHTML = `
        <div class="flex items-center justify-center min-h-[300px]">
            <div class="text-center">
                <div class="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto"></div>
                <p class="mt-4 text-xs font-semibold text-slate-500">
                    Memuat Daily Report...
                </p>
            </div>
        </div>
    `;

    try {

        await Promise.all([
            fetchMateriDailyReport(),
            fetchRiwayatDailyReport()
        ]);

        renderFormDailyReport();

    } catch (error) {

        mainContainer.innerHTML = `
            <div class="rounded-2xl border border-rose-100 bg-rose-50 p-6">

                <h2 class="text-sm font-bold text-rose-600">
                    Gagal Memuat Daily Report
                </h2>

                <p class="mt-2 text-xs text-rose-500">
                    ${escapeDailyReport(error.message)}
                </p>

                <button
                    id="btn-retry-daily-report"
                    class="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white"
                >
                    Coba Lagi
                </button>

            </div>
        `;

        document.getElementById("btn-retry-daily-report")
            ?.addEventListener("click", initDailyReport);
    }
}
