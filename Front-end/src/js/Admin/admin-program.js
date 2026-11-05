document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchProgram");
    const filterProgram = document.getElementById("filterProgram");
    const tabelProgramBody = document.getElementById("tabelProgramBody");
    const refreshBtn = document.getElementById("refreshProgramBtn");
    const tambahProgramBtn = document.getElementById("tambahProgramBtn");

    // Data Mockup Sesuai Figma Kelola Program Utama
    const dummyProgram = [
        { id: 1, judul: "WEB Development", sub: "Pengembangan website dan aplikasi web.", status: "Aktif" },
        { id: 2, judul: "Desktop Development", sub: "Pengembangan aplikasi desktop.", status: "Aktif" },
        { id: 3, judul: "Computer Networking", sub: "Pembelajaran jaringan komputer.", status: "Aktif" }
    ];

    // Fungsi Render Tabel Program
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

    // Fungsi Filter & Pencarian
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

    // Tombol Tambah Program
    if (tambahProgramBtn) {
        tambahProgramBtn.addEventListener("click", () => {
            alert("Fitur tambah program baru akan segera dibuka.");
        });
    }

    // Tombol Refresh
    if (refreshBtn) {
        refreshBtn.addEventListener("click", () => {
            if (searchInput) searchInput.value = "";
            if (filterProgram) filterProgram.value = "";
            renderTable(dummyProgram);
        });
    }

    // Render awal saat halaman dimuat
    renderTable(dummyProgram);
});