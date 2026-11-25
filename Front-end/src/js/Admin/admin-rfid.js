/* =========================================================
LOGIKA HALAMAN KELOLA DAFTAR RFID ADMIN (SPA STYLE)
========================================================= */

let dataRfidSiswa = [];
let activeRfidId = null;

const API_RFID = `${API_BASE_URL}/api/admin/api_rfid.php`;

let currentPage = 1;
const rowsPerPage = 5;
let dataRfidTampil = [];

// ==================================================
// AUTH TOKEN
// ==================================================

function getAuthHeaders() {
    const token = sessionStorage.getItem("authToken");

    if (!token) {
        throw new Error("Token login tidak ditemukan. Silakan login kembali.");
    }

    return {
        Authorization: `Bearer ${token}`
    };
}

// ==================================================
// INISIALISASI HALAMAN
// ==================================================

export function initAdminRfid() {
    console.log("Modul Kelola Daftar RFID Admin berhasil dimuat.");
    renderRfidView();
}

// ==================================================
// MENGAMBIL DATA RFID
// ==================================================

async function fetchRfidData() {
    const tbody = document.getElementById("table-rfid-body");

    try {
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="py-8 text-center text-slate-400">
                        Memuat data RFID...
                    </td>
                </tr>
            `;
        }

        const response = await fetch(API_RFID, {
            headers: getAuthHeaders()
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Gagal mengambil data RFID.");
        }

        dataRfidSiswa = result.data.map(item => ({
            id: item.id,
            nama: item.nama || "-",
            program: item.nama_program || "-",
            nis: item.nisn || "-",
            rfid: item.id_rfid || "",
            status: item.id_rfid ? "Terdaftar" : "Belum Terdaftar",
            assignedAt: item.rfid_assigned_at
                ? new Date(item.rfid_assigned_at).toLocaleString("id-ID")
                : "-"
        }));

        populateRfidTable(dataRfidSiswa);

        // Mengisi pilihan filter program dari database
        const filterProgram = document.getElementById("filter-program");

        if (filterProgram) {
            const selectedValue = filterProgram.value;

            const programs = [
                ...new Set(
                    dataRfidSiswa
                        .map(item => item.program)
                        .filter(program => program !== "-")
                )
            ];

            filterProgram.innerHTML = `
                <option value="">Semua Program</option>
                ${programs.map(program => `
                    <option value="${program}">${program}</option>
                `).join("")}
            `;

            filterProgram.value = selectedValue;
        }

    } catch (error) {
        console.error("Gagal mengambil data RFID:", error);

        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="py-8 text-center text-red-500">
                        Gagal memuat data. Periksa koneksi backend.
                    </td>
                </tr>
            `;
        }
    }
}

