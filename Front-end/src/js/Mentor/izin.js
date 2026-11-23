
/* =========================================================
   KELOLA PENGAJUAN IZIN MENTOR
   TERHUBUNG DENGAN DATABASE POSTGRESQL
========================================================= */

const API_URL = "http://localhost:8000/api/mentor";
const BACKEND_URL = "http://localhost:8000";
const MODAL_URL = "/component/Mentor/pop-up-izin.html";

let izinData = [];
let selectedIzinId = null;

// =========================================================
// FORMAT DATA
// =========================================================

const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";

    const date = new Date(tanggal + "T00:00:00");

    return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
};

const formatStatus = (status) => {
    const daftarStatus = {
        menunggu: "Menunggu Verifikasi",
        disetujui: "Disetujui",
        ditolak: "Ditolak"
    };

    return daftarStatus[status] || status;
};

const escapeHTML = (value) => {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
};

// =========================================================
// TAMPILKAN TABEL
// =========================================================

function renderTable(data) {
    const tbody = document.getElementById("table-izin-body");

    if (!tbody) {
        console.error("Elemen table-izin-body tidak ditemukan.");
        return;
    }

    if (!data.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-8 text-slate-400">
                    Tidak ada data permohonan izin.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = data.map((item, index) => {
        let badge = "";

        if (item.status === "menunggu") {
            badge = `
                <span class="px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[11px] font-bold">
                    Menunggu
                </span>`;
        } else if (item.status === "disetujui") {
            badge = `
                <span class="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold">
                    Disetujui
                </span>`;
        } else {
            badge = `
                <span class="px-3 py-1 rounded-full bg-red-50 text-red-600 text-[11px] font-bold">
                    Ditolak
                </span>`;
        }

        return `
            <tr class="hover:bg-slate-50/80 transition-colors">

                <td class="py-4 px-6 text-slate-400 font-semibold">
                    ${index + 1}
                </td>

                <td class="py-4 px-6">
                    <div class="font-bold text-slate-900">
                        ${escapeHTML(item.nama_siswa)}
                    </div>
                    <div class="text-[10px] text-slate-400">
                        NISN: ${escapeHTML(item.nis)}
                    </div>
                </td>

                <td class="py-4 px-6">
                    <span class="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">
                        ${escapeHTML(item.nama_program)}
                    </span>
                </td>

                <td class="py-4 px-6 text-slate-600">
                    ${formatTanggal(item.waktu_pengajuan?.split(" ")[0])}
                </td>

                <td class="py-4 px-6 text-slate-600">
                    ${formatTanggal(item.tanggal_izin)}
                </td>

                <td class="py-4 px-6 max-w-xs">
                    <div class="font-bold text-slate-900 truncate">
                        ${escapeHTML(item.alasan)}
                    </div>

                    <div class="text-[10px] text-slate-400 mt-1">
                        ${item.bukti_file ? "📎 Ada lampiran" : "Tidak ada lampiran"}
                    </div>
                </td>

                <td class="py-4 px-6">
                    ${badge}
                </td>

                <td class="py-4 px-6 text-center">
                    <button
                        type="button"
                        data-izin-id="${Number(item.id)}"
                        class="btn-detail-izin px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-[11px] font-semibold rounded-xl cursor-pointer">
                        Lihat
                    </button>
                </td>

            </tr>
        `;
    }).join("");
}

// =========================================================
// AMBIL DATA DARI DATABASE
// =========================================================

async function loadIzinData() {
    const tbody = document.getElementById("table-izin-body");

    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-8 text-slate-400">
                    Memuat data pengajuan izin...
                </td>
            </tr>
        `;
    }

    try {
        const response = await fetch(`${API_URL}/api_izin_mentor.php`, {
            method: "GET",
            credentials: "include"
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Gagal mengambil data.");
        }

        izinData = result.data || [];

        renderTable(izinData);

    } catch (error) {
        console.error("Gagal memuat pengajuan izin:", error);

        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center py-8 text-red-500">
                        Gagal memuat data pengajuan izin.
                    </td>
                </tr>
            `;
        }
    }
}

// =========================================================
// FILTER DAN EVENT TOMBOL TABEL
// =========================================================

