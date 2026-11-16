/* =========================================================
LOGIKA HALAMAN KELOLA DAILY REPORT MENTOR (DENGAN UPDATE STATUS)
========================================================= */

const databaseSiswaReport = {
    "1234567801": {
        nama: "Ahmad Fauzi",
        nis: "1234567801",
        program: "Web Development",
        inisial: "AF",
        keaktifan: "96% Sangat Rajin",
        totalLaporan: 15,
        diterima: 10,
        menunggu: 4,
        revisi: 1,
        riwayat: [
            { 
                id: "rep-01",
                no: 1, 
                tanggal: "17 Okt 2026", 
                waktu: "17:15 WIB", 
                judul: "Mengerjakan rancangan prototype dan alur checkout", 
                deskripsi: "Modul katalog sudah selesai, kendala integrasi gateway pembayaran sandbox.", 
                lampiranTipe: "📎 1 File", 
                lampiranNama: "Dokumentasi_Progress_Checkout.pdf",
                lampiranUkuran: "Format Dokumen PDF • 2.4 MB",
                status: "Menunggu", 
                statusBadgeClass: "bg-amber-50 text-amber-600 border border-amber-200" 
            },
            { 
                id: "rep-02",
                no: 2, 
                tanggal: "16 Okt 2026", 
                waktu: "16:40 WIB", 
                judul: "Riset 15 Pelanggan Potensial (Customer Validation)", 
                deskripsi: "Telah melakukan wawancara langsung ke 10 mahasiswa terkait kebutuhan aplikasi.", 
                lampiranTipe: "📊 Sheet", 
                lampiranNama: "Sheet_Validasi_Customer.xlsx",
                lampiranUkuran: "Microsoft Excel • 1.1 MB",
                status: "Diterima", 
                statusBadgeClass: "bg-emerald-50 text-emerald-600 border border-emerald-200" 
            },
            { 
                id: "rep-03",
                no: 3, 
                tanggal: "15 Okt 2026", 
                waktu: "15:10 WIB", 
                judul: "Konfigurasi Database Postgres & API Authentication", 
                deskripsi: "Terdapat error koneksi SSL pool pada Supabase saat migrasi tabel.", 
                lampiranTipe: "📦 Repo", 
                lampiranNama: "Error_Log_Supabase.txt",
                lampiranUkuran: "Text File • 45 KB",
                status: "Ditolak", 
                statusBadgeClass: "bg-rose-50 text-rose-600 border border-rose-200" 
            }
        ]
    },
    "1234567802": {
        nama: "Siti Aisyah",
        nis: "1234567802",
        program: "Web Development",
        inisial: "SA",
        keaktifan: "92% Rajin",
        totalLaporan: 14,
        diterima: 12,
        menunggu: 2,
        revisi: 0,
        riwayat: [
            { 
                id: "rep-04",
                no: 1, 
                tanggal: "17 Okt 2026", 
                waktu: "16:40 WIB", 
                judul: "Riset 15 Pelanggan Potensial (Customer Validation)", 
                deskripsi: "Telah melakukan wawancara langsung ke 10 mahasiswa terkait riset pasar...", 
                lampiranTipe: "📊 Sheet", 
                lampiranNama: "Sheet_Validasi_Customer.xlsx",
                lampiranUkuran: "Microsoft Excel • 1.1 MB",
                status: "Diterima", 
                statusBadgeClass: "bg-emerald-50 text-emerald-600 border border-emerald-200" 
            }
        ]
    },
    "1234567803": {
        nama: "Budi Santoso",
        nis: "1234567803",
        program: "Web Development",
        inisial: "BS",
        keaktifan: "88% Cukup",
        totalLaporan: 12,
        diterima: 8,
        menunggu: 3,
        revisi: 1,
        riwayat: [
            { 
                id: "rep-05",
                no: 1, 
                tanggal: "17 Okt 2026", 
                waktu: "15:10 WIB", 
                judul: "Konfigurasi Database Postgres & API Authentication", 
                deskripsi: "Terdapat error koneksi SSL pool pada Supabase.", 
                lampiranTipe: "📦 Repo", 
                lampiranNama: "Error_Log_Supabase.txt",
                lampiranUkuran: "Text File • 45 KB",
                status: "Ditolak", 
                statusBadgeClass: "bg-rose-50 text-rose-600 border border-rose-200" 
            }
        ]
    },
    "1234567804": {
        nama: "Rina Febriani",
        nis: "1234567804",
        program: "Web Development",
        inisial: "RF",
        keaktifan: "95% Sangat Rajin",
        totalLaporan: 15,
        diterima: 13,
        menunggu: 1,
        revisi: 1,
        riwayat: [
            { 
                id: "rep-06",
                no: 1, 
                tanggal: "17 Okt 2026", 
                waktu: "14:05 WIB", 
                judul: "Penyusunan Pitch Deck 10 Slide & Financial Projection", 
                deskripsi: "Unit economics dihitung berdasarkan asumsi COGS.", 
                lampiranTipe: "📎 2 File", 
                lampiranNama: "PitchDeck_Startup_v1.pdf",
                lampiranUkuran: "Format Dokumen PDF • 4.2 MB",
                status: "Diterima", 
                statusBadgeClass: "bg-emerald-50 text-emerald-600 border border-emerald-200" 
            }
        ]
    }
};

