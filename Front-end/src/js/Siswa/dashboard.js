
import { API_BASE_URL } from "../api-config.js";

const API_URL = `${API_BASE_URL}/api/siswa/api_dashboard.php`;
const API_MATERI_URL = `${API_BASE_URL}/api/siswa/api_materi_siswa.php`;

function getAuthHeaders() {
    const token = sessionStorage.getItem("authToken");

    if (!token) {
        throw new Error("Token login tidak ditemukan.");
    }

    return {
        Authorization: `Bearer ${token}`
    };
}

// =========================================================
// HELPER ESCAPE HTML
// =========================================================

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => {
        const map = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return map[char];
    });
}

// =========================================================
// HELPER TANGGAL WIB
// =========================================================

function tanggalHariIniWIB() {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Jakarta",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).format(new Date());
}

function tanggalMateriWIB(value) {
    if (!value) return null;

    // Jika format tanggal SQL atau ISO memiliki tanggal di awal.
    // Untuk date-only, tanggal tidak perlu dikonversi zona waktu.
    if (/^\d{4}-\d{2}-\d{2}$/.test(String(value))) {
        return String(value);
    }

    const date = new Date(value);

    if (isNaN(date.getTime())) return null;

    return new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Jakarta",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).format(date);
}

function formatTanggalMateri(value) {
    if (!value) return "Hari ini";

    let date;

    if (/^\d{4}-\d{2}-\d{2}$/.test(String(value))) {
        date = new Date(`${value}T00:00:00+07:00`);
    } else {
        date = new Date(value);
    }

    if (isNaN(date.getTime())) return "Hari ini";

    return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        timeZone: "Asia/Jakarta"
    });
}

// =========================================================
// STATISTIK DASHBOARD
// =========================================================

function renderStatistik(data) {
    const container = document.getElementById("statistik-container");
    if (!container) return;

    const statistikSiswa = [
        {
            judul: "KEHADIRAN",
            nilai: `${data.kehadiran}%`,
            keterangan: `${data.total_hadir} dari ${data.total_absensi} absensi`,
            warna: "blue"
        },
        {
            judul: "IZIN",
            nilai: data.total_izin,
            keterangan: `${data.izin_disetujui} Disetujui`,
            warna: "amber"
        },
        {
            judul: "DAILY REPORT",
            nilai: data.total_report,
            keterangan: `${data.report_diterima} Diterima`,
            warna: "emerald"
        },
        {
            judul: "MATERI",
            nilai: data.total_materi,
            keterangan: "Materi program tersedia",
            warna: "violet"
        }
    ];

    container.className =
        "grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4";

    container.innerHTML = statistikSiswa.map((item) => {
        let textClass = "text-slate-400";

        if (item.warna === "blue") textClass = "text-blue-500 font-medium";
        if (item.warna === "amber") textClass = "text-amber-600 font-medium";
        if (item.warna === "emerald") textClass = "text-emerald-500 font-medium";
        if (item.warna === "violet") textClass = "text-indigo-500 font-medium";

        return `
            <article class="min-w-0 rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">

                <p class="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    ${escapeHTML(item.judul)}
                </p>

                <p class="mt-2 text-2xl font-extrabold tracking-tight text-slate-800">
                    ${escapeHTML(item.nilai)}
                </p>

                <p class="mt-1.5 text-[10px] ${textClass}">
                    ${escapeHTML(item.keterangan)}
                </p>

            </article>
        `;
    }).join("");
}

// =========================================================
// AKTIVITAS TERBARU
// =========================================================

