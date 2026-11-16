/* =========================================================
LOGIKA HALAMAN KELOLA DAFTAR RFID ADMIN (SPA STYLE)
========================================================= */

const dataRfidSiswa = [
    { id: 1, nama: "Bagaskara", program: "Web Development", nis: "4567897654", rfid: "1234211", status: "Aktif", assignedAt: "16/11/2026. 01:20:59" },
    { id: 2, nama: "Bagaskara", program: "Web Development", nis: "4567897654", rfid: "1234211", status: "Aktif", assignedAt: "16/11/2026. 01:20:59" },
    { id: 3, nama: "Bagaskara", program: "Web Development", nis: "4567897654", rfid: "1234211", status: "Aktif", assignedAt: "16/11/2026. 01:20:59" },
    { id: 4, nama: "Bagaskara", program: "Web Development", nis: "4567897654", rfid: "1234211", status: "Aktif", assignedAt: "16/11/2026. 01:20:59" }
];

let activeRfidId = null;

export function initAdminRfid() {
    console.log("Modul Kelola Daftar RFID Admin berhasil dimuat.");
    renderRfidView();
}

function renderRfidView() {
    const mainArea = document.getElementById("main-content-area");
    if (!mainArea) return;

    mainArea.innerHTML = `
        <!-- Breadcrumb & Judul Halaman -->
        <div class="space-y-1">
            <div class="flex items-center gap-2 text-xs text-slate-400">
                <span>Sistem Informasi Inkubasi (SI-IN)</span>
            </div>
            <div class="flex items-center gap-2">
                <span class="text-sm font-bold text-slate-700">📁 Data RFID</span>
            </div>
            <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Daftar RFID SISWA</h1>
            <p class="text-xs text-slate-500">Daftarkan ID pada RFID Siswa untuk kelas Inkubasi</p>
        </div>

        <!-- Bagian Filter & Aksi Atas -->
        <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <!-- Input Pencarian -->
                <div class="relative flex-1 sm:w-80">
                    <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    </span>
                    <input type="text" id="input-search-rfid" placeholder="Cari program..." class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-red-600 transition">
                </div>
                
                <!-- Dropdown Filter Program -->
                <select id="filter-program" class="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-red-600 transition">
                    <option value="">Semua Program</option>
                    <option value="Web Development">Web Development</option>
                </select>

                <!-- Dropdown Filter RFID Status/Tipe -->
                <select id="filter-rfid" class="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-red-600 transition">
                    <option value="">Semua RFID</option>
                    <option value="sudah">Sudah Ada RFID</option>
                    <option value="belum">Belum Ada RFID</option>
                </select>
            </div>

            <!-- Tombol Export / Refresh -->
            <div class="flex items-center gap-2 self-end md:self-auto">
                <button type="button" class="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 transition shadow-sm" title="Download">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                </button>
                <button type="button" class="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 transition shadow-sm" title="Refresh">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                </button>
            </div>
        </div>

        <!-- Tabel Daftar RFID -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                            <th class="py-3.5 px-6">Nama Siswa</th>
                            <th class="py-3.5 px-6">Program</th>
                            <th class="py-3.5 px-6">NIS</th>
                            <th class="py-3.5 px-6">RFID</th>
                            <th class="py-3.5 px-6">Status</th>
                            <th class="py-3.5 px-6">Assigned At</th>
                            <th class="py-3.5 px-6 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody id="table-rfid-body" class="divide-y divide-slate-100 text-xs font-medium text-slate-600">
                        <!-- Data dirender dinamis via JS -->
                    </tbody>
                </table>
            </div>

            <!-- Pagination Bawah Tabel -->
            <div class="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                <span id="pagination-info">Menampilkan 4 Siswa</span>
                <div class="flex items-center gap-1.5" id="pagination-buttons">
                    <button class="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition"><</button>
                    <button class="w-8 h-8 rounded-lg bg-red-600 text-white font-bold flex items-center justify-center shadow-sm shadow-red-500/20">1</button>
                    <button class="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center font-medium text-slate-600 hover:bg-slate-50 transition">2</button>
                    <button class="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center font-medium text-slate-600 hover:bg-slate-50 transition">3</button>
                    <button class="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition">></button>
                </div>
            </div>
        </div>

        <!-- Container untuk memuat Modal Pop-up Edit RFID -->
        <div id="rfid-modal-container"></div>
    `;

    populateRfidTable(dataRfidSiswa);
    setupRfidInteractions();
}

