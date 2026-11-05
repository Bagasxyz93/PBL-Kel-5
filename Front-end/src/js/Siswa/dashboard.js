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

function renderSapaan() {
    const sapaan = document.getElementById("sapaan-siswa");
    if (!sapaan) return;

    const namaSiswa = "Nerazuriancta";
    sapaan.textContent = `Halo, ${namaSiswa}!`;
}

export function initDashboard() {
    renderStatistik();
    renderAktivitas();
    renderSapaan();
}