const dataDailyReports = [
    { no: 1, nama: "Ahmad Fauzi", nis: "1234567801", program: "Web Development", waktu: "17:15 WIB<br><span class='text-[10px] text-slate-400 font-normal'>17 Okt 2026</span>", judul: "Mengerjakan rancangan prototype dan alur checkout", deskripsi: "Modul katalog sudah selesai, kendala integrasi gateway pembayaran sandbox.", lampiran: "1 File", lampiranBadgeClass: "bg-blue-50 text-blue-600 border border-blue-200", status: "Menunggu" },
    { no: 2, nama: "Siti Aisyah", nis: "1234567802", program: "Web Development", waktu: "16:40 WIB<br><span class='text-[10px] text-slate-400 font-normal'>17 Okt 2026</span>", judul: "Riset 15 Pelanggan Potensial (Customer Validation)", deskripsi: "Telah melakukan wawancara langsung ke 10 mahasiswa terkait kebutuhan aplikasi.", lampiran: "Sheet", lampiranBadgeClass: "bg-indigo-50 text-indigo-600 border border-indigo-200", status: "Diterima" },
    { no: 3, nama: "Budi Santoso", nis: "1234567803", program: "Web Development", waktu: "15:10 WIB<br><span class='text-[10px] text-slate-400 font-normal'>17 Okt 2026</span>", judul: "Konfigurasi Database Postgres & API Authentication", deskripsi: "Terdapat error koneksi SSL pool pada Supabase saat implementasi JSON Web Token.", lampiran: "Repo", lampiranBadgeClass: "bg-purple-50 text-purple-600 border border-purple-200", status: "Ditolak" },
    { no: 4, nama: "Rina Febriani", nis: "1234567804", program: "Web Development", waktu: "14:05 WIB<br><span class='text-[10px] text-slate-400 font-normal'>17 Okt 2026</span>", judul: "Penyusunan Pitch Deck 10 Slide & Financial Projection", deskripsi: "Unit economics dihitung berdasarkan asumsi COGS produk digital dan proyeksi pendapatan tahun pertama.", lampiran: "2 File", lampiranBadgeClass: "bg-blue-50 text-blue-600 border border-blue-200", status: "Diterima" }
];

