import { initAdminTambahMentor } from "./admin-tambah-mentor.js";

let dataMentor = [];

// Memuat pilihan program dari database
async function loadFilterProgram() {
    const filterBidang = document.getElementById("filterBidang");

    if (!filterBidang) return;

    try {
        const response = await fetch("http://localhost:8000/api_program.php");
        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message);
        }

        filterBidang.innerHTML = `
            <option value="">Semua Bidang</option>
            ${result.data.map(program => `
                <option value="${program.nama_program}">
                    ${program.nama_program}
                </option>
            `).join("")}
        `;

    } catch (error) {
        console.error("Gagal memuat pilihan program:", error);
    }
}

// Fungsi Memuat Tampilan Form Tambah Mentor (SPA View)
async function renderTambahMentorView() {
    const mainContainer = document.getElementById("main-content-area");
    if (!mainContainer) return;

    try {
        const response = await fetch("/component/Admin/TambahMentor.html");
        if (!response.ok) throw new Error("Gagal memuat komponen TambahMentor.html");
        
        mainContainer.innerHTML = await response.text();

        // Inisialisasi logika form tambah mentor dari file terpisah
        initAdminTambahMentor(() => {
            initAdminMentor(); // Callback kembali ke tabel mentor setelah simpan/batal
        });

    } catch (error) {
        console.error("Error loading TambahMentor form:", error);
    }
}

// Fungsi Memuat Tampilan Form Edit Mentor
async function renderEditMentorView(mentorId) {
    const mainContainer = document.getElementById("main-content-area");

    if (!mainContainer) return;

    try {
        // Memuat form mentor
        const responseHTML = await fetch("/component/Admin/TambahMentor.html");

        if (!responseHTML.ok) {
            throw new Error("Gagal memuat form mentor.");
        }

        mainContainer.innerHTML = await responseHTML.text();

        // Mengambil detail mentor berdasarkan ID
        const response = await fetch(
            `http://localhost:8000/api_detail_mentor.php?id=${mentorId}`
        );

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message);
        }

        // Menampilkan form dalam mode edit
        initAdminTambahMentor(() => {
            initAdminMentor();
        }, result.data);

    } catch (error) {
        console.error("Gagal membuka form edit mentor:", error);
        alert(error.message || "Gagal membuka data mentor.");
    }
}

