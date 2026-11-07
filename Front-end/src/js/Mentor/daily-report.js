/* =========================================================
LOGIKA HALAMAN KELOLA DAILY REPORT MENTOR & POP-UP DETAIL
========================================================= */

const dataDailyReports = [
    {
        no: 1,
        nama: "Ahmad Fauzi",
        nis: "1234567801",
        program: "Web Development",
        waktu: "17:15 WIB<br><span class='text-[10px] text-slate-400 font-normal'>17 Okt 2026</span>",
        tglLaporan: "17 Oktober 2026",
        judul: "Mengerjakan rancangan prototype dan alur checkout",
        deskripsi: "Hari ini saya mengerjakan bagian UI pada project MVP inkubasi. Modul katalog sudah selesai, namun kendala masih bingung dengan integrasi payment gateway sandbox.",
        lampiran: "Dokumentasi_Progress_Checkout.pdf",
        lampiranInfo: "Format Dokumen PDF • 2.4 MB",
        lampiranTipe: "PDF",
        status: "Menunggu"
    },
    {
        no: 2,
        nama: "Siti Aisyah",
        nis: "1234567802",
        program: "Web Development",
        waktu: "16:40 WIB<br><span class='text-[10px] text-slate-400 font-normal'>17 Okt 2026</span>",
        tglLaporan: "17 Oktober 2026",
        judul: "Riset 15 Pelanggan Potensial (Customer Validation)",
        deskripsi: "Telah melakukan wawancara langsung ke 10 mahasiswa terkait kebutuhan aplikasi pencatatan keuangan harian.",
        lampiran: "Sheet_Validasi_Customer.xlsx",
        lampiranInfo: "Format Spreadsheet • 1.8 MB",
        lampiranTipe: "XLS",
        status: "Diterima"
    },
    {
        no: 3,
        nama: "Budi Santoso",
        nis: "1234567803",
        program: "Web Development",
        waktu: "15:10 WIB<br><span class='text-[10px] text-slate-400 font-normal'>17 Okt 2026</span>",
        tglLaporan: "17 Oktober 2026",
        judul: "Konfigurasi Database Postgres & API Authentication",
        deskripsi: "Terdapat error koneksi SSL pool pada Supabase saat implementasi JSON Web Token.",
        lampiran: "Error_Log_Supabase.txt",
        lampiranInfo: "Format Text Log • 500 KB",
        lampiranTipe: "TXT",
        status: "Ditolak"
    },
    {
        no: 4,
        nama: "Rina Febriani",
        nis: "1234567804",
        program: "Web Development",
        waktu: "14:05 WIB<br><span class='text-[10px] text-slate-400 font-normal'>17 Okt 2026</span>",
        tglLaporan: "17 Oktober 2026",
        judul: "Penyusunan Pitch Deck 10 Slide & Financial Projection",
        deskripsi: "Unit economics dihitung berdasarkan asumsi COGS produk digital dan proyeksi pendapatan tahun pertama.",
        lampiran: "PitchDeck_Startup_v1.pdf",
        lampiranInfo: "Format Dokumen PDF • 5.1 MB",
        lampiranTipe: "PDF",
        status: "Diterima"
    }
];

let activeReportId = null;