function populateRfidTable(data) {
    const tbody = document.getElementById("table-rfid-body");
    if (!tbody) return;

    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="py-8 text-center text-slate-400">Tidak ada data RFID ditemukan.</td></tr>`;
        return;
    }

    tbody.innerHTML = data.map(item => `
        <tr class="hover:bg-slate-50/80 transition align-top border-b border-slate-100 last:border-none">
            <td class="py-4 px-6 font-bold text-slate-900">${item.nama}</td>
            <td class="py-4 px-6">
                <span class="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[11px] font-semibold">${item.program}</span>
            </td>
            <td class="py-4 px-6 font-medium text-slate-600">${item.nis}</td>
            <td class="py-4 px-6 font-mono font-bold text-slate-700">${item.rfid}</td>
            <td class="py-4 px-6">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>${item.status}
                </span>
            </td>
            <td class="py-4 px-6 text-slate-500">${item.assignedAt}</td>
            <td class="py-4 px-6 text-center">
                <button type="button" class="btn-edit-rfid p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-indigo-600 transition border border-slate-200/60 shadow-sm" data-id="${item.id}" title="Edit RFID">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
            </td>
        </tr>
    `).join("");
}

async function ensureRfidModalLoaded() {
    const container = document.getElementById("rfid-modal-container");
    if (!container) return false;

    if (!container.innerHTML.trim()) {
        try {
            const response = await fetch('/component/Admin/pop-up-edit-rfid.html');
            if (response.ok) {
                container.innerHTML = await response.text();
                setupRfidModalEvents();
            } else {
                console.error("Gagal memuat file pop-up edit RFID.");
                return false;
            }
        } catch (err) {
            console.error("Kesalahan jaringan saat memuat pop-up:", err);
            return false;
        }
    }
    return true;
}

window.openEditRfidModal = async (idSiswa) => {
    const loaded = await ensureRfidModalLoaded();
    if (!loaded) return;

    activeRfidId = idSiswa;
    const siswa = dataRfidSiswa.find(s => s.id == idSiswa) || dataRfidSiswa[0];

    // Isi data ke dalam elemen pop-up
    document.getElementById("modal-rfid-nama").textContent = siswa.nama;
    document.getElementById("modal-rfid-program").textContent = siswa.program;
    document.getElementById("modal-rfid-nisn").textContent = `NISN: ${siswa.nis}`;
    
    // Hitung inisial nama
    const initials = siswa.nama.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
    document.getElementById("modal-rfid-initial").textContent = initials || "AF";

    // Set nilai input RFID saat ini
    const inputRfid = document.getElementById("input-edit-id-rfid");
    if (inputRfid) inputRfid.value = siswa.rfid;

    // Tampilkan modal
    document.getElementById("modal-edit-rfid").classList.remove("hidden");
};

function setupRfidModalEvents() {
    const modalEl = document.getElementById("modal-edit-rfid");
    const closeBtn = document.getElementById("modal-rfid-close-btn");
    const saveBtn = document.getElementById("modal-rfid-save-btn");

    if (closeBtn && modalEl) {
        closeBtn.onclick = (e) => { e.preventDefault(); modalEl.classList.add("hidden"); };
    }

    if (modalEl) {
        modalEl.onclick = (e) => { if (e.target === modalEl) modalEl.classList.add("hidden"); };
    }

    if (saveBtn) {
        saveBtn.onclick = (e) => {
            e.preventDefault();
            const inputRfid = document.getElementById("input-edit-id-rfid");
            const newValue = inputRfid ? inputRfid.value.trim() : "";

            // Update data pada array lokal
            const siswa = dataRfidSiswa.find(s => s.id == activeRfidId);
            if (siswa) {
                siswa.rfid = newValue;
                // Mendapatkan format tanggal & waktu saat ini secara persis
                const now = new Date();
                const dateStr = String(now.getDate()).padStart(2, '0') + '/' + String(now.getMonth() + 1).padStart(2, '0') + '/' + now.getFullYear();
                const timeStr = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0') + ':' + String(now.getSeconds()).padStart(2, '0');
                siswa.assignedAt = `${dateStr}. ${timeStr}`;
            }

            // Render ulang tabel utama
            populateRfidTable(dataRfidSiswa);

            // Tutup modal
            modalEl.classList.add("hidden");
        };
    }
}

function setupRfidInteractions() {
    const searchInput = document.getElementById("input-search-rfid");
    const filterProgram = document.getElementById("filter-program");
    const filterRfid = document.getElementById("filter-rfid");

    function applyFilter() {
        const keyword = searchInput ? searchInput.value.toLowerCase() : "";
        const progVal = filterProgram ? filterProgram.value.toLowerCase() : "";
        const rfidVal = filterRfid ? filterRfid.value.toLowerCase() : "";

        const filtered = dataRfidSiswa.filter(item => {
            const matchKeyword = item.nama.toLowerCase().includes(keyword) || item.nis.toLowerCase().includes(keyword) || item.rfid.toLowerCase().includes(keyword);
            const matchProg = progVal === "" || item.program.toLowerCase().includes(progVal);
            
            let matchRfid = true;
            if (rfidVal === "sudah") {
                // Kriteria sudah punya RFID (tidak kosong / tidak "-" / tidak null)
                matchRfid = item.rfid && item.rfid !== "-" && item.rfid.trim() !== "";
            } else if (rfidVal === "belum") {
                // Kriteria belum punya RFID (kosong atau "-")
                matchRfid = !item.rfid || item.rfid === "-" || item.rfid.trim() === "";
            }

            return matchKeyword && matchProg && matchRfid;
        });

        populateRfidTable(filtered);
    }

    if (searchInput) searchInput.addEventListener("input", applyFilter);
    if (filterProgram) filterProgram.addEventListener("change", applyFilter);
    if (filterRfid) filterRfid.addEventListener("change", applyFilter);

    // Event Delegation untuk tombol edit
    document.addEventListener("click", (e) => {
        const editBtn = e.target.closest(".btn-edit-rfid");
        if (editBtn) {
            e.preventDefault();
            const id = editBtn.dataset.id;
            if (id) {
                window.openEditRfidModal(id);
            }
        }
    });
}

// Auto Inisialisasi saat DOM sudah siap
document.addEventListener("DOMContentLoaded", () => {
    initAdminRfid();
});