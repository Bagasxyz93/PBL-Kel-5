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
        statusReport: "Diterima",
        initials: "AF",
        avatarBg: "bg-[#2864ed]"
    },
    {
        no: 2,
        nama: "Siti Aisyah",
        nis: "1234567802",
        sub: "Creative Media",
        program: "Web Development",
        waktu: "07:55 WIB",
        statusAbsen: "Hadir",
        statusReport: "Diterima",
        initials: "SA",
        avatarBg: "bg-[#00b09b]"
    },
    {
        no: 3,
        nama: "Budi Santoso",
        nis: "1234567803",
        sub: "AgriTech",
        program: "Web Development",
        waktu: "- (Surat Dokter)",
        statusAbsen: "Sakit",
        statusReport: "Ditolak",
        initials: "BS",
        avatarBg: "bg-rose-500"
    },
    {
        no: 4,
        nama: "Rina Febriani",
        nis: "1234567804",
        sub: "E-Commerce",
        program: "Web Development",
        waktu: "08:02 WIB",
        statusAbsen: "Hadir",
        statusReport: "Menunggu",
        initials: "RF",
        avatarBg: "bg-purple-600"
    },
    {
        no: 5,
        nama: "Andi Pratama",
        nis: "1234567805",
        sub: "IoT Solutions",
        program: "Web Development",
        waktu: "- (Izin Resmi)",
        statusAbsen: "Izin",
        statusReport: "Menunggu",
        initials: "AP",
        avatarBg: "bg-blue-600"
    }
];

export function initMentorAbsensi() {
    console.log("Modul Rekap Absensi Mentor berhasil dimuat.");

    const tableBody = document.getElementById("table-absensi-body");
    const searchInput = document.getElementById("input-search-absensi");
    const filterProgram = document.getElementById("filter-program");
    const btnReset = document.getElementById("btn-reset-filter");

    // Fungsi render tabel absensi
    function renderTable(data) {
        if (!tableBody) return;

        if (data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="7" class="py-6 text-center text-slate-400">Tidak ada data absensi yang ditemukan.</td></tr>`;
            return;
        }

        tableBody.innerHTML = data.map(item => {
            // Badge Status Absensi
            let absenBadge = "";
            if (item.statusAbsen === "Hadir") {
                absenBadge = `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-semibold"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Hadir</span>`;
            } else if (item.statusAbsen === "Sakit") {
                absenBadge = `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-[11px] font-semibold"><span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Sakit</span>`;
            } else if (item.statusAbsen === "Izin") {
                absenBadge = `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[11px] font-semibold"><span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Izin</span>`;
            }

            // Badge Status Daily Report
            let reportBadge = "";
            if (item.statusReport === "Diterima") {
                reportBadge = `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold">✓ Diterima</span>`;
            } else if (item.statusReport === "Ditolak") {
                reportBadge = `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 text-[10px] font-bold">✕ Ditolak</span>`;
            } else if (item.statusReport === "Menunggu") {
                reportBadge = `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold">⏱ Menunggu</span>`;
            }

            return `
                <tr class="hover:bg-slate-50/80 transition">
                    <td class="py-4 px-6 font-semibold text-slate-500">${item.no}</td>
                    <td class="py-4 px-6">
                        <div class="flex items-center gap-3">
                            <div class="h-9 w-9 rounded-full ${item.avatarBg} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                                ${item.initials}
                            </div>
                            <div>
                                <h4 class="font-bold text-slate-900">${item.nama}</h4>
                                <p class="text-[10px] text-slate-400">NIS: ${item.nis} • ${item.sub}</p>
                            </div>
                        </div>
                    </td>
                    <td class="py-4 px-6">
                        <span class="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium">${item.program}</span>
                    </td>
                    <td class="py-4 px-6 font-medium text-slate-600 text-xs">${item.waktu}</td>
                    <td class="py-4 px-6">${absenBadge}</td>
                    <td class="py-4 px-6">${reportBadge}</td>
                    <td class="py-4 px-6 text-center">
                        <button class="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold text-xs transition inline-flex items-center gap-1">
                            Lihat
                        </button>
                    </td>
                </tr>
            `;
        }).join("");
    }

    // Render awal
    renderTable(dataAbsensiSiswa);

    // Fungsi Filter Pencarian & Dropdown
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

    if (btnReset) {
        btnReset.addEventListener("click", () => {
            if (searchInput) searchInput.value = "";
            if (filterProgram) filterProgram.value = "";
            renderTable(dataAbsensiSiswa);
        });
    }
}