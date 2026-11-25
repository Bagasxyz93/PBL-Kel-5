import { API_BASE_URL } from "../api-config.js";


/* =========================================================
    LOGIKA HALAMAN ABSENSI SISWA
========================================================= */

const API_URL = `${API_BASE_URL}/api/siswa/api_absensi.php`;

/* =========================================================
    FORMAT TANGGAL
========================================================= */

function formatTanggal(tanggal) {
    if (!tanggal || tanggal === "-") return "-";

    // Jika tanggal format YYYY-MM-DD
    const match = String(tanggal).match(/^(\d{4})-(\d{2})-(\d{2})/);

    if (match) {
        return `${match[3]}/${match[2]}/${match[1]}`;
    }

    return tanggal;
}

/* =========================================================
    FORMAT JAM
========================================================= */

function formatJam(jam) {
    if (!jam || jam === "-") return "-";

    return String(jam).substring(0, 5).replace(":", ".");
}

/* =========================================================
    BADGE STATUS
========================================================= */

function getStatusStyle(status) {
    const statusNormal = String(status || "").toUpperCase();

    switch (statusNormal) {
        case "HADIR":
            return "bg-emerald-500 text-white";

        case "IZIN":
            return "bg-amber-400 text-white";

        case "SAKIT":
            return "bg-sky-500 text-white";

        case "ALPHA":
        case "TIDAK HADIR":
            return "bg-rose-500 text-white";

        case "BELUM ABSEN":
        case "BELUM_ABSEN":
            return "bg-slate-100 text-slate-500";

        default:
            return "bg-slate-100 text-slate-500";
    }
}

/* =========================================================
    RENDER STATUS ABSEN HARI INI
========================================================= */

function renderStatusHariIni(data) {
    const badge = document.getElementById("status-absen-badge");

    if (!badge) return;

    const status = data?.status || "BELUM ABSEN";
    const statusNormal = String(status).toUpperCase();

    let icon = "";

    if (statusNormal === "HADIR") {
        icon = `
            <svg class="h-4 w-4" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round"
                    stroke-width="2.5" d="M5 13l4 4L19 7"/>
            </svg>
        `;
    } else if (statusNormal === "IZIN" || statusNormal === "SAKIT") {
        icon = `
            <svg class="h-4 w-4" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round"
                    stroke-width="2" d="M12 8v4m0 4h.01M10.29 3.86
                L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3
                L13.71 3.86a2 2 0 00-3.42 0z"/>
            </svg>
        `;
    } else {
        icon = `
            <svg class="h-4 w-4" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round"
                    stroke-width="2" d="M12 8v4m0 4h.01"/>
            </svg>
        `;
    }

    badge.className = `
        inline-flex items-center gap-1.5 rounded-full px-4 py-1.5
        text-xs font-bold shadow-sm ${getStatusStyle(statusNormal)}
    `;

    badge.innerHTML = `${icon}${statusNormal.replace("_", " ")}`;
}

/* =========================================================
    RENDER DETAIL ABSEN HARI INI
========================================================= */

function renderDetailHariIni(data) {
    const program = document.getElementById("program-absen-hari-ini");
    const tanggal = document.getElementById("tanggal-absen-hari-ini");
    const mentor = document.getElementById("mentor-absen-hari-ini");
    const jam = document.getElementById("jam-absen-hari-ini");

    if (program) {
        program.textContent = data?.program || "-";
    }

    if (tanggal) {
        tanggal.textContent = formatTanggal(data?.tanggal);
    }

    // Tampilkan mentor bernomor
    if (mentor) {
        const daftarMentor = String(data?.mentor || "-")
            .split("|")
            .map(nama => nama.trim())
            .filter(nama => nama !== "");
    
        mentor.innerHTML = daftarMentor.length > 0
            ? daftarMentor.map((nama, index) => `
                <div class="mb-1">
                    ${index + 1}. ${nama}
                </div>
            `).join("")
            : "-";
    }

    if (jam) {
        const jamMasuk = formatJam(data?.jam_masuk);
        const jamKeluar = formatJam(data?.jam_keluar);

        if (jamMasuk === "-" && jamKeluar === "-") {
            jam.textContent = "-";
        } else {
            jam.textContent = `${jamMasuk} – ${jamKeluar} WIB`;
        }
    }

    renderStatusHariIni(data);
}

/* =========================================================
    RENDER RIWAYAT ABSEN
========================================================= */

function renderRiwayatAbsen(data) {
    const container = document.getElementById("riwayat-absen-container");

    if (!container) return;

    if (!Array.isArray(data) || data.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="5" class="py-10 text-center">
                    <div class="flex flex-col items-center gap-2">
                        <svg class="w-10 h-10 text-slate-300"
                            fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                stroke-width="1.5"
                                d="M8 7V3m8 4V3M4 11h16M5 5h14a1 1
                                0 011 1v14H4V6a1 1 0 011-1z"/>
                        </svg>

                        <p class="text-sm font-semibold text-slate-400">
                            Belum ada riwayat absensi
                        </p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    container.innerHTML = data.map((item) => {
        const status = String(item.status || "-").toUpperCase();

        return `
            <tr>
                <td class="py-4 pl-2 font-bold text-slate-800">
                    ${item.nama || "-"}
                </td>

                <td class="py-4 font-semibold text-slate-600">
                    ${formatTanggal(item.tanggal)}
                </td>

                <td class="py-4 font-semibold text-slate-600">
                    ${formatJam(item.jam_masuk)}
                </td>

                <td class="py-4 font-semibold text-slate-600">
                    ${formatJam(item.jam_keluar)}
                </td>

                <td class="py-4 text-right pr-2">
                    <span class="inline-block rounded-full px-4 py-1
                        text-[10px] font-bold ${getStatusStyle(status)}">
                        ${status.replace("_", " ")}
                    </span>
                </td>
            </tr>
        `;
    }).join("");
}

/* =========================================================
    LOADING / ERROR RIWAYAT
========================================================= */

function renderError(message) {
    const container = document.getElementById("riwayat-absen-container");

    if (container) {
        container.innerHTML = `
            <tr>
                <td colspan="5" class="py-10 text-center">
                    <div class="flex flex-col items-center gap-2">
                        <svg class="w-10 h-10 text-rose-300"
                            fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 9v4m0 4h.01M10.29 3.86
                                L1.82 18a2 2 0 001.71 3
                                h16.94a2 2 0 001.71-3
                                L13.71 3.86a2 2 0 00-3.42 0z"/>
                        </svg>

                        <p class="text-sm font-semibold text-rose-400">
                            ${message}
                        </p>
                    </div>
                </td>
            </tr>
        `;
    }
}

/* =========================================================
    AMBIL DATA API
========================================================= */

async function ambilDataAbsensi() {
    const token = sessionStorage.getItem("authToken");

    if (!token) {
        renderError("Sesi login tidak ditemukan. Silakan login kembali.");
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        });

        const hasil = await response.json();

        if (!response.ok || !hasil.success) {
            throw new Error(
                hasil.message || "Gagal mengambil data absensi."
            );
        }

        const data = hasil.data || {};

        // Detail sesi hari ini
        renderDetailHariIni(data.hari_ini || {});

        // Riwayat absensi
        renderRiwayatAbsen(data.riwayat || []);

    } catch (error) {
        console.error("Error absensi siswa:", error);

        renderError(
            error.message || "Gagal memuat data absensi."
        );
    }
}

/* =========================================================
    INIT HALAMAN ABSENSI
========================================================= */

export function initAbsensi() {
    console.log("Modul Absensi Siswa berhasil dimuat.");

    ambilDataAbsensi();
}
