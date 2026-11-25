
import {
    renderTambahSiswaView,
    renderEditSiswaView
} from "./admin-tambah-siswa.js";

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
// TAMPILAN UTAMA TABEL SISWA
// ==================================================

export async function initAdminSiswa() {
    const mainContainer = document.getElementById("main-content-area");

    if (!mainContainer) return;

    mainContainer.innerHTML = `
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <div class="flex items-center gap-2 text-xs font-semibold text-slate-400 tracking-wider mb-1 uppercase">
                    <span>Kelola Pengguna</span>
                    <span>/</span>
                    <span class="text-indigo-600">Siswa</span>
                </div>
                <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Data Siswa</h1>
                <p class="text-xs text-slate-500 mt-0.5">Manajemen data didik aktif program inkubasi kelas kewirausahaan dan kejuruan.</p>
            </div>

            <div class="flex items-center gap-3">
                <div class="bg-red-50 border border-red-100 text-red-600 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-red-600"></span>
                    Total Terdaftar: <span id="totalSiswaCount">0 Siswa</span>
                </div>
                <button id="tambahSiswaBtn" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md shadow-red-600/25 transition flex items-center gap-1.5">
                    <span>+ Tambah Siswa</span>
                </button>
            </div>
        </div>

        <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="relative w-full md:w-96">
                <svg class="absolute left-3.5 top-3 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                <input type="search" id="searchSiswa" placeholder="Cari nama / NIS / kelas..." class="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-700 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition">
            </div>

            <div class="flex items-center gap-3 w-full md:w-auto justify-end">
                <select id="filterKelas" class="rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-xs font-semibold text-slate-600 focus:outline-none focus:border-indigo-500">
                    <option value="">Semua Program</option>
                </select>
                <span class="text-xs text-slate-400 whitespace-nowrap" id="infoPaginasiTeks">Menampilkan data siswa</span>
            </div>
        </div>

        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 tracking-wider">
                            <th class="py-4 px-6 w-16">NO</th>
                            <th class="py-4 px-6">NAMA</th>
                            <th class="py-4 px-6">NIS</th>
                            <th class="py-4 px-6">PROGRAM</th>
                            <th class="py-4 px-6">STATUS</th>
                            <th class="py-4 px-6 text-right">AKSI</th>
                        </tr>
                    </thead>
                    <tbody id="tabelSiswaBody" class="divide-y divide-slate-100 text-xs font-medium text-slate-600">
                    </tbody>
                </table>
            </div>

            <div class="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-white">
                <span id="infoHalaman">Halaman 1 dari 1</span>
                <div class="flex items-center gap-1.5" id="paginationContainer"></div>
            </div>
        </div>
    `;

    const searchInput = document.getElementById("searchSiswa");
    const filterKelas = document.getElementById("filterKelas");
    const tabelSiswaBody = document.getElementById("tabelSiswaBody");
    const tambahSiswaBtn = document.getElementById("tambahSiswaBtn");

    let dataSiswa = [];
    let currentPage = 1;

    const rowsPerPage = 10;

    // ==================================================
    // MEMUAT FILTER PROGRAM
    // ==================================================

    async function loadFilterKelas() {
        try {
            const response = await fetch(
                "http://localhost:8000/api/admin/api_program.php",
                {
                    headers: getAuthHeaders()
                }
            );

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message);
            }

            filterKelas.innerHTML = `
                <option value="">Semua Kelas</option>
                ${result.data.map(program => `
                    <option value="${program.nama_program}">
                        ${program.nama_program}
                    </option>
                `).join("")}
            `;

        } catch (error) {
            console.error("Gagal memuat filter kelas:", error);
        }
    }

    // ==================================================
    // MEMUAT DATA SISWA
    // ==================================================

    async function loadDataSiswa() {
        try {
            const response = await fetch(
                "http://localhost:8000/api/admin/api_siswa.php",
                {
                    headers: getAuthHeaders()
                }
            );

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message);
            }

            dataSiswa = result.data.map(siswa => ({
                id: siswa.id,
                inisial: siswa.nama
                    .split(" ")
                    .map(kata => kata[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase(),
                warnaBg: "bg-indigo-100 text-indigo-700",
                nama: siswa.nama,
                email: siswa.email,
                nis: siswa.nisn,
                kelas: siswa.nama_program,
                status: siswa.status_akun === "aktif"
                    ? "Aktif"
                    : "Tidak Aktif",
                status_akun: siswa.status_akun
            }));

            renderTable(dataSiswa);

            document.getElementById("totalSiswaCount").textContent =
                `${dataSiswa.length} Siswa`;

            document.getElementById("infoPaginasiTeks").textContent =
                `Menampilkan ${dataSiswa.length} siswa`;

        } catch (error) {
            console.error("Gagal mengambil data siswa:", error);

            tabelSiswaBody.innerHTML = `
                <tr>
                    <td colspan="6" class="py-8 text-center text-red-500">
                        Gagal memuat data siswa.
                    </td>
                </tr>
            `;
        }
    }

    // ==================================================
    // MENAMPILKAN TABEL
    // ==================================================

    function renderTable(data) {
        if (!tabelSiswaBody) return;

        const totalPages = Math.ceil(data.length / rowsPerPage);

        if (currentPage > totalPages && totalPages > 0) {
            currentPage = totalPages;
        }

        if (data.length === 0) {
            tabelSiswaBody.innerHTML = `
                <tr>
                    <td colspan="6" class="py-8 text-center text-slate-400">
                        Tidak ada data siswa ditemukan.
                    </td>
                </tr>
            `;

            document.getElementById("infoHalaman").textContent =
                "Halaman 0 dari 0";

            document.getElementById("paginationContainer").innerHTML = "";

            return;
        }

        const startIndex = (currentPage - 1) * rowsPerPage;

        const dataHalaman = data.slice(
            startIndex,
            startIndex + rowsPerPage
        );

        tabelSiswaBody.innerHTML = dataHalaman.map((siswa, index) => {
            const statusAktif =
                siswa.status_akun?.toLowerCase() === "aktif";

            return `
                <tr class="hover:bg-slate-50/80 transition">
                    <td class="py-4 px-6 text-slate-400 font-semibold">
                        ${startIndex + index + 1}
                    </td>

                    <td class="py-4 px-6">
                        <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-xl ${siswa.warnaBg} font-bold flex items-center justify-center text-xs shrink-0 shadow-sm">
                                ${siswa.inisial}
                            </div>
                            <div>
                                <p class="font-bold text-slate-800">${siswa.nama}</p>
                                <p class="text-[11px] text-slate-400">${siswa.email}</p>
                            </div>
                        </div>
                    </td>

                    <td class="py-4 px-6 font-mono text-slate-600">
                        ${siswa.nis}
                    </td>

                    <td class="py-4 px-6">
                        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">
                            <span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                            ${siswa.kelas}
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
                            <button title="Edit" class="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition action-edit" data-id="${siswa.id}">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                    <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5"/>
                                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1-4 1 1-4 9.5-9.5z"/>
                                </svg>
                            </button>

                            <button title="Hapus" class="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition action-delete" data-id="${siswa.id}">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6"/>
                                    <path d="M10 3h4a1 1 0 011 1v3H9V4a1 1 0 011-1zM4 7h16"/>
                                </svg>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join("");

        document.getElementById("infoHalaman").textContent =
            `Halaman ${currentPage} dari ${totalPages}`;

        renderPagination(totalPages);
    }

    // ==================================================
    // PAGINATION
    // ==================================================

    function renderPagination(totalPages) {
        const container = document.getElementById("paginationContainer");

        let buttons = `
            <button class="pagination-btn w-8 h-8 rounded-lg border border-slate-200"
                data-page="${currentPage - 1}"
                ${currentPage === 1 ? "disabled" : ""}>
                &lt;
            </button>
        `;

        for (let i = 1; i <= totalPages; i++) {
            buttons += `
                <button class="pagination-btn w-8 h-8 rounded-lg border ${
                    currentPage === i
                        ? "bg-indigo-600 text-white"
                        : "border-slate-200"
                }" data-page="${i}">
                    ${i}
                </button>
            `;
        }

        buttons += `
            <button class="pagination-btn w-8 h-8 rounded-lg border border-slate-200"
                data-page="${currentPage + 1}"
                ${currentPage === totalPages ? "disabled" : ""}>
                &gt;
            </button>
        `;

        container.innerHTML = buttons;

        container.querySelectorAll(".pagination-btn").forEach(button => {
            button.addEventListener("click", () => {
                const page = Number(button.dataset.page);

                if (page < 1 || page > totalPages) return;

                currentPage = page;
                filterData();
            });
        });
    }

    // ==================================================
    // PENCARIAN DAN FILTER
    // ==================================================

    function filterData(resetPage = false) {
        const keyword = searchInput.value.toLowerCase();
        const program = filterKelas.value;

        const filtered = dataSiswa.filter(siswa => {
            const cocokCari =
                siswa.nama.toLowerCase().includes(keyword) ||
                String(siswa.nis || "").toLowerCase().includes(keyword) ||
                String(siswa.kelas || "").toLowerCase().includes(keyword);

            const cocokProgram =
                program === "" || siswa.kelas === program;

            return cocokCari && cocokProgram;
        });

        if (resetPage) {
            currentPage = 1;
        }

        renderTable(filtered);
    }

    // ==================================================
    // EVENT EDIT DAN HAPUS
    // ==================================================

    tabelSiswaBody.addEventListener("click", async (e) => {
        const tombolEdit = e.target.closest(".action-edit");
        const tombolHapus = e.target.closest(".action-delete");

        if (tombolEdit) {
            const siswaId = tombolEdit.dataset.id;

            await renderEditSiswaView(
                siswaId,
                initAdminSiswa
            );

            return;
        }

        if (tombolHapus) {
            const siswaId = tombolHapus.dataset.id;

            const konfirmasi = confirm(
                "Apakah kamu yakin ingin menghapus data siswa ini?"
            );

            if (!konfirmasi) return;

            try {
                const response = await fetch(
                    "http://localhost:8000/api/admin/api_hapus_siswa.php",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            ...getAuthHeaders()
                        },
                        body: JSON.stringify({
                            id: siswaId
                        })
                    }
                );

                const result = await response.json();

                if (!result.success) {
                    throw new Error(result.message);
                }

                alert(result.message);

                await loadDataSiswa();

            } catch (error) {
                console.error("Gagal menghapus siswa:", error);
                alert(error.message);
            }
        }
    });

    // ==================================================
    // EVENT PENCARIAN DAN TOMBOL TAMBAH
    // ==================================================

    searchInput.addEventListener("input", () => {
        filterData(true);
    });

    filterKelas.addEventListener("change", () => {
        filterData(true);
    });

    tambahSiswaBtn.addEventListener("click", () => {
        renderTambahSiswaView(null, initAdminSiswa);
    });

    // ==================================================
    // INISIALISASI DATA
    // ==================================================

    await loadFilterKelas();
    await loadDataSiswa();
}

// ==================================================
// INISIALISASI HALAMAN
// ==================================================

document.addEventListener("DOMContentLoaded", () => {
    initAdminSiswa();
});
