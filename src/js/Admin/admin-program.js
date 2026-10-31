import { supabase } from "../supabase.js";

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchProgram");
    const filterKelas = document.getElementById("filterKelasProgram");
    const tabelProgramBody = document.getElementById("tabelProgramBody");
    const refreshBtn = document.getElementById("refreshProgramBtn");
    const tambahJadwalBtn = document.getElementById("tambahJadwalBtn");

    // Data Mockup Sesuai Figma Kelola Jadwal Program
    const dummyProgram = [
        { id: 1, kode: "01", judul: "Kelas 1 - Pembekalan", sub: "Modul Pengantar Inkubasi Dasar", tanggal: "20-10-2025", waktu: "08:00 - 10:00", kelas: "Kelas 1", status: "Aktif" },
        { id: 2, kode: "02", judul: "Kelas 2 - Project", sub: "Perancangan MVP & Prototype Bisnis", tanggal: "21-10-2025", waktu: "10:15 - 12:15", kelas: "Kelas 2", status: "Aktif" },
        { id: 3, kode: "03", judul: "Kelas 3 - Evaluasi", sub: "Peer Review & Validasi Finansial", tanggal: "23-10-2025", waktu: "13:00 - 15:00", kelas: "Kelas 3", status: "Aktif" },
        { id: 4, kode: "04", judul: "Kelas 4 - Penguatan", sub: "Coaching Mentoring Khusus Pitches", tanggal: "27-10-2025", waktu: "15:15 - 17:00", kelas: "Kelas 4", status: "Aktif" },
        { id: 5, kode: "05", judul: "Kelas 5 - Penutupan", sub: "Demo Day & Penyerahan Sertifikasi", tanggal: "29-10-2025", waktu: "09:00 - 11:00", kelas: "Kelas 5", status: "Aktif" }
    ];

    // Fungsi Render Tabel Jadwal Program
    function renderTable(data) {
        if (!tabelProgramBody) return;
        
        if (data.length === 0) {
            tabelProgramBody.innerHTML = `<tr><td colspan="7" class="py-8 text-center text-slate-400">Tidak ada data jadwal program ditemukan.</td></tr>`;
            return;
        }

        tabelProgramBody.innerHTML = data.map((prog, index) => `
            <tr class="hover:bg-slate-50/80 transition">
                <td class="py-4 px-6 text-slate-400 font-semibold">${index + 1}</td>
                <td class="py-4 px-6">
                    <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 font-extrabold flex items-center justify-center text-xs shrink-0 shadow-sm">
                            ${prog.kode}
                        </div>
                        <div>
                            <p class="font-bold text-slate-800">${prog.judul}</p>
                            <p class="text-[11px] text-slate-400">${prog.sub}</p>
                        </div>
                    </div>
                </td>
                <td class="py-4 px-6 text-slate-600 font-medium flex items-center gap-1.5 pt-6">
                    📅 ${prog.tanggal}
                </td>
                <td class="py-4 px-6">
                    <span class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-mono text-[11px] font-bold">
                        🕒 ${prog.waktu}
                    </span>
                </td>
                <td class="py-4 px-6">
                    <span class="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-[11px] font-bold">
                        ${prog.kelas}
                    </span>
                </td>
                <td class="py-4 px-6">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> ${prog.status}
                    </span>
                </td>
                <td class="py-4 px-6 text-right">
                    <div class="flex items-center justify-end gap-2">
                        <button title="Lihat Detail" class="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition action-view" data-id="${prog.id}">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                        </button>
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
        const keyword = searchInput.value.toLowerCase();
        const selectedKelas = filterKelas.value;

        const filtered = dummyProgram.filter(prog => {
            const matchKeyword = prog.judul.toLowerCase().includes(keyword) || prog.sub.toLowerCase().includes(keyword) || prog.tanggal.includes(keyword);
            const matchKelas = selectedKelas === "" || prog.kelas === selectedKelas;
            return matchKeyword && matchKelas;
        });

        renderTable(filtered);
    }

    if (searchInput) searchInput.addEventListener("input", filterData);
    if (filterKelas) filterKelas.addEventListener("change", filterData);

    // Tombol Tambah Jadwal
    if (tambahJadwalBtn) {
        tambahJadwalBtn.addEventListener("click", () => {
            alert("Fitur tambah jadwal program baru akan segera dibuka.");
        });
    }

    // Tombol Refresh
    if (refreshBtn) {
        refreshBtn.addEventListener("click", () => {
            searchInput.value = "";
            filterKelas.value = "";
            renderTable(dummyProgram);
        });
    }

    // Render awal saat halaman dimuat
    renderTable(dummyProgram);
});