function setupEventListeners() {
    const searchInput = document.getElementById("search-input");
    const filterStatus = document.getElementById("filter-status");
    const btnSearch = document.getElementById("btn-search");
    const btnReset = document.getElementById("btn-reset");
    const tbody = document.getElementById("table-izin-body");

    function applyFilter() {
        const keyword = searchInput?.value.toLowerCase().trim() || "";
        const status = filterStatus?.value || "all";

        const filtered = izinData.filter(item => {
            const cocokKeyword =
                (item.nama_siswa || "").toLowerCase().includes(keyword) ||
                (item.nis || "").toLowerCase().includes(keyword) ||
                (item.alasan || "").toLowerCase().includes(keyword);

            const cocokStatus =
                status === "all" || item.status === status;

            return cocokKeyword && cocokStatus;
        });

        renderTable(filtered);
    }

    if (btnSearch) btnSearch.onclick = applyFilter;

    if (searchInput) {
        searchInput.onkeyup = (event) => {
            if (event.key === "Enter") applyFilter();
        };
    }

    if (filterStatus) filterStatus.onchange = applyFilter;

    if (btnReset) {
        btnReset.onclick = () => {
            if (searchInput) searchInput.value = "";
            if (filterStatus) filterStatus.value = "all";

            renderTable(izinData);
        };
    }

    if (tbody) {
        tbody.onclick = (event) => {
            const tombol = event.target.closest(".btn-detail-izin");

            if (!tombol) return;

            openModalDetail(tombol.dataset.izinId);
        };
    }
}

// =========================================================
// MEMBUAT URL FILE
// =========================================================

function buatUrlFile(pathFile) {
    if (!pathFile) return null;

    // Jika API mengirim URL lengkap
    if (/^https?:\/\//i.test(pathFile)) {
        return pathFile;
    }

    // Jika API mengirim path relatif
    const pathBersih = pathFile.replace(/^\/+/, "");

    return `${BACKEND_URL}/${pathBersih}`;
}

// =========================================================
// BUKA POP-UP DETAIL
// =========================================================

async function openModalDetail(id) {
    const item = izinData.find(data => Number(data.id) === Number(id));

    if (!item) {
        console.error("Data pengajuan tidak ditemukan:", id);
        alert("Data pengajuan tidak ditemukan.");
        return;
    }

    selectedIzinId = Number(id);

    const container = document.getElementById("izin-modal-container");

    if (!container) {
        console.error("izin-modal-container tidak ditemukan.");
        alert("Tempat pop-up belum tersedia.");
        return;
    }

    // Muat modal jika belum tersedia
    if (!document.getElementById("modal-izin")) {
        try {
            const response = await fetch(MODAL_URL);

            if (!response.ok) {
                throw new Error(`Gagal memuat modal: ${response.status}`);
            }

            container.innerHTML = await response.text();

            if (!document.getElementById("modal-izin")) {
                throw new Error("Elemen modal-izin tidak ditemukan dalam file HTML.");
            }

            setupModalEventListeners();

        } catch (error) {
            console.error("Gagal memuat pop-up:", error);
            alert("Pop-up gagal dimuat. Periksa file pop-up-izin.html.");
            return;
        }
    }

    // =====================================================
    // ISI DATA MODAL
    // =====================================================

    const isi = (elementId, value) => {
        const element = document.getElementById(elementId);

        if (element) {
            element.textContent = value ?? "-";
        }
    };

    isi("modal-id-pengajuan", `#IZN-${item.id}`);
    isi("modal-siswa-nama", item.nama_siswa);
    isi("modal-siswa-nis", item.nis);
    isi("modal-siswa-program", item.nama_program);

    isi(
        "modal-siswa-initial",
        (item.nama_siswa || "-")
            .split(" ")
            .map(nama => nama[0])
            .join("")
            .toUpperCase()
    );

    isi(
        "modal-tgl-pengajuan",
        formatTanggal(item.waktu_pengajuan?.split(" ")[0])
    );

    isi("modal-tgl-izin", formatTanggal(item.tanggal_izin));
    isi("modal-kategori-izin", "-");
    isi("modal-alasan-teks", item.alasan);

    // =====================================================
    // TOMBOL LIHAT DAN DOWNLOAD BUKTI
    // =====================================================

    const namaFileElement = document.getElementById("modal-lampiran-nama");
    const iconFileElement = document.getElementById("modal-lampiran-icon");
    const btnLihatBukti = document.getElementById("btn-lihat-bukti");
    const btnDownloadBukti = document.getElementById("btn-download-bukti");

    if (item.bukti_file) {
        const urlFile = buatUrlFile(item.bukti_file);
        const namaFile = decodeURIComponent(
            urlFile.split("/").pop().split("?")[0]
        );

        if (namaFileElement) {
            namaFileElement.textContent = namaFile;
        }

        if (iconFileElement) {
            iconFileElement.textContent =
                namaFile.split(".").pop().toUpperCase();
        }

        // LIHAT FILE
        if (btnLihatBukti) {
            btnLihatBukti.disabled = false;

            btnLihatBukti.onclick = () => {
                window.open(urlFile, "_blank", "noopener,noreferrer");
            };
        }

        // DOWNLOAD FILE
        if (btnDownloadBukti) {
            btnDownloadBukti.disabled = false;
        
            btnDownloadBukti.onclick = async () => {
                try {
                    const urlDownload =
                        `${BACKEND_URL}/api/mentor/download_bukti_izin.php?id=${item.id}`;
                
                    const response = await fetch(urlDownload, {
                        method: "GET",
                        credentials: "include"
                    });
                
                    if (!response.ok) {
                        const pesan = await response.text();
                        throw new Error(pesan || "File gagal diunduh.");
                    }
                
                    const blob = await response.blob();
                
                    if (blob.size === 0) {
                        throw new Error("File yang diterima kosong.");
                    }
                
                    const blobUrl = URL.createObjectURL(blob);
                
                    const link = document.createElement("a");
                    link.href = blobUrl;
                    link.download = namaFile;
                
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                
                    setTimeout(() => {
                        URL.revokeObjectURL(blobUrl);
                    }, 1500);
                
                } catch (error) {
                    console.error("Gagal mengunduh bukti:", error);
                    alert("Gagal mengunduh bukti: " + error.message);
                }
            };
        }

    } else {
        isi("modal-lampiran-nama", "Tidak ada lampiran");

        if (iconFileElement) {
            iconFileElement.textContent = "-";
        }

        if (btnLihatBukti) btnLihatBukti.disabled = true;
        if (btnDownloadBukti) btnDownloadBukti.disabled = true;
    }

    // =====================================================
    // STATUS PENGAJUAN
    // =====================================================

    const badge = document.getElementById("modal-status-badge");

    if (badge) {
        if (item.status === "menunggu") {
            badge.innerHTML = `
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200/60">
                    <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                    Menunggu Verifikasi
                </span>
            `;
        } else if (item.status === "disetujui") {
            badge.innerHTML = `
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                    Disetujui
                </span>
            `;
        } else {
            badge.innerHTML = `
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200/60">
                    Ditolak
                </span>
            `;
        }
    }

    // =====================================================
    // CATATAN MENTOR
    // =====================================================

    const catatan = document.getElementById("input-catatan-mentor");

    if (catatan) {
        catatan.value = item.catatan_mentor || "";
    }

    // =====================================================
    // STATUS TOMBOL AKSI
    // =====================================================

    const btnApprove = document.getElementById("btn-approve-modal");
    const btnReject = document.getElementById("btn-reject-modal");

    const sudahDiproses = item.status !== "menunggu";

    if (btnApprove) btnApprove.disabled = sudahDiproses;
    if (btnReject) btnReject.disabled = sudahDiproses;

    // TAMPILKAN MODAL
    const modal = document.getElementById("modal-izin");

    if (modal) {
        modal.classList.remove("hidden");
    } else {
        console.error("Elemen modal-izin tidak ditemukan.");
    }
}

