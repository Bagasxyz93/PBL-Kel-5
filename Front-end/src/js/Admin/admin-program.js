import { initAdminTambahProgram } from "./admin-tambah-program.js";

// Data Mockup Sesuai Figma Kelola Program Utama
let dummyProgram = [
    { id: 1, judul: "WEB Development", sub: "Pengembangan website dan aplikasi web.", status: "Aktif" },
    { id: 2, judul: "Desktop Development", sub: "Pengembangan aplikasi desktop.", status: "Aktif" },
    { id: 3, judul: "Computer Networking", sub: "Pembelajaran jaringan komputer.", status: "Aktif" }
];

// Fungsi Memuat Tampilan Form Tambah Program (SPA View)
async function renderTambahProgramView() {
    const mainContainer = document.getElementById("main-content-area");
    if (!mainContainer) return;

    try {
        const response = await fetch("/component/Admin/TambahProgram.html");
        if (!response.ok) throw new Error("Gagal memuat komponen TambahProgram.html");
        
        mainContainer.innerHTML = await response.text();

        // Inisialisasi logika form tambah program dari file terpisah
        initAdminTambahProgram((newProgram) => {
            if (newProgram && newProgram.judul) {
                dummyProgram.push(newProgram);
            }
            initAdminProgram(); // Callback kembali ke tabel program utama
        });

    } catch (error) {
        console.error("Error loading TambahProgram form:", error);
    }
}

// Fungsi Utama: Tampilan Tabel Data Program
function initAdminProgram() {
    const mainContainer = document.getElementById("main-content-area");
    if (!mainContainer) return;

    mainContainer.innerHTML = `
        <!-- Judul & Tombol Tambah Sesuai Figma -->
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
                <div class="bg-red-50 border border-red-100 text-red-600 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-red-600"></span>
                    Batch 2025/2026 Aktif
                </div>
                <button id="tambahProgramBtn" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-md shadow-red-600/25 transition flex items-center gap-1.5">
                    <span>+ Tambah Program</span>
                </button>
            </div>
        </div>

        <!-- Bar Pencarian & Filter Sesuai Figma -->
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
                    <option value="WEB Development">WEB Development</option>
                    <option value="Desktop Development">Desktop Development</option>
                    <option value="Computer Networking">Computer Networking</option>
                </select>
                <button class="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition" title="Download Data">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                </button>
                <button id="refreshProgramBtn" class="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition" title="Refresh Data">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                </button>
            </div>
        </div>

        <!-- Tabel Data Program Sesuai Figma -->
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
                        <!-- Data dimuat secara dinamis -->
                    </tbody>
                </table>
            </div>

            <!-- Footer Tabel / Paginasi -->
            <div class="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-white">
                <span id="infoHalamanProgram">Menampilkan <span id="progCount">3</span> Program</span>
                <div class="flex items-center gap-1.5" id="paginationContainer">
                    <button class="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 text-slate-400 hover:bg-slate-50">&lt;</button>
                    <button class="w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-600/20">1</button>
                    <button class="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 hover:bg-slate-50">&gt;</button>
                </div>
            </div>
        </div>
    `;

    const searchInput = document.getElementById("searchProgram");
    const filterProgram = document.getElementById("filterProgram");
    const tabelProgramBody = document.getElementById("tabelProgramBody");
    const refreshBtn = document.getElementById("refreshProgramBtn");
    const tambahProgramBtn = document.getElementById("tambahProgramBtn");
    const progCount = document.getElementById("progCount");

    if (progCount) progCount.textContent = dummyProgram.length;

    function renderTable(data) {
        if (!tabelProgramBody) return;
        
        if (data.length === 0) {
            tabelProgramBody.innerHTML = `<tr><td colspan="4" class="py-8 text-center text-slate-400">Tidak ada data program ditemukan.</td></tr>`;
            return;
        }

        tabelProgramBody.innerHTML = data.map((prog, index) => `
            <tr class="hover:bg-slate-50/80 transition">
                <td class="py-4 px-6 text-slate-400 font-semibold">${index + 1}</td>
                <td class="py-4 px-6">
                    <div>
                        <p class="font-bold text-slate-800">${prog.judul}</p>
                        <p class="text-[11px] text-slate-400 mt-0.5">${prog.sub}</p>
                    </div>
                </td>
                <td class="py-4 px-6">
                    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> ${prog.status}
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
        const keyword = searchInput ? searchInput.value.toLowerCase() : "";
        const selectedProg = filterProgram ? filterProgram.value : "";

        const filtered = dummyProgram.filter(prog => {
            const matchKeyword = prog.judul.toLowerCase().includes(keyword) || prog.sub.toLowerCase().includes(keyword);
            const matchProg = selectedProg === "" || prog.judul === selectedProg;
            return matchKeyword && matchProg;
        });

        renderTable(filtered);
    }

    if (searchInput) searchInput.addEventListener("input", filterData);
    if (filterProgram) filterProgram.addEventListener("change", filterData);

    if (tambahProgramBtn) {
        tambahProgramBtn.addEventListener("click", () => {
            renderTambahProgramView();
        });
    }

    if (refreshBtn) {
        refreshBtn.addEventListener("click", () => {
            if (searchInput) searchInput.value = "";
            if (filterProgram) filterProgram.value = "";
            renderTable(dummyProgram);
        });
    }

    renderTable(dummyProgram);
}

// Inisialisasi awal saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
    initAdminProgram();
});