// Fungsi Utama: Tampilan Tabel Data Mentor
async function initAdminMentor() {
    const mainContainer = document.getElementById("main-content-area");
    if (!mainContainer) return;

    mainContainer.innerHTML = `
        <!-- Judul & Tombol Tambah Sesuai Figma -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <p class="text-xs font-bold text-slate-400 tracking-wider uppercase mb-1">Kelola Data Mentor</p>
                <div class="flex items-center gap-3">
                    <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Data Guru / Mentor</h1>
                    <span class="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold"><span id="mentorCount">3</span> Terdaftar</span>
                </div>
            </div>
            
            <div>
                <button id="tambahGuruBtn" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-md shadow-red-600/25 transition flex items-center gap-1.5">
                    <span>+ Tambah Guru</span>
                </button>
            </div>
        </div>

        <!-- 3 Kartu Statistik Ringkasan -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <div>
                    <p class="text-xs font-semibold text-slate-400">Total Mentor Aktif</p>
                    <h3 class="text-2xl font-black text-slate-900 mt-0.5"><span id="activeMentorCount">3</span> Orang</h3>
                </div>
            </div>

            <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                </div>
                <div>
                    <p class="text-xs font-semibold text-slate-400">Bidang Peminatan</p>
                    <h3 class="text-2xl font-black text-slate-900 mt-0.5">3 Bidang</h3>
                </div>
            </div>

            <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                </div>
                <div>
                    <p class="text-xs font-semibold text-slate-400">Status Akun</p>
                    <h3 class="text-2xl font-black text-slate-900 mt-0.5">
                        <span id="persentaseMentorAktif">0%</span> Aktif
                    </h3>
                </div>
            </div>
        </div>

        <!-- Bar Pencarian & Filter -->
        <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="relative w-full md:w-96">
                <svg class="absolute left-3.5 top-3 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                <input 
                    type="search" 
                    id="searchMentor" 
                    placeholder="Cari nama / NIP..." 
                    class="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-700 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition"
                >
            </div>

            <div class="flex items-center gap-3 w-full md:w-auto justify-end">
                <select id="filterBidang" class="rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-xs font-semibold text-slate-600 focus:outline-none focus:border-indigo-500">
                    <option value="">Semua Bidang</option>
                </select>
            </div>
        </div>

        <!-- Tabel Data Mentor -->
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 tracking-wider">
                            <th class="py-4 px-6 w-16">NO</th>
                            <th class="py-4 px-6">NAMA</th>
                            <th class="py-4 px-6">NIP / ID</th>
                            <th class="py-4 px-6">PROGRAM</th>
                            <th class="py-4 px-6">STATUS</th>
                            <th class="py-4 px-6 text-right">AKSI</th>
                        </tr>
                    </thead>
                    <tbody id="tabelMentorBody" class="divide-y divide-slate-100 text-xs font-medium text-slate-600">
                        <!-- Data dimuat dinamis -->
                    </tbody>
                </table>
            </div>

            <!-- Footer Tabel -->
            <div class="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-white">
                <span id="infoHalaman">Menampilkan data mentor aktif</span>
                <div class="flex items-center gap-1.5" id="paginationContainer">
                    <button class="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 text-slate-400 hover:bg-slate-50">&lt;</button>
                    <button class="w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-600/20">1</button>
                    <button class="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 hover:bg-slate-50">&gt;</button>
                </div>
            </div>
        </div>
    `;

    // Mengambil data mentor dari database
    try {
        const response = await fetch("http://localhost:8000/api_mentor.php");
        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message);
        }

        dataMentor = result.data;

    } catch (error) {
        console.error("Gagal memuat data mentor:", error);
        alert("Gagal memuat data mentor dari database.");
        dataMentor = [];
    }

    const searchInput = document.getElementById("searchMentor");
    const filterBidang = document.getElementById("filterBidang");
    await loadFilterProgram();
    const tabelMentorBody = document.getElementById("tabelMentorBody");
    const tambahGuruBtn = document.getElementById("tambahGuruBtn");
    const mentorCount = document.getElementById("mentorCount");
    const activeMentorCount = document.getElementById("activeMentorCount");
    const persentaseMentorAktif = document.getElementById("persentaseMentorAktif");

    if (mentorCount) {
        mentorCount.textContent = dataMentor.length;
    }

    const jumlahAktif = dataMentor.filter(
        mentor => mentor.status_akun === "aktif"
    ).length;

    if (activeMentorCount) {
        activeMentorCount.textContent = jumlahAktif;
    }

    const persentase = dataMentor.length > 0
        ? Math.round((jumlahAktif / dataMentor.length) * 100)
        : 0;

    if (persentaseMentorAktif) {
        persentaseMentorAktif.textContent = persentase + "%";
    }

    function renderTable(data) {
        if (!tabelMentorBody) return;
        
        if (data.length === 0) {
            tabelMentorBody.innerHTML = `<tr><td colspan="6" class="py-8 text-center text-slate-400">Tidak ada data mentor ditemukan.</td></tr>`;
            return;
        }

       tabelMentorBody.innerHTML = data.map((mentor, index) => {
            const inisial = mentor.nama
                .split(" ")
                .map(kata => kata[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();
            
            const statusAktif = mentor.status_akun === "aktif";
            
            return `
                <tr class="hover:bg-slate-50/80 transition">
                    <td class="py-4 px-6 text-slate-400 font-semibold">${index + 1}</td>
            
                    <td class="py-4 px-6">
                        <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0 shadow-sm">
                                ${inisial}
                            </div>
                            <div>
                                <p class="font-bold text-slate-800">${mentor.nama}</p>
                                <p class="text-[11px] text-slate-400">${mentor.email}</p>
                            </div>
                        </div>
                    </td>
            
                    <td class="py-4 px-6 font-mono text-slate-600">${mentor.nip}</td>
            
                    <td class="py-4 px-6">
                        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">
                            <span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                            ${mentor.program}
                        </span>
                    </td>
            
                    <td class="py-4 px-6">
                        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${statusAktif ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"} text-[11px] font-bold">
                            <span class="w-1.5 h-1.5 rounded-full ${statusAktif ? "bg-emerald-500" : "bg-red-500"}"></span>
                            ${statusAktif ? "Aktif" : "Non-Aktif"}
                        </span>
                    </td>
            
                    <td class="py-4 px-6 text-right">
                        <div class="flex items-center justify-end gap-2">
                            <button title="Edit" class="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition action-edit" data-id="${mentor.id}">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                            </button>
            
                            <button title="Hapus" class="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition action-delete" data-id="${mentor.id}">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join("");
    }

    function filterData() {
        const keyword = searchInput ? searchInput.value.toLowerCase() : "";
        const selectedBidang = filterBidang ? filterBidang.value : "";

        const filtered = dataMentor.filter(mentor => {
            const matchKeyword =
                mentor.nama.toLowerCase().includes(keyword) ||
                mentor.nip.includes(keyword);

            const matchBidang =
                selectedBidang === "" ||
                mentor.program.includes(selectedBidang);

            return matchKeyword && matchBidang;
        });

        renderTable(filtered);
    }

    if (searchInput) searchInput.addEventListener("input", filterData);
    if (filterBidang) filterBidang.addEventListener("change", filterData);

    if (tambahGuruBtn) {
        tambahGuruBtn.addEventListener("click", () => {
            renderTambahMentorView();
        });
    }

     // Event tombol Edit dan Hapus Mentor
    if (tabelMentorBody) {
        tabelMentorBody.addEventListener("click", async (e) => {

            // Tombol Edit
            const tombolEdit = e.target.closest(".action-edit");

            if (tombolEdit) {
                const mentorId = tombolEdit.dataset.id;
                renderEditMentorView(mentorId);
                return;
            }

            // Tombol Hapus
            const tombolHapus = e.target.closest(".action-delete");

            if (tombolHapus) {
                const mentorId = tombolHapus.dataset.id;

                const konfirmasi = confirm(
                    "Apakah kamu yakin ingin menghapus data mentor ini?"
                );

                if (!konfirmasi) return;

                try {
                    const response = await fetch(
                        "http://localhost:8000/api_hapus_mentor.php",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                id: mentorId
                            })
                        }
                    );

                    const result = await response.json();

                    if (!result.success) {
                        alert(result.message);
                        return;
                    }

                    alert(result.message);
                    initAdminMentor();

                } catch (error) {
                    console.error("Gagal menghapus mentor:", error);
                    alert("Terjadi kesalahan saat menghapus data mentor.");
                }
            }
        });
    }

    renderTable(dataMentor);
}

// Inisialisasi awal saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
    initAdminMentor();
});