// =========================================================
// EVENT POP-UP
// =========================================================


function setupModalEventListeners() {
    const modal = document.getElementById("modal-izin");

    const tutupModal = () => {
        modal?.classList.add("hidden");
    };

    const btnClose = document.getElementById("modal-close-btn");
    const btnKembali = document.getElementById("modal-kembali-btn");

    if (btnClose) {
        btnClose.onclick = tutupModal;
    }

    if (btnKembali) {
        btnKembali.onclick = tutupModal;
    }

    if (modal) {
        modal.onclick = (event) => {
            if (event.target === modal) {
                tutupModal();
            }
        };
    }

    const btnApprove = document.getElementById("btn-approve-modal");
    const btnReject = document.getElementById("btn-reject-modal");

    // Fungsi memproses pengajuan
    async function prosesIzin(aksi) {
        if (!selectedIzinId) {
            alert("Pengajuan belum dipilih.");
            return;
        }

        const catatanElement = document.getElementById(
            "input-catatan-mentor"
        );

        const catatan = catatanElement?.value.trim() || "";

        const konfirmasi = aksi === "disetujui"
            ? "Apakah kamu yakin ingin menyetujui pengajuan izin ini?"
            : "Apakah kamu yakin ingin menolak pengajuan izin ini?";

        if (!confirm(konfirmasi)) return;

        try {
            if (btnApprove) btnApprove.disabled = true;
            if (btnReject) btnReject.disabled = true;

            const response = await fetch(
                `${API_URL}/api_proses_izin.php`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id: selectedIzinId,
                        aksi: aksi,
                        catatan: catatan
                    })
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Gagal memproses pengajuan."
                );
            }

            alert(result.message);

            tutupModal();

            // Muat ulang data tabel
            await loadIzinData();

        } catch (error) {
            console.error("Proses pengajuan gagal:", error);
            alert(error.message);

        } finally {
            if (btnApprove) btnApprove.disabled = false;
            if (btnReject) btnReject.disabled = false;
        }
    }

    if (btnApprove) {
        btnApprove.onclick = () => prosesIzin("disetujui");
    }

    if (btnReject) {
        btnReject.onclick = () => prosesIzin("ditolak");
    }
}

// =========================================================
// INISIALISASI
// =========================================================

export function initMentorIzin() {
    console.log("Modul Kelola Pengajuan Izin Mentor dimuat.");

    setupEventListeners();
    loadIzinData();
}