function renderAktivitas(data) {
    const container = document.getElementById("aktivitas-container");
    if (!container) return;

    if (!data || data.length === 0) {
        container.innerHTML = `
            <div class="py-6 text-center">
                <p class="text-xs text-slate-400">
                    Belum ada aktivitas terbaru.
                </p>
            </div>
        `;
        return;
    }

    container.innerHTML = data.map((item) => {
        let iconBg = "bg-blue-50 text-blue-500";

        if (item.jenis === "absensi") {
            iconBg = "bg-emerald-50 text-emerald-500";
        }

        if (item.jenis === "materi") {
            iconBg = "bg-violet-50 text-violet-500";
        }

        if (item.jenis === "izin") {
            iconBg = "bg-amber-50 text-amber-500";
        }

        if (item.jenis === "dailyreport") {
            iconBg = "bg-blue-50 text-blue-500";
        }

        return `
            <article class="flex items-start gap-3 py-3 first:pt-0 last:pb-0">

                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconBg}">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 017-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                </div>

                <div class="min-w-0 flex-1">
                    <div class="flex items-start justify-between gap-2">

                        <h3 class="text-xs font-bold text-slate-800">
                            ${escapeHTML(item.judul)}
                        </h3>

                        <div class="shrink-0 text-right">
                            <span class="block text-[10px] font-medium text-slate-400">
                                ${escapeHTML(item.waktu)}
                            </span>

                            <span class="block text-[9px] text-slate-300">
                                ${escapeHTML(item.jam)}
                            </span>
                        </div>

                    </div>

                    <p class="mt-1 text-[11px] leading-relaxed text-slate-400">
                        ${escapeHTML(item.deskripsi)}
                    </p>
                </div>

            </article>
        `;
    }).join("");
}

// =========================================================
// SAPAAN SISWA
// =========================================================

function renderSapaan(nama) {
    const sapaan = document.getElementById("sapaan-siswa");
    if (!sapaan) return;

    sapaan.innerHTML = `
        <div class="relative overflow-hidden rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-100/50">

            <div class="absolute left-0 top-0 h-full w-1.5 bg-indigo-600"></div>

            <div class="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div class="pl-2">

                    <span class="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-[9px] font-bold tracking-wide text-indigo-600">

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-3 w-3"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path d="M12 3l1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3z"/>
                        </svg>

                        PORTAL PESERTA SI-IN
                    </span>

                    <h1 class="mt-3 text-lg font-extrabold tracking-tight text-slate-800 md:text-xl">
                        Halo, ${escapeHTML(nama)}!
                    </h1>

                    <p class="mt-1.5 max-w-2xl text-xs leading-relaxed text-slate-500 md:text-sm">
                        Selamat datang di dashboard pembelajaranmu.
                        Pantau perkembangan, selesaikan kegiatan, dan
                        terus tingkatkan kemampuanmu selama program inkubasi.
                    </p>

                </div>

                <div class="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 sm:flex">

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-6 w-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.7"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path d="M12 3l2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3z"/>
                    </svg>

                </div>

            </div>

        </div>
    `;
}

// =========================================================
// MATERI TERBARU HARI INI
// =========================================================

function renderMateriTerbaru(daftarMateri) {
    const container = document.getElementById("materi-terbaru-container");
    if (!container) return;

    if (!Array.isArray(daftarMateri) || daftarMateri.length === 0) {
        container.innerHTML = `
            <div class="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-6 text-center">

                <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-400">

                    <svg xmlns="http://www.w3.org/2000/svg"
                        class="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            stroke-width="1.8"
                            d="M12 7v10m-5-5h10M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"/>
                    </svg>

                </div>

                <p class="mt-3 text-sm font-semibold text-slate-600">
                    Belum ada materi hari ini
                </p>

                <p class="mt-1 text-xs leading-relaxed text-slate-400">
                    Materi baru dari mentor akan muncul di sini ketika tersedia.
                </p>

            </div>
        `;
        return;
    }

    container.innerHTML = daftarMateri.map((item, index) => {
        const judul = item.judul || item.nama_materi || "Materi pembelajaran";
        const tanggal = item.tanggal_publikasi || item.created_at || item.tanggal;

        return `
            <article class="flex items-center gap-4 rounded-2xl border border-slate-100 p-4 transition hover:border-indigo-100 hover:bg-slate-50">

                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="h-5 w-5"
                    >
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                        <path d="M14 2v6h6"/>
                        <path d="M8 13h8"/>
                        <path d="M8 17h5"/>
                    </svg>

                </div>

                <div class="min-w-0 flex-1">

                    <h3 class="truncate text-sm font-bold text-slate-700">
                        ${escapeHTML(judul)}
                    </h3>

                    <p class="mt-1 text-xs text-slate-400">
                        Materi pembelajaran • ${escapeHTML(formatTanggalMateri(tanggal))}
                    </p>

                </div>

                ${index === 0 ? `
                    <span class="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">
                        Terbaru
                    </span>
                ` : ""}

            </article>
        `;
    }).join("");
}