export function initMentorDailyReport() {
    console.log("Modul Kelola Daily Report Mentor berhasil dimuat.");

    const tableBody = document.getElementById("table-report-body");
    const searchInput = document.getElementById("input-search-report");
    const filterProgram = document.getElementById("filter-program");
    const filterStatus = document.getElementById("filter-status");
    const tabButtons = document.querySelectorAll(".tab-btn");

    let activeTab = "semua";
    let activeNisSiswa = "1234567801";
    let activeReportId = null;

    function renderTable(data) {
        if (!tableBody) return;

        if (data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="8" class="py-8 text-center text-slate-400">Tidak ada laporan harian yang ditemukan.</td></tr>`;
            return;
        }

        tableBody.innerHTML = data.map((item, idx) => {
            let statusBadge = "";
            if (item.status === "Menunggu") {
                statusBadge = `<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[11px] font-bold">Menunggu</span>`;
            } else if (item.status === "Diterima") {
                statusBadge = `<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold">Diterima</span>`;
            } else if (item.status === "Ditolak" || item.status === "Revisi") {
                statusBadge = `<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-[11px] font-bold">${item.status}</span>`;
            }

            let actionBtn = `<button type="button" class="btn-buka-modal px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition inline-flex items-center gap-1" data-nis="${item.nis}">Detail ↗</button>`;
            
            let lampiranBadge = `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg ${item.lampiranBadgeClass} text-[10px] font-bold">📄 ${item.lampiran}</span>`;
            if (item.lampiran && item.lampiran.includes("Sheet")) {
                lampiranBadge = `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg ${item.lampiranBadgeClass} text-[10px] font-bold">📊 Sheet</span>`;
            } else if (item.lampiran && item.lampiran.includes("Repo")) {
                lampiranBadge = `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg ${item.lampiranBadgeClass} text-[10px] font-bold"><> Repo</span>`;
            }

            return `
                <tr class="hover:bg-slate-50/80 transition align-top border-b border-slate-100 last:border-none">
                    <td class="py-4 px-6 font-bold text-indigo-600">${idx + 1}</td>
                    <td class="py-4 px-6">
                        <div>
                            <h4 class="font-bold text-slate-900 text-xs">${item.nama}</h4>
                            <p class="text-[10px] text-slate-400 font-medium">NIS: ${item.nis}</p>
                        </div>
                    </td>
                    <td class="py-4 px-6">
                        <span class="text-slate-700 font-medium text-xs">${item.program}</span>
                    </td>
                    <td class="py-4 px-6 font-medium text-slate-600 text-xs">${item.waktu}</td>
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

    renderTable(dataDailyReports);

    function applyFilters() {
        const keyword = (searchInput ? searchInput.value : "").toLowerCase();
        const progVal = (filterProgram ? filterProgram.value : "").toLowerCase();
        const statVal = (filterStatus ? filterStatus.value : "").toLowerCase();

        const filtered = dataDailyReports.filter(item => {
            const matchKeyword = item.nama.toLowerCase().includes(keyword) || item.judul.toLowerCase().includes(keyword);
            const matchProgram = progVal === "" || item.program.toLowerCase().includes(progVal);
            const matchStatus = statVal === "" || item.status.toLowerCase() === statVal;

            let matchTab = true;
            if (activeTab === "belum-dinilai") {
                matchTab = item.status.toLowerCase() === "menunggu";
            } else if (activeTab === "selesai") {
                matchTab = item.status.toLowerCase() === "diterima" || item.status.toLowerCase() === "ditolak" || item.status.toLowerCase() === "revisi";
            }

            return matchKeyword && matchProgram && matchStatus && matchTab;
        });

        renderTable(filtered);
    }

    if (searchInput) searchInput.addEventListener("input", applyFilters);
    if (filterProgram) filterProgram.addEventListener("change", applyFilters);
    if (filterStatus) filterStatus.addEventListener("change", applyFilters);

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

    async function ensureModalLoaded() {
        const container = document.getElementById("daily-report-modal-container");
        if (!container) return false;

        if (!container.innerHTML.trim()) {
            try {
                const response = await fetch('../../component/Mentor/pop-up-detail-daily-report.html');
                if (response.ok) {
                    container.innerHTML = await response.text();
                    setupModalEvents();
                } else {
                    console.error("Gagal memuat file pop-up.");
                    return false;
                }
            } catch (err) {
                console.error("Kesalahan jaringan:", err);
                return false;
            }
        }
        return true;
    }

    window.openDailyReportModal = async (nisSiswa) => {
        const loaded = await ensureModalLoaded();
        if (!loaded) return;

        activeNisSiswa = nisSiswa;
        const dataSiswa = databaseSiswaReport[nisSiswa] || databaseSiswaReport["1234567801"];

        document.getElementById("modal-view-riwayat").classList.remove("hidden");
        document.getElementById("modal-view-detail").classList.add("hidden");

        document.getElementById("modal-siswa-initial").textContent = dataSiswa.inisial;
        document.getElementById("modal-siswa-nama").textContent = dataSiswa.nama;
        document.getElementById("modal-siswa-info").innerHTML = `NIS: ${dataSiswa.nis} • <span class="text-indigo-600 font-semibold">${dataSiswa.program}</span>`;
        document.getElementById("modal-siswa-keaktifan").textContent = dataSiswa.keaktifan;
        document.getElementById("stat-total-laporan").textContent = dataSiswa.totalLaporan;
        document.getElementById("stat-diterima").textContent = dataSiswa.diterima;
        document.getElementById("stat-menunggu").textContent = dataSiswa.menunggu;
        document.getElementById("stat-revisi").textContent = dataSiswa.revisi;

        renderRiwayatTable(dataSiswa);
        document.getElementById("modal-detail-daily-report").classList.remove("hidden");
    };

    function renderRiwayatTable(dataSiswa) {
        const tbody = document.getElementById("modal-riwayat-tbody");
        if (!tbody) return;

        tbody.innerHTML = dataSiswa.riwayat.map(item => `
            <tr class="hover:bg-slate-50/50 transition">
                <td class="py-3.5 px-4 font-bold text-slate-700">${item.no}</td>
                <td class="py-3.5 px-4"><span class="font-bold text-slate-800 block">${item.tanggal}</span><span class="text-[10px] text-slate-400">${item.waktu}</span></td>
                <td class="py-3.5 px-4"><span class="font-bold text-slate-800 block">${item.judul}</span><span class="text-[11px] text-slate-500">${item.deskripsi}</span></td>
                <td class="py-3.5 px-4"><span class="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-bold">${item.lampiranTipe}</span></td>
                <td class="py-3.5 px-4"><span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${item.statusBadgeClass}">${item.status}</span></td>
                <td class="py-3.5 px-4 text-center">
                    <button type="button" class="btn-buka-detail-laporan px-3.5 py-1.5 rounded-xl text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition" data-nis="${dataSiswa.nis}" data-id="${item.id}">
                        Detail ↗
                    </button>
                </td>
            </tr>
        `).join("");
    }

    window.openDetailLaporanModal = async (nisSiswa, reportId) => {
        const loaded = await ensureModalLoaded();
        if (!loaded) return;

        activeNisSiswa = nisSiswa;
        activeReportId = reportId;

        const dataSiswa = databaseSiswaReport[nisSiswa] || databaseSiswaReport["1234567801"];
        const report = dataSiswa.riwayat.find(r => r.id === reportId) || dataSiswa.riwayat[0];

        document.getElementById("modal-view-riwayat").classList.add("hidden");
        document.getElementById("modal-view-detail").classList.remove("hidden");

        document.getElementById("detail-nama-siswa").textContent = dataSiswa.nama;
        document.getElementById("detail-info-siswa").innerHTML = `${dataSiswa.program} • NIS: ${dataSiswa.nis} • Pembimbing: Ibu Sari Lestari`;
        document.getElementById("detail-tanggal").textContent = report.tanggal;
        document.getElementById("detail-status").innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-500 mr-1.5 inline-block"></span>${report.status}`;
        document.getElementById("detail-judul").textContent = report.judul;
        document.getElementById("detail-deskripsi").textContent = report.deskripsi;
        document.getElementById("detail-lampiran-nama").textContent = report.lampiranNama;
        document.getElementById("detail-lampiran-info").textContent = report.lampiranUkuran;
        
        const textarea = document.getElementById("evaluasi-textarea");
        if (textarea) textarea.value = "";

        document.getElementById("modal-detail-daily-report").classList.remove("hidden");
    };

    function updateLaporanStatus(statusBaru, badgeClass) {
        const dataSiswa = databaseSiswaReport[activeNisSiswa];
        if (!dataSiswa) return;

        const report = dataSiswa.riwayat.find(r => r.id === activeReportId);
        if (report) {
            report.status = statusBaru;
            report.statusBadgeClass = badgeClass;
        }

        const mainReport = dataDailyReports.find(d => d.nis === activeNisSiswa);
        if (mainReport) {
            mainReport.status = statusBaru === "Diterima" ? "Diterima" : "Ditolak";
        }

        renderTable(dataDailyReports);
        window.openDailyReportModal(activeNisSiswa);
    }

    function setupModalEvents() {
        const modalEl = document.getElementById("modal-detail-daily-report");
        const closeBtn = document.getElementById("modal-close-btn");
        const closeFooterBtn = document.getElementById("modal-close-footer-btn");

        if (closeBtn && modalEl) {
            closeBtn.onclick = (e) => { e.preventDefault(); modalEl.classList.add("hidden"); };
        }
        if (closeFooterBtn && modalEl) {
            closeFooterBtn.onclick = (e) => { e.preventDefault(); modalEl.classList.add("hidden"); };
        }
        if (modalEl) {
            modalEl.onclick = (e) => { if (e.target === modalEl) modalEl.classList.add("hidden"); };
        }

        const btnTerima = document.getElementById("btn-terima-laporan");
        if (btnTerima) {
            btnTerima.onclick = (e) => {
                e.preventDefault();
                updateLaporanStatus("Diterima", "bg-emerald-50 text-emerald-600 border border-emerald-200");
            };
        }

        const btnTolak = document.getElementById("btn-tolak-laporan");
        if (btnTolak) {
            btnTolak.onclick = (e) => {
                e.preventDefault();
                updateLaporanStatus("Revisi", "bg-rose-50 text-rose-600 border border-rose-200");
            };
        }
    }

    document.addEventListener("click", (e) => {
        const targetMainBtn = e.target.closest(".btn-buka-modal");
        if (targetMainBtn) {
            e.preventDefault();
            const nisSiswa = targetMainBtn.dataset.nis;
            if (nisSiswa) window.openDailyReportModal(nisSiswa);
        }

        const targetDetailBtn = e.target.closest(".btn-buka-detail-laporan");
        if (targetDetailBtn) {
            e.preventDefault();
            const nisSiswa = targetDetailBtn.dataset.nis;
            const reportId = targetDetailBtn.dataset.id;
            if (nisSiswa && reportId) {
                window.openDetailLaporanModal(nisSiswa, reportId);
            }
        }

        const targetBackBtn = e.target.closest(".btn-kembali-ke-riwayat");
        if (targetBackBtn) {
            e.preventDefault();
            window.openDailyReportModal(activeNisSiswa);
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initMentorDailyReport();
});