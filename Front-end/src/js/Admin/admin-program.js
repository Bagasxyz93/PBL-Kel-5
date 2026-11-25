
import { initAdminTambahProgram } from "./admin-tambah-program.js";

let dataProgram = [];

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
// FORM TAMBAH PROGRAM
// ==================================================

async function renderTambahProgramView() {
    const mainContainer = document.getElementById("main-content-area");
    if (!mainContainer) return;

    try {
        const response = await fetch("/component/Admin/TambahProgram.html");

        if (!response.ok) {
            throw new Error("Gagal memuat komponen TambahProgram.html");
        }

        mainContainer.innerHTML = await response.text();

        initAdminTambahProgram(() => {
            initAdminProgram();
        });

    } catch (error) {
        console.error("Error loading TambahProgram form:", error);
        alert(error.message);
    }
}

// ==================================================
// FORM EDIT PROGRAM
// ==================================================

async function renderEditProgramView(program) {
    const mainContainer = document.getElementById("main-content-area");
    if (!mainContainer) return;

    try {
        const response = await fetch("/component/Admin/TambahProgram.html");

        if (!response.ok) {
            throw new Error("Gagal memuat form program.");
        }

        mainContainer.innerHTML = await response.text();

        const judul = mainContainer.querySelector("h1");

        if (judul) {
            judul.textContent = "Edit Program";
        }

        initAdminTambahProgram(() => {
            initAdminProgram();
        }, program);

    } catch (error) {
        console.error("Gagal membuka form edit:", error);
        alert("Gagal membuka form edit program.");
    }
}

// ==================================================
// TAMPILAN TABEL DATA PROGRAM
// ==================================================

