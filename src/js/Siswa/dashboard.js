// Data Statistik dengan info perubahan bulanan
const statistikSiswa = [
    {
        judul: "KEHADIRAN",
        nilai: "100%",
        keterangan: "↑ +1% dari bulan lalu",
        tipeKeterangan: "up",
        simbol: "K",
        warna: "blue"
    },
    {
        judul: "IZIN",
        nilai: "2",
        keterangan: "2 Diterima",
        tipeKeterangan: "info",
        simbol: "I",
        warna: "amber"
    },
    {
        judul: "DAILY REPORT",
        nilai: "8/10",
        keterangan: "↑ -2 Dari bulan lalu",
        tipeKeterangan: "purple",
        simbol: "D",
        warna: "emerald"
    },
    {
        judul: "MATERI",
        nilai: "5",
        keterangan: "+ 1 Materi ditambahkan",
        tipeKeterangan: "orange",
        simbol: "M",
        warna: "violet"
    }
];

const aktivitasSiswa = [
    {
        judul: "Mengirimkan Daily Report Modul 3",
        deskripsi: "Implementasi Component Responsive Tailwind",
        waktu: "Hari ini",
        jam: "16:45 WIB",
        status: "Terkirim",
        warna: "blue"
    },
    {
        judul: "Absensi Masuk SI-IN",
        deskripsi: "Tap RFID Gedung Lab Komputer",
        waktu: "Hari ini",
        jam: "07:15 WIB",
        status: "Hadir",
        warna: "emerald"
    },
    {
        judul: "Menyelesaikan Materi REST API",
        deskripsi: "Bab 4: Arsitektur Client & Server",
        waktu: "Kemarin",
        jam: "14:20 WIB",
        status: "Selesai",
        warna: "violet"
    },
    {
        judul: "Review Mentor Disetujui",
        deskripsi: "Evaluasi Sprint 2 oleh Bpk. Rendi",
        waktu: "Kemarin",
        jam: "11:00 WIB",
        status: "Disetujui",
        warna: "blue"
    }
];

const jadwalSiswa = [
    {
        waktu: "08:00 - 11:30",
        judul: "Praktikum Frontend Web Dev",
        lokasi: "Lab Komputer 02 • Unit Inkubasi",
        status: "Selesai",
        statusClass: "bg-emerald-50 text-emerald-600",
        bgClass: "bg-slate-50/80 border-slate-100"
    },
    {
        waktu: "13:00 - 14:30",
        judul: "Mentoring & Standup Harian",
        lokasi: "Mentor: Bpk. Rendi (Ruang Briefing)",
        status: "Sedang Jalan",
        statusClass: "bg-indigo-50 text-indigo-600 font-semibold",
        bgClass: "bg-[#f5f6ff] border-indigo-100"
    },
    {
        waktu: "16:30 - 17:00",
        judul: "Upload Daily Report & Checkout",
        lokasi: "Portal SI-IN SMK Asy-Syadzili",
        status: "Mendatang",
        statusClass: "bg-slate-100 text-slate-500",
        bgClass: "bg-slate-50/80 border-slate-100"
    }
];

function renderStatistik() {
    const container = document.getElementById("statistik-container");
    if (!container) return;

    container.innerHTML = statistikSiswa.map((item) => {
        let textKeteranganClass = "text-slate-400";
        if (item.tipeKeterangan === "up") textKeteranganClass = "text-emerald-500 font-medium";
        if (item.tipeKeterangan === "info") textKeteranganClass = "text-blue-500 font-medium";
        if (item.tipeKeterangan === "purple") textKeteranganClass = "text-indigo-500 font-medium";
        if (item.tipeKeterangan === "orange") textKeteranganClass = "text-amber-600 font-medium";

        return `
            <article class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <p class="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                    ${item.judul}
                </p>

                <p class="mt-3 text-3xl font-extrabold tracking-tight text-slate-800">
                    ${item.nilai}
                </p>

                <p class="mt-2 text-[11px] ${textKeteranganClass}">
                    ${item.keterangan}
                </p>
            </article>
        `;
    }).join("");
}

function renderAktivitas() {
    const container = document.getElementById("aktivitas-container");
    if (!container) return;

    container.innerHTML = aktivitasSiswa.map((item) => {
        let iconBg = "bg-blue-50 text-blue-500";
        if (item.warna === "emerald") iconBg = "bg-emerald-50 text-emerald-500";
        if (item.warna === "violet") iconBg = "bg-violet-50 text-violet-500";

        return `
            <article class="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg}">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                </div>

                <div class="min-w-0 flex-1">
                    <div class="flex items-start justify-between gap-2">
                        <h3 class="text-xs font-bold text-slate-800">
                            ${item.judul}
                        </h3>
                        <div class="text-right shrink-0">
                            <span class="block text-[11px] font-medium text-slate-400">${item.waktu}</span>
                            <span class="block text-[10px] text-slate-300">${item.jam}</span>
                        </div>
                    </div>

                    <p class="mt-0.5 text-xs text-slate-400">
                        ${item.deskripsi}
                    </p>
                </div>
            </article>
        `;
    }).join("");
}

function renderJadwal() {
    const container = document.getElementById("jadwal-container");
    const jumlahJadwal = document.getElementById("jumlah-jadwal");
    if (!container) return;

    container.innerHTML = jadwalSiswa.map((item) => `
        <article class="flex items-center justify-between gap-4 rounded-xl border ${item.bgClass} p-4 transition-all">
            <div class="flex items-center gap-3.5 min-w-0">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500 text-white shadow-md shadow-indigo-500/20">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                </div>

                <div class="min-w-0">
                    <h3 class="text-xs font-bold text-slate-800 truncate">
                        ${item.judul}
                    </h3>
                    <p class="mt-0.5 flex items-center gap-1 text-[11px] text-slate-400 truncate">
                        <svg class="h-3 w-3 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        </svg>
                        ${item.lokasi}
                    </p>
                </div>
            </div>

            <div class="text-right shrink-0">
                <p class="text-xs font-bold text-indigo-600">${item.waktu}</p>
                <span class="mt-1 inline-block rounded-md px-2 py-0.5 text-[10px] ${item.statusClass}">
                    ${item.status}
                </span>
            </div>
        </article>
    `).join("");

    if (jumlahJadwal) {
        jumlahJadwal.textContent = `${jadwalSiswa.length} Sesi Terjadwal`;
    }
}

function renderTanggal() {
    const tanggal = document.getElementById("tanggal-hari-ini");
    if (!tanggal) return;

    tanggal.textContent = "Selasa, 14 Mei 2024";
}

function renderSapaan() {
    const sapaan = document.getElementById("sapaan-siswa");
    if (!sapaan) return;

    const namaSiswa = "Nezaruriancta";
    sapaan.textContent = `Halo , ${namaSiswa}!`;
}

export function initDashboard() {
    renderStatistik();
    renderAktivitas();
    renderJadwal();
    renderTanggal();
    renderSapaan();
}