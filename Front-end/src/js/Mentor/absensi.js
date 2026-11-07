/* =========================================================
LOGIKA HALAMAN REKAP ABSENSI MENTOR
========================================================= */

const dataAbsensiSiswa = [
    {
        no: 1,
        nama: "Ahmad Fauzi",
        nis: "1234567801",
        sub: "Startup Tech",
        program: "Web Development",
        waktu: "07:48 WIB",
        statusAbsen: "Hadir",
        statusReport: "Diterima"
    },
    {
        no: 2,
        nama: "Siti Aisyah",
        nis: "1234567802",
        sub: "Creative Media",
        program: "Web Development",
        waktu: "07:55 WIB",
        statusAbsen: "Hadir",
        statusReport: "Diterima"
    },
    {
        no: 3,
        nama: "Budi Santoso",
        nis: "1234567803",
        sub: "AgriTech",
        program: "Web Development",
        waktu: "- (Surat Dokter)",
        statusAbsen: "Sakit",
        statusReport: "Ditolak"
    },
    {
        no: 4,
        nama: "Rina Febriani",
        nis: "1234567804",
        sub: "E-Commerce",
        program: "Web Development",
        waktu: "08:02 WIB",
        statusAbsen: "Hadir",
        statusReport: "Menunggu"
    },
    {
        no: 5,
        nama: "Andi Pratama",
        nis: "1234567805",
        sub: "IoT Solutions",
        program: "Web Development",
        waktu: "- (Izin Resmi)",
        statusAbsen: "Izin",
        statusReport: "Menunggu"
    }
];

export function initMentorAbsensi() {
    console.log("Modul Rekap Absensi Mentor berhasil dimuat.");

    const tableBody = document.getElementById("table-absensi-body");
    const searchInput = document.getElementById("input-search-absensi");
    const filterProgram = document.getElementById("filter-program");
    const btnTerapkan = document.getElementById("btn-terapkan-filter");
    const btnReset = document.getElementById("btn-reset-filter");

    // Fungsi render tabel absensi
    function renderTable(data) {
        if (!tableBody) return;

        if (data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="7" class="py-8 text-center text-slate-400">Tidak ada data absensi yang ditemukan.</td></tr>`;
            return;
        }

        tableBody.innerHTML = data.map(item => {
            // Badge Status Absensi
            let absenBadge = "";
            if (item.statusAbsen === "Hadir") {
                absenBadge = `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Hadir</span>`;
            } else if (item.statusAbsen === "Sakit") {
                absenBadge = `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-[11px] font-bold"><span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Sakit</span>`;
            } else if (item.statusAbsen === "Izin") {
                absenBadge = `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[11px] font-bold"><span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Izin</span>`;
            }

            // Badge Status Daily Report
            let reportBadge = "";
            if (item.statusReport === "Diterima") {
                reportBadge = `<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold">✓ Diterima</span>`;
            } else if (item.statusReport === "Ditolak") {
                reportBadge = `<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-[11px] font-bold">✕ Ditolak</span>`;
            } else if (item.statusReport === "Menunggu") {
                reportBadge = `<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[11px] font-bold">⏱ Menunggu</span>`;
            }

            return `
                <tr class="hover:bg-slate-50/80 transition">
                    <td class="py-4 px-6 font-semibold text-slate-400">${item.no}</td>
                    <td class="py-4 px-6">
                        <div>
                            <h4 class="font-bold text-slate-900">${item.nama}</h4>
                            <p class="text-[10px] text-slate-400 font-medium">NIS: ${item.nis} • ${item.sub}</p>
                        </div>
                    </td>
                    <td class="py-4 px-6">
                        <span class="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">${item.program}</span>
                    </td>
                    <td class="py-4 px-6 font-medium text-slate-600 text-xs">${item.waktu}</td>
                    <td class="py-4 px-6">${absenBadge}</td>
                    <td class="py-4 px-6">${reportBadge}</td>
                    <td class="py-4 px-6 text-center">
                        <button class="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold text-xs transition inline-flex items-center gap-1.5 shadow-sm">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            Lihat
                        </button>
                    </td>
                </tr>
            `;
        }).join("");
    }

    // Render data awal
    renderTable(dataAbsensiSiswa);

    // Fungsi Filter Pencarian & Program
    function applyFilters() {
        const keyword = (searchInput ? searchInput.value : "").toLowerCase();
        const progVal = (filterProgram ? filterProgram.value : "").toLowerCase();

        const filtered = dataAbsensiSiswa.filter(item => {
            const matchKeyword = item.nama.toLowerCase().includes(keyword) || item.nis.toLowerCase().includes(keyword);
            const matchProgram = progVal === "" || item.program.toLowerCase().includes(progVal);
            return matchKeyword && matchProgram;
        });

        renderTable(filtered);
    }

    if (searchInput) searchInput.addEventListener("input", applyFilters);
    if (filterProgram) filterProgram.addEventListener("change", applyFilters);
    if (btnTerapkan) btnTerapkan.addEventListener("click", applyFilters);

    if (btnReset) {
        btnReset.addEventListener("click", () => {
            if (searchInput) searchInput.value = "";
            if (filterProgram) filterProgram.value = "";
            renderTable(dataAbsensiSiswa);
        });
    }
}

// Inisialisasi otomatis saat skrip dimuat
document.addEventListener("DOMContentLoaded", () => {
    initMentorAbsensi();
});