export async function initAdminProgram() {
    const mainContainer = document.getElementById("main-content-area");
    if (!mainContainer) return;

    mainContainer.innerHTML = `
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <div class="flex items-center gap-2 text-xs font-semibold text-slate-400 tracking-wider mb-1 uppercase">
                    <span>Program</span>
                </div>
                <div class="flex items-center gap-3">
                    <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Program Kelas Inkubasi</h1>
                </div>
                <p class="text-xs text-slate-500 mt-0.5">Atur program kelas Inkubasi</p>
            </div>

            <div class="flex items-center gap-3">
                <button id="tambahProgramBtn" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-md shadow-red-600/25 transition flex items-center gap-1.5">
                    <span>+ Tambah Program</span>
                </button>
            </div>
        </div>

        <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="relative w-full md:w-96">
                <svg class="absolute left-3.5 top-3 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                <input
                    type="search"
                    id="searchProgram"
                    placeholder="Cari program..."
                    class="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-700 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition"
                >
            </div>

            <div class="flex items-center gap-3 w-full md:w-auto justify-end">
                <select id="filterProgram" class="rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-xs font-semibold text-slate-600 focus:outline-none focus:border-indigo-500">
                    <option value="">Semua Program</option>
                </select>
            </div>
        </div>

        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 tracking-wider">
                            <th class="py-4 px-6 w-16">NO</th>
                            <th class="py-4 px-6">NAMA PROGRAM</th>
                            <th class="py-4 px-6">STATUS</th>
                            <th class="py-4 px-6 text-right">AKSI</th>
                        </tr>
                    </thead>
                    <tbody id="tabelProgramBody" class="divide-y divide-slate-100 text-xs font-medium text-slate-600">
                    </tbody>
                </table>
            </div>

            <div class="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-white">
                <span id="infoHalamanProgram">Menampilkan <span id="progCount">0</span> Program</span>
                <div class="flex items-center gap-1.5" id="paginationContainer"></div>
            </div>
        </div>
    `;

    const searchInput = document.getElementById("searchProgram");
    const filterProgram = document.getElementById("filterProgram");
    const tabelProgramBody = document.getElementById("tabelProgramBody");
    const tambahProgramBtn = document.getElementById("tambahProgramBtn");
    const progCount = document.getElementById("progCount");

    function renderTable(data) {
        if (!tabelProgramBody) return;

        if (progCount) {
            progCount.textContent = data.length;
        }

        if (data.length === 0) {
            tabelProgramBody.innerHTML = `
                <tr>
                    <td colspan="4" class="py-8 text-center text-slate-400">
                        Tidak ada data program ditemukan.
                    </td>
                </tr>
            `;
            return;
        }

        tabelProgramBody.innerHTML = data.map((prog, index) => `
            <tr class="hover:bg-slate-50/80 transition">
                <td class="py-4 px-6 text-slate-400 font-semibold">${index + 1}</td>

                <td class="py-4 px-6">
                    <div>
                        <p class="font-bold text-slate-800">${prog.nama_program}</p>
                        <p class="text-[11px] text-slate-400 mt-0.5">${prog.deskripsi || "-"}</p>
                    </div>
                </td>

                <td class="py-4 px-6">
                    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Aktif
                    </span>
                </td>

                <td class="py-4 px-6 text-right">
                    <div class="flex items-center justify-end gap-2">
                        <button title="Edit" class="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition action-edit" data-id="${prog.id}">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                        </button>

                        <button title="Hapus" class="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition action-delete" data-id="${prog.id}">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                    </div>
                </td>
            </tr>
        `).join("");
    }

    function filterData() {
        const keyword = searchInput.value.toLowerCase();
        const selectedProg = filterProgram.value;

        const filtered = dataProgram.filter(prog => {
            const matchKeyword =
                prog.nama_program.toLowerCase().includes(keyword);

            const matchProg =
                selectedProg === "" ||
                prog.nama_program === selectedProg;

            return matchKeyword && matchProg;
        });

        renderTable(filtered);
    }

    // ==================================================
    // MEMUAT DATA PROGRAM
    // ==================================================

    async function loadDataProgram() {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/admin/api_program.php`,
                {
                    headers: getAuthHeaders()
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Gagal memuat data program.");
            }

            dataProgram = result.data;

            filterProgram.innerHTML = `
                <option value="">Semua Program</option>
                ${dataProgram.map(prog => `
                    <option value="${prog.nama_program}">
                        ${prog.nama_program}
                    </option>
                `).join("")}
            `;

            renderTable(dataProgram);

        } catch (error) {
            console.error("Gagal mengambil data program:", error);

            tabelProgramBody.innerHTML = `
                <tr>
                    <td colspan="4" class="py-8 text-center text-red-500">
                        Gagal memuat data program.
                    </td>
                </tr>
            `;
        }
    }

    // ==================================================
    // EVENT PENCARIAN DAN FILTER
    // ==================================================

    searchInput.addEventListener("input", filterData);
    filterProgram.addEventListener("change", filterData);

    // ==================================================
    // TOMBOL TAMBAH
    // ==================================================

    tambahProgramBtn.addEventListener("click", () => {
        renderTambahProgramView();
    });

    // ==================================================
    // EVENT EDIT DAN HAPUS
    // ==================================================

    tabelProgramBody.addEventListener("click", async (e) => {
        const tombolEdit = e.target.closest(".action-edit");
        const tombolHapus = e.target.closest(".action-delete");

        if (tombolEdit) {
            const idProgram = Number(tombolEdit.dataset.id);

            const programDipilih = dataProgram.find(
                prog => Number(prog.id) === idProgram
            );

            if (!programDipilih) {
                alert("Data program tidak ditemukan.");
                return;
            }

            renderEditProgramView(programDipilih);
            return;
        }

        if (tombolHapus) {
            const idProgram = Number(tombolHapus.dataset.id);

            const konfirmasi = confirm(
                "Apakah kamu yakin ingin menghapus program ini?"
            );

            if (!konfirmasi) return;

            try {
                const response = await fetch(
                    `${API_BASE_URL}/api/admin/api_hapus_program.php`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            ...getAuthHeaders()
                        },
                        body: JSON.stringify({
                            id: idProgram
                        })
                    }
                );

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(
                        result.message || "Gagal menghapus program."
                    );
                }

                alert(result.message);
                await loadDataProgram();

            } catch (error) {
                console.error("Gagal menghapus program:", error);
                alert(error.message);
            }
        }
    });

    await loadDataProgram();
}

// ==================================================
// INISIALISASI HALAMAN
// ==================================================

document.addEventListener("DOMContentLoaded", () => {
    initAdminProgram();
});