// ==================================================
// TAMPILAN HALAMAN RFID
// ==================================================

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
                    <input
                        type="text"
                        id="input-search-rfid"
                        placeholder="Cari nama siswa, NISN, atau ID RFID..."
                        class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-red-600 transition"
                    >
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
        </div>

        <!-- Tabel Daftar RFID -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                            <th class="py-3.5 px-6">Nama Siswa</th>
                            <th class="py-3.5 px-6">Program</th>
                            <th class="py-3.5 px-6">NISN</th>
                            <th class="py-3.5 px-6">RFID</th>
                            <th class="py-3.5 px-6">Status</th>
                            <th class="py-3.5 px-6">Assigned At</th>
                            <th class="py-3.5 px-6 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody id="table-rfid-body" class="divide-y divide-slate-100 text-xs font-medium text-slate-600">
                    </tbody>
                </table>
            </div>

            <!-- Pagination Bawah Tabel -->
            <div class="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                <span id="pagination-info">Memuat data siswa...</span>
                <div class="flex items-center gap-1.5" id="pagination-buttons"></div>
            </div>
        </div>

        <!-- Container Modal Pop-up Edit RFID -->
        <div id="rfid-modal-container"></div>
    `;

    fetchRfidData();
    setupRfidInteractions();
}

// ==================================================
// MENAMPILKAN DATA RFID KE TABEL
// ==================================================

function populateRfidTable(data) {
    const tbody = document.getElementById("table-rfid-body");
    const paginationInfo = document.getElementById("pagination-info");
    const paginationButtons = document.getElementById("pagination-buttons");

    if (!tbody) return;

    dataRfidTampil = data;

    const totalData = dataRfidTampil.length;
    const totalPages = Math.ceil(totalData / rowsPerPage);

    if (currentPage > totalPages) {
        currentPage = Math.max(1, totalPages);
    }

    if (totalData === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="py-8 text-center text-slate-400">
                    Tidak ada data siswa ditemukan.
                </td>
            </tr>
        `;

        if (paginationInfo) {
            paginationInfo.textContent = "Menampilkan 0 siswa";
        }

        if (paginationButtons) {
            paginationButtons.innerHTML = "";
        }

        return;
    }

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, totalData);

    const displayedData = dataRfidTampil.slice(startIndex, endIndex);

    tbody.innerHTML = displayedData.map(item => `
        <tr class="hover:bg-slate-50/80 transition align-top border-b border-slate-100 last:border-none">

            <td class="py-4 px-6 font-bold text-slate-900">
                ${item.nama}
            </td>

            <td class="py-4 px-6">
                <span class="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[11px] font-semibold">
                    ${item.program}
                </span>
            </td>

            <td class="py-4 px-6 font-medium text-slate-600">
                ${item.nis}
            </td>

            <td class="py-4 px-6 font-mono font-bold text-slate-700">
                ${item.rfid || "-"}
            </td>

            <td class="py-4 px-6">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${
                    item.rfid
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-amber-50 text-amber-600"
                } text-[11px] font-bold">

                    <span class="w-1.5 h-1.5 rounded-full ${
                        item.rfid ? "bg-emerald-500" : "bg-amber-500"
                    }"></span>

                    ${item.rfid ? "Terdaftar" : "Belum Terdaftar"}
                </span>
            </td>

            <td class="py-4 px-6 text-slate-500">
                ${item.assignedAt}
            </td>

            <td class="py-4 px-6 text-center">
                <button
                    type="button"
                    class="btn-edit-rfid p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-indigo-600 border border-slate-200"
                    data-id="${item.id}"
                    title="Edit RFID"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path d="M12 20h9"/>
                        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z"/>
                    </svg>
                </button>
            </td>

        </tr>
    `).join("");

    // Informasi jumlah data
    if (paginationInfo) {
        paginationInfo.textContent =
            `Menampilkan ${startIndex + 1}-${endIndex} dari ${totalData} siswa`;
    }

    // Tombol pagination
    if (paginationButtons) {
        if (totalPages <= 1) {
            paginationButtons.innerHTML = "";
        } else {
            let buttons = `
                <button
                    data-page="${currentPage - 1}"
                    ${currentPage === 1 ? "disabled" : ""}
                    class="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center ${
                        currentPage === 1
                            ? "text-slate-300 cursor-not-allowed"
                            : "text-slate-600 hover:bg-slate-50"
                    }">
                    &lt;
                </button>
            `;

            for (let page = 1; page <= totalPages; page++) {
                buttons += `
                    <button
                        data-page="${page}"
                        class="w-8 h-8 rounded-lg border ${
                            currentPage === page
                                ? "bg-red-600 text-white border-red-600 font-bold"
                                : "border-slate-200 text-slate-600 hover:bg-slate-50"
                        }">
                        ${page}
                    </button>
                `;
            }

            buttons += `
                <button
                    data-page="${currentPage + 1}"
                    ${currentPage === totalPages ? "disabled" : ""}
                    class="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center ${
                        currentPage === totalPages
                            ? "text-slate-300 cursor-not-allowed"
                            : "text-slate-600 hover:bg-slate-50"
                    }">
                    &gt;
                </button>
            `;

            paginationButtons.innerHTML = buttons;
        }
    }
}

// ==================================================
// MEMUAT MODAL RFID
// ==================================================