// =========================================================
// FETCH MATERI SISWA
// =========================================================

async function fetchMateriTerbaru() {
    const container = document.getElementById("materi-terbaru-container");
    if (!container) return;

    try {
        const response = await fetch(API_MATERI_URL, {
            method: "GET",
            headers: getAuthHeaders()
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Gagal mengambil data materi.");
        }

        // Menyesuaikan kemungkinan bentuk data API
        let daftarMateri = [];

        if (Array.isArray(result.data)) {
            daftarMateri = result.data;
        } else if (Array.isArray(result.data?.materi)) {
            daftarMateri = result.data.materi;
        } else if (Array.isArray(result.materi)) {
            daftarMateri = result.materi;
        }

        // Filter materi yang tanggal publikasinya hari ini (WIB)
        const hariIni = tanggalHariIniWIB();

        const materiHariIni = daftarMateri.filter((item) => {
            const tanggal =
                item.tanggal_publikasi ||
                item.created_at ||
                item.tanggal;

            return tanggalMateriWIB(tanggal) === hariIni;
        });

        // Urutkan materi terbaru dan tampilkan maksimal 3
        materiHariIni.sort((a, b) => {
            const tanggalA = new Date(
                a.tanggal_publikasi || a.created_at || a.tanggal || 0
            ).getTime();

            const tanggalB = new Date(
                b.tanggal_publikasi || b.created_at || b.tanggal || 0
            ).getTime();

            return tanggalB - tanggalA;
        });

        renderMateriTerbaru(materiHariIni.slice(0, 3));

    } catch (error) {
        console.error("Gagal mengambil materi terbaru:", error);

        container.innerHTML = `
            <div class="rounded-2xl border border-red-100 bg-red-50 p-5 text-center">

                <p class="text-xs font-medium text-red-500">
                    Gagal memuat materi terbaru.
                </p>

                <p class="mt-1 text-[10px] text-red-400">
                    Silakan muat ulang halaman.
                </p>

            </div>
        `;
    }
}

// =========================================================
// MENGAMBIL DATA DASHBOARD
// =========================================================

async function fetchDashboard() {
    const containerStatistik = document.getElementById("statistik-container");
    const containerAktivitas = document.getElementById("aktivitas-container");

    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: getAuthHeaders()
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Gagal mengambil data dashboard.");
        }

        renderSapaan(result.data.nama);
        renderStatistik(result.data.statistik);
        renderAktivitas(result.data.aktivitas);

    } catch (error) {
        console.error("Gagal memuat dashboard siswa:", error);

        if (containerStatistik) {
            containerStatistik.innerHTML = `
                <div class="col-span-full rounded-xl bg-red-50 p-4 text-sm text-red-500">
                    Gagal memuat statistik dashboard.
                </div>
            `;
        }

        if (containerAktivitas) {
            containerAktivitas.innerHTML = `
                <div class="py-5 text-center text-xs text-red-400">
                    Gagal memuat aktivitas terbaru.
                </div>
            `;
        }
    }
}

// =========================================================
// INIT DASHBOARD
// =========================================================

export function initDashboard() {
    fetchDashboard();
    fetchMateriTerbaru();
}
