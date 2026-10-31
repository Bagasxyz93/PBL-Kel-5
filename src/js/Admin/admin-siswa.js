import { supabase } from "../supabase.js";

// Fungsi untuk menginisialisasi data tabel siswa
function initAdminSiswa() {
    const searchInput = document.getElementById("searchSiswa");
    const filterKelas = document.getElementById("filterKelas");
    const tabelSiswaBody = document.getElementById("tabelSiswaBody");
    const refreshBtn = document.getElementById("refreshBtn");
    const tambahSiswaBtn = document.getElementById("tambahSiswaBtn");

    // Jika tabelSiswaBody belum ada di DOM, tunggu sebentar lalu coba lagi
    if (!tabelSiswaBody) {
        setTimeout(initAdminSiswa, 100);
        return;
    }

    // Data Mockup Sesuai Figma Kelola Data Siswa
    const dummySiswa = [
        { id: 1, inisial: "RI", warnaBg: "bg-indigo-100 text-indigo-700", nama: "Rifki Febrian", email: "rifki.febrian@inkubasi.sch.id", nis: "1234567801", kelas: "Kelas 1", status: "Aktif" },
        { id: 2, inisial: "MU", warnaBg: "bg-blue-100 text-blue-700", nama: "Muhammad Bagas", email: "muhammad.bagas@inkubasi.sch.id", nis: "1234567802", kelas: "Kelas 1", status: "Aktif" },
        { id: 3, inisial: "BS", warnaBg: "bg-indigo-100 text-indigo-700", nama: "Bagaskara", email: "bagaska.ra@inkubasi.sch.id", nis: "1234567803", kelas: "Kelas 2", status: "Aktif" },
        { id: 4, inisial: "NR", warnaBg: "bg-purple-100 text-purple-700", nama: "Nerazuriancta Purnama", email: "nera.zuriancta@inkubasi.sch.id", nis: "1234567804", kelas: "Kelas 2", status: "Aktif" },
        { id: 5, inisial: "AP", warnaBg: "bg-blue-100 text-blue-700", nama: "Andi Pratama", email: "andi.pratama@inkubasi.sch.id", nis: "1234567805", kelas: "Kelas 3", status: "Aktif" }
    ];

    // Fungsi Render Tabel
    function renderTable(data) {
        // DIPERBAIKI: Menggunakan (data.length === 0)
        if (data.length === 0) {
            tabelSiswaBody.innerHTML = `<tr><td colspan="6" class="py-8 text-center text-slate-400">Tidak ada data siswa ditemukan.</td></tr>`;
            return;
        }

        tabelSiswaBody.innerHTML = data.map((siswa, index) => `
            <tr class="hover:bg-slate-50/80 transition">
                <td class="py-4 px-6 text-slate-400 font-semibold">${index + 1}</td>
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
                <td class="py-4 px-6 font-mono text-slate-600">${siswa.nis}</td>
                <td class="py-4 px-6">
                    <span class="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-[11px] font-bold">
                        ${siswa.kelas}
                    </span>
                </td>
                <td class="py-4 px-6">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> ${siswa.status}
                    </span>
                </td>
                <td class="py-4 px-6 text-right">
                    <div class="flex items-center justify-end gap-2">
                        <button title="Lihat Detail" class="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition action-view" data-id="${siswa.id}">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                        </button>
                        <button title="Edit" class="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition action-edit" data-id="${siswa.id}">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                        </button>
                        <button title="Hapus" class="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition action-delete" data-id="${siswa.id}">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                    </div>
                </td>
            </tr>
        `).join("");
    }

    // Fungsi Filter & Pencarian
    function filterData() {
        const keyword = searchInput ? searchInput.value.toLowerCase() : "";
        const selectedKelas = filterKelas ? filterKelas.value : "";

        const filtered = dummySiswa.filter(siswa => {
            const matchKeyword = siswa.nama.toLowerCase().includes(keyword) || siswa.nis.includes(keyword) || siswa.email.toLowerCase().includes(keyword);
            const matchKelas = selectedKelas === "" || siswa.kelas === selectedKelas;
            return matchKeyword && matchKelas;
        });

        renderTable(filtered);
    }

    if (searchInput) searchInput.addEventListener("input", filterData);
    if (filterKelas) filterKelas.addEventListener("change", filterData);

    if (tambahSiswaBtn) {
        tambahSiswaBtn.addEventListener("click", () => {
            alert("Fitur tambah siswa baru akan segera dibuka.");
        });
    }

    if (refreshBtn) {
        refreshBtn.addEventListener("click", () => {
            if (searchInput) searchInput.value = "";
            if (filterKelas) filterKelas.value = "";
            renderTable(dummySiswa);
        });
    }

    // Render awal data dummy
    renderTable(dummySiswa);
}

// Panggil fungsi inisialisasi
initAdminSiswa();