async function ensureRfidModalLoaded() {
    const container = document.getElementById("rfid-modal-container");
    if (!container) return false;

    if (!container.innerHTML.trim()) {
        try {
            const response = await fetch('/component/Admin/pop-up-edit-rfid.html');

            console.log("Status modal:", response.status);

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

// ==================================================
// MEMBUKA MODAL EDIT RFID
// ==================================================

window.openEditRfidModal = async (idSiswa) => {
    const loaded = await ensureRfidModalLoaded();
    if (!loaded) return;

    activeRfidId = idSiswa;

    const siswa = dataRfidSiswa.find(s => s.id == idSiswa);
    if (!siswa) return;

    document.getElementById("modal-rfid-nama").textContent = siswa.nama;
    document.getElementById("modal-rfid-program").textContent = siswa.program;
    document.getElementById("modal-rfid-nisn").textContent = `NISN: ${siswa.nis}`;

    const initials = siswa.nama
        .split(" ")
        .map(n => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

    document.getElementById("modal-rfid-initial").textContent = initials || "AF";

    const inputRfid = document.getElementById("input-edit-id-rfid");

    if (inputRfid) {
        inputRfid.value = siswa.rfid;
    }

    document.getElementById("modal-edit-rfid").classList.remove("hidden");
};

// ==================================================
// EVENT MODAL RFID
// ==================================================

function setupRfidModalEvents() {
    const modalEl = document.getElementById("modal-edit-rfid");
    const closeBtn = document.getElementById("modal-rfid-close-btn");
    const saveBtn = document.getElementById("modal-rfid-save-btn");

    if (closeBtn && modalEl) {
        closeBtn.onclick = (e) => {
            e.preventDefault();
            modalEl.classList.add("hidden");
        };
    }

    if (modalEl) {
        modalEl.onclick = (e) => {
            if (e.target === modalEl) {
                modalEl.classList.add("hidden");
            }
        };
    }

    if (saveBtn) {
        saveBtn.onclick = async (e) => {
            e.preventDefault();

            const inputRfid = document.getElementById("input-edit-id-rfid");
            const newValue = inputRfid ? inputRfid.value.trim() : "";

            if (!activeRfidId) return;

            try {
                saveBtn.disabled = true;
                saveBtn.textContent = "MENYIMPAN...";

                const response = await fetch(API_RFID, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...getAuthHeaders()
                    },
                    body: JSON.stringify({
                        user_id: activeRfidId,
                        id_rfid: newValue
                    })
                });

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(result.message || "Gagal menyimpan RFID.");
                }

                alert(result.message);

                document.getElementById("modal-edit-rfid").classList.add("hidden");

                await fetchRfidData();

            } catch (error) {
                console.error("Gagal menyimpan RFID:", error);
                alert(error.message);

            } finally {
                saveBtn.disabled = false;
                saveBtn.textContent = "SIMPAN";
            }
        };
    }
}

// ==================================================
// EVENT PENCARIAN, FILTER, DAN PAGINATION
// ==================================================

function setupRfidInteractions() {
    const searchInput = document.getElementById("input-search-rfid");
    const filterProgram = document.getElementById("filter-program");
    const filterRfid = document.getElementById("filter-rfid");

    function applyFilter() {
        const keyword = searchInput ? searchInput.value.toLowerCase() : "";
        const progVal = filterProgram ? filterProgram.value.toLowerCase() : "";
        const rfidVal = filterRfid ? filterRfid.value.toLowerCase() : "";

        const filtered = dataRfidSiswa.filter(item => {
            const nama = item.nama.toLowerCase();
            const nis = item.nis.toLowerCase();
            const rfid = item.rfid.toLowerCase();
            const program = item.program.toLowerCase();

            const matchKeyword =
                nama.includes(keyword) ||
                nis.includes(keyword) ||
                rfid.includes(keyword) ||
                program.includes(keyword);

            const matchProg =
                progVal === "" || program.includes(progVal);

            let matchRfid = true;

            if (rfidVal === "sudah") {
                matchRfid = item.rfid !== "";
            } else if (rfidVal === "belum") {
                matchRfid = item.rfid === "";
            }

            return matchKeyword && matchProg && matchRfid;
        });

        currentPage = 1;
        populateRfidTable(filtered);
    }

    if (searchInput) {
        searchInput.addEventListener("input", applyFilter);
    }

    if (filterProgram) {
        filterProgram.addEventListener("change", applyFilter);
    }

    if (filterRfid) {
        filterRfid.addEventListener("change", applyFilter);
    }

    // Event tombol pagination
    const paginationButtons = document.getElementById("pagination-buttons");

    if (paginationButtons) {
        paginationButtons.addEventListener("click", (e) => {
            const button = e.target.closest("button[data-page]");

            if (!button || button.disabled) return;

            currentPage = Number(button.dataset.page);

            populateRfidTable(dataRfidTampil);
        });
    }

    // Event Delegation tombol edit RFID
    const tbody = document.getElementById("table-rfid-body");

    if (tbody) {
        tbody.addEventListener("click", (e) => {
            const editBtn = e.target.closest(".btn-edit-rfid");

            if (!editBtn) return;

            e.preventDefault();

            const id = editBtn.dataset.id;

            console.log("Tombol edit diklik, ID peserta:", id);

            if (id) {
                window.openEditRfidModal(id);
            }
        });
    }
}

// ==================================================
// AUTO INISIALISASI SAAT DOM SIAP
// ==================================================

document.addEventListener("DOMContentLoaded", () => {
    initAdminRfid();
});