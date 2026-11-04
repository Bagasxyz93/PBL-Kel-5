/* =========================================================
LOGIKA HALAMAN KELOLA DAILY REPORT MENTOR
========================================================= */

const dataDailyReports = [
    {
        no: 1,
        nama: "Ahmad Fauzi",
        nis: "1234567801",
        program: "Web Development",
        waktu: "17:15 WIB<br><span class='text-[10px] text-slate-400 font-normal'>17 Okt 2026</span>",
        judul: "Mengerjakan rancangan prototype dan alur checkout",
        deskripsi: "Modul katalog sudah selesai, kendala integrasi gateway...",
        lampiran: "1 File",
        lampiranIcon: "file",
        status: "Menunggu",
        initials: "AF",
        avatarBg: "bg-[#2864ed]"
    },
    {
        no: 2,
        nama: "Siti Aisyah",
        nis: "1234567802",
        program: "Web Development",
        waktu: "16:40 WIB<br><span class='text-[10px] text-slate-400 font-normal'>17 Okt 2026</span>",
        judul: "Riset 15 Pelanggan Potensial (Customer Validation)",
        deskripsi: "Telah melakukan wawancara langsung ke 10 mahasiswa...",
        lampiran: "Sheet",
        lampiranIcon: "sheet",
        status: "Diterima",
        initials: "SA",
        avatarBg: "bg-[#00b09b]"
    },
    {
        no: 3,
        nama: "Budi Santoso",
        nis: "1234567803",
        program: "Web Development",
        waktu: "15:10 WIB<br><span class='text-[10px] text-slate-400 font-normal'>17 Okt 2026</span>",
        judul: "Konfigurasi Database Postgres & API Authentication",
        deskripsi: "Terdapat error koneksi SSL pool pada Supabase...",
        lampiran: "Repo",
        lampiranIcon: "repo",
        status: "Ditolak",
        initials: "BS",
        avatarBg: "bg-rose-500"
    },
    {
        no: 4,
        nama: "Rina Febriani",
        nis: "1234567804",
        program: "Web Development",
        waktu: "14:05 WIB<br><span class='text-[10px] text-slate-400 font-normal'>17 Okt 2026</span>",
        judul: "Penyusunan Pitch Deck 10 Slide & Financial Projection",
        deskripsi: "Unit economics dihitung berdasarkan asumsi COGS produk...",
        lampiran: "2 File",
        lampiranIcon: "file",
        status: "Diterima",
        initials: "RF",
        avatarBg: "bg-emerald-600"
    }
];

export function initMentorDailyReport() {
    console.log("Modul Kelola Daily Report Mentor berhasil dimuat.");

    const tableBody = document.getElementById("table-report-body");
    const searchInput = document.getElementById("input-search-report");
    const filterProgram = document.getElementById("filter-program");
    const filterStatus = document.getElementById("filter-status");
    const tabButtons = document.querySelectorAll(".tab-btn");

    let activeTab = "semua";

    // Fungsi render tabel
    function renderTable(data) {
        if (!tableBody) return;

        if (data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="8" class="py-6 text-center text-slate-400">Tidak ada laporan harian yang ditemukan.</td></tr>`;
            return;
        }

        tableBody.innerHTML = data.map(item => {
            // Badge Status
            let statusBadge = "";
            if (item.status === "Menunggu") {
                statusBadge = `<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[11px] font-bold">Menunggu</span>`;
            } else if (item.status === "Diterima") {
                statusBadge = `<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold">Diterima</span>`;
            } else if (item.status === "Ditolak") {
                statusBadge = `<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-[11px] font-bold">Ditolak</span>`;
            }

            // Tombol Tindakan
            let actionBtn = item.status === "Menunggu"
                ? `<button class="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold text-xs transition">Periksa</button>`
                : `<button class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs transition">Detail ↗</button>`;

            // Lampiran Icon & Badge
            let lampiranBadge = `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium">📄 ${item.lampiran}</span>`;
            if (item.lampiranIcon === "sheet") {
                lampiranBadge = `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-medium">📊 ${item.lampiran}</span>`;
            } else if (item.lampiranIcon === "repo") {
                lampiranBadge = `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-[10px] font-medium">💻 ${item.lampiran}</span>`;
            }

            return `
                <tr class="hover:bg-slate-50/80 transition align-top">
                    <td class="py-4 px-6 font-semibold text-slate-500">${item.no}</td>
                    <td class="py-4 px-6">
                        <div class="flex items-center gap-3">
                            <div class="h-9 w-9 rounded-full ${item.avatarBg} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                                ${item.initials}
                            </div>
                            <div>
                                <h4 class="font-bold text-slate-900">${item.nama}</h4>
                                <p class="text-[10px] text-slate-400">NIS: ${item.nis}</p>
                            </div>
                        </div>
                    </td>
                    <td class="py-4 px-6">
                        <span class="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium">${item.program}</span>
                    </td>
                    <td class="py-4 px-6 font-medium text-slate-700 text-xs">${item.waktu}</td>
                    <td class="py-4 px-6 max-w-xs">
                        <p class="font-bold text-slate-900 text-xs">${item.judul}</p>
                        <p class="text-[11px] text-slate-400 mt-0.5 truncate">${item.deskripsi}</p>
                    </td>
                    <td class="py-4 px-6">${lampiranBadge}</td>
                    <td class="py-4 px-6">${statusBadge}</td>
                    <td class="py-4 px-6 text-center">${actionBtn}</td>
                </tr>
            `;
        }).join("");
    }

    // Render awal
    renderTable(dataDailyReports);

    // Fungsi Filter Gabungan (Search, Program, Status, Tab)
    function applyFilters() {
        const keyword = (searchInput ? searchInput.value : "").toLowerCase();
        const progVal = (filterProgram ? filterProgram.value : "").toLowerCase();
        const statVal = (filterStatus ? filterStatus.value : "").toLowerCase();

        const filtered = dataDailyReports.filter(item => {
            const matchKeyword = item.nama.toLowerCase().includes(keyword) || item.judul.toLowerCase().includes(keyword);
            const matchProgram = progVal === "" || item.program.toLowerCase().includes(progVal);
            const matchStatus = statVal === "" || item.status.toLowerCase() === statVal;

            // Kondisi Tab
            let matchTab = true;
            if (activeTab === "belum-dinilai") {
                matchTab = item.status.toLowerCase() === "menunggu";
            } else if (activeTab === "selesai") {
                matchTab = item.status.toLowerCase() === "diterima" || item.status.toLowerCase() === "ditolak";
            }

            return matchKeyword && matchProgram && matchStatus && matchTab;
        });

        renderTable(filtered);
    }

    if (searchInput) searchInput.addEventListener("input", applyFilters);
    if (filterProgram) filterProgram.addEventListener("change", applyFilters);
    if (filterStatus) filterStatus.addEventListener("change", applyFilters);

    // Logika Klik Tab
    tabButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            tabButtons.forEach(b => b.classList.remove("bg-white", "shadow-sm", "text-slate-900"));
            tabButtons.forEach(b => b.classList.add("hover:text-slate-900"));
            
            e.target.classList.add("bg-white", "shadow-sm", "text-slate-900");
            e.target.classList.remove("hover:text-slate-900");

            activeTab = e.target.dataset.tab;
            applyFilters();
        });
    });
}