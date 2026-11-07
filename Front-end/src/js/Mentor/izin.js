/* =========================================================
LOGIKA HALAMAN KELOLA PERMOHONAN IZIN MENTOR & POP-UP DETAIL
========================================================= */

let izinData = [
    {
        id: 1,
        nama: "Ahmad Fauzi",
        nis: "1234567801",
        program: "Web Development",
        tglPengajuan: "20 Oktober 2026",
        tglIzin: "20 Oktober 2026",
        kategori: "Sakit (Medical)",
        alasan: "Sakit demam tinggi dan disarankan istirahat total oleh dokter klinik pratama.",
        keterangan: "Surat_Keterangan_Dokter_AhmadFauzi.pdf",
        status: "Menunggu"
    },
    {
        id: 2,
        nama: "Siti Aisyah",
        nis: "1234567802",
        program: "Web Development",
        tglPengajuan: "19 Oktober 2026",
        tglIzin: "19 Oktober 2026",
        kategori: "Keluarga",
        alasan: "Menghadiri acara keluarga mendadak di luar kota.",
        keterangan: "Surat_Izin_Keluarga.pdf",
        status: "Disetujui"
    },
    {
        id: 3,
        nama: "Budi Santoso",
        nis: "1234567803",
        program: "Web Development",
        tglPengajuan: "18 Oktober 2026",
        tglIzin: "18 Oktober 2026",
        kategori: "Urusan Sekolah",
        alasan: "Mengikuti lomba kompetensi siswa tingkat daerah mewakili sekolah.",
        keterangan: "Surat_Tugas_Lomba.pdf",
        status: "Ditolak"
    },
    {
        id: 4,
        nama: "Rina Febriani",
        nis: "1234567804",
        program: "Web Development",
        tglPengajuan: "17 Oktober 2026",
        tglIzin: "17 Oktober 2026",
        kategori: "Keperluan Lain",
        alasan: "Menghadiri pernikahan saudara kandung.",
        keterangan: "Undangan_Resmi.pdf",
        status: "Disetujui"
    }
];

let selectedIzinId = null;

export function initMentorIzin() {
    console.log("Modul Kelola Permohonan Izin Mentor berhasil dimuat.");
    renderTable(izinData);
    setupEventListeners();
}

function renderTable(data) {
    const tbody = document.getElementById("table-izin-body");
    if (!tbody) return;

    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center py-8 text-slate-400">Tidak ada data permohonan izin yang ditemukan.</td></tr>`;
        return;
    }

    tbody.innerHTML = data.map((item, index) => {
        let statusBadge = "";
        if (item.status === "Menunggu") {
            statusBadge = `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-600"><span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Menunggu</span>`;
        } else if (item.status === "Disetujui") {
            statusBadge = `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600"><span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Disetujui</span>`;
        } else if (item.status === "Ditolak") {
            statusBadge = `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-red-50 text-red-600"><span class="w-1.5 h-1.5 rounded-full bg-red-600"></span> Ditolak</span>`;
        }

        return `
            <tr class="hover:bg-slate-50/80 transition-colors">
                <td class="py-4 px-6 text-slate-400 font-semibold">${index + 1}</td>
                <td class="py-4 px-6">
                    <div class="font-bold text-slate-900">${item.nama}</div>
                    <div class="text-[10px] text-slate-400 font-medium">NIS: ${item.nis}</div>
                </td>
                <td class="py-4 px-6">
                    <span class="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">${item.program}</span>
                </td>
                <td class="py-4 px-6 text-slate-600 font-medium">${item.tglPengajuan}</td>
                <td class="py-4 px-6 text-slate-600 font-medium">${item.tglIzin}</td>
                <td class="py-4 px-6 max-w-xs">
                    <div class="font-bold text-slate-900 truncate">${item.alasan}</div>
                    <div class="text-[10px] text-slate-400 flex items-center gap-1 font-medium mt-0.5">📎 ${item.keterangan}</div>
                </td>
                <td class="py-4 px-6">${statusBadge}</td>
                <td class="py-4 px-6 text-center">
                    <button onclick="window.openModalDetail(${item.id})" class="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-[11px] font-semibold rounded-xl transition-colors shadow-sm">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                        Lihat
                    </button>
                </td>
            </tr>
        `;
    }).join("");
}

