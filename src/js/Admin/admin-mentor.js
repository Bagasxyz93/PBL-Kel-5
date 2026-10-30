import { supabase } from "./supabase.js";

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchMentor");
    const filterBidang = document.getElementById("filterBidang");
    const tabelMentorBody = document.getElementById("tabelMentorBody");
    const tambahGuruBtn = document.getElementById("tambahGuruBtn");

    // Data Mockup Sesuai Figma Kelola Data Mentor
    const dummyMentor = [
        { id: 1, inisial: "PR", warnaBg: "bg-purple-100 text-purple-700", nama: "Ibu Pur", email: "pur.mentor@si-in.sch.id", nip: "198701012006042001", bidang: "Matematika / Logika", status: "Aktif" },
        { id: 2, inisial: "RN", warnaBg: "bg-blue-100 text-blue-700", nama: "Ibu Rina", email: "rina.mentor@si-in.sch.id", nip: "198805122010021002", bidang: "Pemrograman Web", status: "Aktif" },
        { id: 3, inisial: "UP", warnaBg: "bg-indigo-100 text-indigo-700", nama: "Ibu Upik", email: "upik.mentor@si-in.sch.id", nip: "199201082014032005", bidang: "UI/UX Design", status: "Aktif" },
        { id: 4, inisial: "SN", warnaBg: "bg-emerald-100 text-emerald-700", nama: "Bapak Sanipon", email: "prawit.mentor@si-in.sch.id", nip: "198904242015031001", bidang: "Cloud & Data", status: "Aktif" }
    ];

    // Fungsi Render Tabel Mentor
    function renderTable(data) {
        if (!tabelMentorBody) return;
        
        if (data.length === 0) {
            tabelMentorBody.innerHTML = `<tr><td colspan="6" class="py-8 text-center text-slate-400">Tidak ada data mentor ditemukan.</td></tr>`;
            return;
        }

        tabelMentorBody.innerHTML = data.map((mentor, index) => `
            <tr class="hover:bg-slate-50/80 transition">
                <td class="py-4 px-6 text-slate-400 font-semibold">${index + 1}</td>
                <td class="py-4 px-6">
                    <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-xl ${mentor.warnaBg} font-bold flex items-center justify-center text-xs shrink-0 shadow-sm">
                            ${mentor.inisial}
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
                        <span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span> ${mentor.bidang}
                    </span>
                </td>
                <td class="py-4 px-6">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> ${mentor.status}
                    </span>
                </td>
                <td class="py-4 px-6 text-right">
                    <div class="flex items-center justify-end gap-2">
                        <button title="Lihat Detail" class="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition action-view" data-id="${mentor.id}">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                        </button>
                        <button title="Edit" class="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition action-edit" data-id="${mentor.id}">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                        </button>
                        <button title="Hapus" class="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition action-delete" data-id="${mentor.id}">
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
        const selectedBidang = filterBidang.value;

        const filtered = dummyMentor.filter(mentor => {
            const matchKeyword = mentor.nama.toLowerCase().includes(keyword) || mentor.nip.includes(keyword) || mentor.email.toLowerCase().includes(keyword);
            const matchBidang = selectedBidang === "" || mentor.bidang === selectedBidang;
            return matchKeyword && matchBidang;
        });

        renderTable(filtered);
    }

    if (searchInput) searchInput.addEventListener("input", filterData);
    if (filterBidang) filterBidang.addEventListener("change", filterData);

    // Tombol Tambah Guru
    if (tambahGuruBtn) {
        tambahGuruBtn.addEventListener("click", () => {
            alert("Fitur tambah data guru/mentor baru akan segera dibuka.");
        });
    }

    // Render awal saat halaman dimuat
    renderTable(dummyMentor);
});