export function initMentorDailyReport() {
    console.log("Modul Kelola Daily Report Mentor berhasil dimuat.");

    const tableBody = document.getElementById("table-report-body");
    const searchInput = document.getElementById("input-search-report");
    const filterProgram = document.getElementById("filter-program");
    const filterStatus = document.getElementById("filter-status");
    const tabButtons = document.querySelectorAll(".tab-btn");

    let activeTab = "semua";

    // Fungsi Render Tabel
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
            } else if (item.status === "Ditolak") {
                statusBadge = `<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-[11px] font-bold">Ditolak</span>`;
            }

            let actionBtn = item.status === "Menunggu"
                ? `<button onclick="window.openDailyReportModal(${item.no})" class="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold text-xs transition shadow-sm">Periksa</button>`
                : `<button onclick="window.openDailyReportModal(${item.no})" class="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs transition inline-flex items-center gap-1">Detail ↗</button>`;

            let lampiranBadge = `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium truncate max-w-[150px]">📄 ${item.lampiran}</span>`;

            return `
                <tr class="hover:bg-slate-50/80 transition align-top">
                    <td class="py-4 px-6 font-semibold text-slate-400">${idx + 1}</td>
                    <td class="py-4 px-6">
                        <div>
                            <h4 class="font-bold text-slate-900">${item.nama}</h4>
                            <p class="text-[10px] text-slate-400 font-medium">NIS: ${item.nis}</p>
                        </div>
                    </td>
                    <td class="py-4 px-6">
                        <span class="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">${item.program}</span>
                    </td>
                    <td class="py-4 px-6 font-medium text-slate-700 text-xs">${item.waktu}</td>
                    <td class="py-4 px-6 max-w-xs">
                        <p class="font-bold text-slate-900 text-xs hover:text-indigo-600 transition cursor-pointer" onclick="window.openDailyReportModal(${item.no})">${item.judul}</p>
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

    // Fungsi Filter Data
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
                matchTab = item.status.toLowerCase() === "diterima" || item.status.toLowerCase() === "ditolak";
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

    // Inisialisasi Fungsi Global untuk Membuka & Mengelola Modal Pop-up
    window.openDailyReportModal = async (id) => {
        activeReportId = id;
        const item = dataDailyReports.find(d => d.no === id);
        if (!item) return;

        const container = document.getElementById("daily-report-modal-container");
        if (container && !container.innerHTML.trim()) {
            try {
                const response = await fetch('/component/Mentor/pop-up-daily-report.html');
                if (response.ok) {
                    container.innerHTML = await response.text();
                    setupModalEventListeners();
                } else {
                    console.error("Gagal mengambil file pop-up daily report.");
                }
            } catch (err) {
                console.error("Kesalahan jaringan saat memuat modal:", err);
            }
        }

        // Isi data dinamis ke dalam elemen pop-up modal
        const elNama = document.getElementById("modal-siswa-nama");
        const elNis = document.getElementById("modal-siswa-nis");
        const elProg = document.getElementById("modal-siswa-program");
        const elInit = document.getElementById("modal-siswa-initial");
        const elTgl = document.getElementById("modal-tgl-laporan");
        const elJudul = document.getElementById("modal-judul-laporan");
        const elDesk = document.getElementById("modal-deskripsi-laporan");
        const elLampNama = document.getElementById("modal-lampiran-nama");
        const elLampInfo = document.getElementById("modal-lampiran-info");
        const elLampTipe = document.getElementById("modal-lampiran-tipe");

        if (elNama) elNama.textContent = item.nama;
        if (elNis) elNis.textContent = `NIS: ${item.nis} • Pembimbing: Ibu Sari Lestari`;
        if (elProg) elProg.textContent = item.program;
        if (elInit) elInit.textContent = item.nama.split(" ").map(n => n[0]).join("").toUpperCase();
        if (elTgl) elTgl.textContent = item.tglLaporan;
        if (elJudul) elJudul.textContent = item.judul;
        if (elDesk) elDesk.textContent = item.deskripsi;
        if (elLampNama) elLampNama.textContent = item.lampiran;
        if (elLampInfo) elLampInfo.textContent = item.lampiranInfo;
        if (elLampTipe) elLampTipe.textContent = item.lampiranTipe;

        const modalEl = document.getElementById("modal-daily-report");
        if (modalEl) modalEl.classList.remove("hidden");
    };

    function setupModalEventListeners() {
        const closeBtn = document.getElementById("modal-close-btn");
        const modalEl = document.getElementById("modal-daily-report");
        const btnTerima = document.getElementById("btn-terima-laporan");
        const btnTolak = document.getElementById("btn-tolak-revisi");
        const templateBtns = document.querySelectorAll(".template-btn");
        const textareaCatatan = document.getElementById("input-catatan-mentor");

        if (closeBtn && modalEl) {
            closeBtn.addEventListener("click", () => modalEl.classList.add("hidden"));
            modalEl.addEventListener("click", (e) => {
                if (e.target === modalEl) modalEl.classList.add("hidden");
            });
        }

        templateBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                if (textareaCatatan) {
                    textareaCatatan.value = btn.textContent.trim().replace("+ ", "");
                }
            });
        });

        if (btnTerima) {
            btnTerima.onclick = () => {
                const item = dataDailyReports.find(d => d.no === activeReportId);
                if (item) item.status = "Diterima";
                alert("Daily report siswa berhasil disetujui!");
                if (modalEl) modalEl.classList.add("hidden");
                renderTable(dataDailyReports);
            };
        }

        if (btnTolak) {
            btnTolak.onclick = () => {
                const item = dataDailyReports.find(d => d.no === activeReportId);
                if (item) item.status = "Ditolak";
                alert("Permintaan revisi daily report telah dikirim ke siswa.");
                if (modalEl) modalEl.classList.add("hidden");
                renderTable(dataDailyReports);
            };
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initMentorDailyReport();
});