function setupEventListeners() {
    const searchInput = document.getElementById("search-input");
    const filterStatus = document.getElementById("filter-status");
    const btnSearch = document.getElementById("btn-search");
    const btnReset = document.getElementById("btn-reset");

    const applyFilter = () => {
        let keyword = searchInput ? searchInput.value.toLowerCase() : "";
        let statusVal = filterStatus ? filterStatus.value : "all";

        let filtered = izinData.filter(item => {
            let matchKeyword = item.nama.toLowerCase().includes(keyword) || 
                               item.nis.includes(keyword) || 
                               item.alasan.toLowerCase().includes(keyword);
            let matchStatus = statusVal === "all" || item.status === statusVal;
            return matchKeyword && matchStatus;
        });

        renderTable(filtered);
    };

    if (btnSearch) btnSearch.addEventListener("click", applyFilter);
    if (searchInput) searchInput.addEventListener("keyup", (e) => {
        if (e.key === "Enter") applyFilter();
    });
    if (filterStatus) filterStatus.addEventListener("change", applyFilter);

    if (btnReset) {
        btnReset.addEventListener("click", () => {
            if (searchInput) searchInput.value = "";
            if (filterStatus) filterStatus.value = "all";
            renderTable(izinData);
        });
    }

    // Fungsi Global untuk Membuka & Mengelola Modal Pop-up secara Dinamis
    window.openModalDetail = async (id) => {
        selectedIzinId = id;
        const item = izinData.find(d => d.id === id);
        if (!item) return;

        const container = document.getElementById("izin-modal-container");
        if (container && !container.innerHTML.trim()) {
            try {
                const response = await fetch('/component/Mentor/pop-up-izin.html');
                if (response.ok) {
                    container.innerHTML = await response.text();
                    setupModalEventListeners();
                } else {
                    console.error("Gagal memuat komponen pop-up izin.");
                }
            } catch (err) {
                console.error("Kesalahan jaringan saat memuat modal izin:", err);
            }
        }

        // Isi data dinamis ke dalam elemen pop-up modal
        document.getElementById("modal-id-pengajuan").textContent = `#IZN-20251020-00${item.id}`;
        document.getElementById("modal-siswa-nama").textContent = item.nama;
        document.getElementById("modal-siswa-nis").textContent = item.nis;
        document.getElementById("modal-siswa-program").textContent = item.program;
        document.getElementById("modal-siswa-initial").textContent = item.nama.split(" ").map(n => n[0]).join("").toUpperCase();
        document.getElementById("modal-tgl-pengajuan").textContent = item.tglPengajuan;
        document.getElementById("modal-tgl-izin").textContent = item.tglIzin;
        document.getElementById("modal-kategori-izin").textContent = item.kategori;
        document.getElementById("modal-alasan-teks").textContent = item.alasan;
        document.getElementById("modal-lampiran-nama").textContent = item.keterangan;

        let badgeHtml = "";
        if (item.status === "Menunggu") {
            badgeHtml = `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200/60"><span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span> Menunggu Verifikasi</span>`;
        } else if (item.status === "Disetujui") {
            badgeHtml = `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200/60"><span class="w-2 h-2 rounded-full bg-emerald-600"></span> Disetujui</span>`;
        } else if (item.status === "Ditolak") {
            badgeHtml = `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-200/60"><span class="w-2 h-2 rounded-full bg-red-600"></span> Ditolak</span>`;
        }
        document.getElementById("modal-status-badge").innerHTML = badgeHtml;

        const modalDetail = document.getElementById("modal-izin");
        if (modalDetail) modalDetail.classList.remove("hidden");
    };
}

function setupModalEventListeners() {
    const closeBtn = document.getElementById("modal-close-btn");
    const kembaliBtn = document.getElementById("modal-kembali-btn");
    const modalDetail = document.getElementById("modal-izin");
    const btnApproveModal = document.getElementById("btn-approve-modal");
    const btnRejectModal = document.getElementById("btn-reject-modal");

    if (closeBtn && modalDetail) {
        closeBtn.addEventListener("click", () => modalDetail.classList.add("hidden"));
    }

    if (kembaliBtn && modalDetail) {
        kembaliBtn.addEventListener("click", () => modalDetail.classList.add("hidden"));
    }

    if (modalDetail) {
        modalDetail.addEventListener("click", (e) => {
            if (e.target === modalDetail) modalDetail.classList.add("hidden");
        });
    }

    if (btnApproveModal) {
        btnApproveModal.onclick = () => {
            updateStatus(selectedIzinId, "Disetujui");
        };
    }

    if (btnRejectModal) {
        btnRejectModal.onclick = () => {
            updateStatus(selectedIzinId, "Ditolak");
        };
    }
}

function updateStatus(id, newStatus) {
    let item = izinData.find(d => d.id === id);
    if (item) {
        item.status = newStatus;
        alert(`Status izin berhasil diubah menjadi: ${newStatus}`);
        const modalDetail = document.getElementById("modal-izin");
        if (modalDetail) modalDetail.classList.add("hidden");
        renderTable(izinData);
    }
}

// Inisialisasi otomatis saat skrip dimuat
document.addEventListener("DOMContentLoaded", () => {
    initMentorIzin();
});