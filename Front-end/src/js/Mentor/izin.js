
/* =========================================================
   KELOLA PENGAJUAN IZIN MENTOR
   TERHUBUNG DENGAN DATABASE POSTGRESQL
========================================================= */

const API_URL = "http://localhost:8000/api/mentor";
const BACKEND_URL = "http://localhost:8000";
const MODAL_URL = "/component/Mentor/pop-up-izin.html";

let izinData = [];
let selectedIzinId = null;

let currentPage = 1;
const dataPerPage = 10;

// =========================================================
// TOKEN AUTENTIKASI PER TAB
// =========================================================

function getAuthHeaders(extraHeaders = {}) {
    const token = sessionStorage.getItem("authToken");

    if (!token) {
        throw new Error("Token login tidak ditemukan. Silakan login kembali.");
    }

    return {
        ...extraHeaders,
        "Authorization": `Bearer ${token}`
    };
}

// =========================================================
// FORMAT DATA
// =========================================================

function tanggalHariIni() {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Jakarta",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).format(new Date());
}

function ambilTanggal(value) {
    if (!value) return "";

    return String(value).replace("T", " ").split(" ")[0];
}

function formatTanggal(tanggal) {
    if (!tanggal) return "-";

    const tanggalBersih = ambilTanggal(tanggal);
    const bagian = tanggalBersih.split("-");

    if (bagian.length !== 3) return "-";

    const date = new Date(
        Number(bagian[0]),
        Number(bagian[1]) - 1,
        Number(bagian[2])
    );

    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
}

function formatTanggalPengajuan(value) {
    if (!value) return "-";

    return formatTanggal(ambilTanggal(value));
}

function formatStatus(status) {
    const daftarStatus = {
        menunggu: "Menunggu Verifikasi",
        disetujui: "Disetujui",
        ditolak: "Ditolak"
    };

    return daftarStatus[status] || status;
}

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
// STATISTIK PENGAJUAN
// =========================================================

function renderStatistik() {
    // Statistik mengikuti tanggal yang dipilih pada filter.
    // Jika filter tanggal kosong, statistik menampilkan seluruh data.
    const inputTanggal = document.getElementById("input-tanggal-filter");
    const tanggal = inputTanggal?.value || "";

    const dataStatistik = izinData.filter(item => {
        return !tanggal || ambilTanggal(item.tanggal_izin) === tanggal;
    });

    const total = dataStatistik.length;

    const menunggu = dataStatistik.filter(
        item => item.status === "menunggu"
    ).length;

    const disetujui = dataStatistik.filter(
        item => item.status === "disetujui"
    ).length;

    const ditolak = dataStatistik.filter(
        item => item.status === "ditolak"
    ).length;

    const isiStatistik = (id, jumlah) => {
        const element = document.getElementById(id);

        if (element) {
            element.textContent = jumlah;
        }
    };

    isiStatistik("stat-total", total);
    isiStatistik("stat-pending", menunggu);
    isiStatistik("stat-approved", disetujui);
    isiStatistik("stat-rejected", ditolak);
}

// =========================================================
// FILTER DATA
// =========================================================

function getFilteredData() {
    const searchInput = document.getElementById("search-input");
    const filterStatus = document.getElementById("filter-status");
    const inputTanggal = document.getElementById("input-tanggal-filter");

    const keyword = searchInput?.value.toLowerCase().trim() || "";
    const status = filterStatus?.value || "all";
    const tanggal = inputTanggal?.value || "";

    return izinData.filter(item => {

        const cocokKeyword = [
            item.nama_siswa,
            item.nis
        ].some(value =>
            String(value || "").toLowerCase().includes(keyword)
        );

        const cocokStatus =
            status === "all" || item.status === status;

        const cocokTanggal =
            !tanggal || ambilTanggal(item.tanggal_izin) === tanggal;

        return cocokKeyword && cocokStatus && cocokTanggal;
    });
}

// =========================================================
// TAMPILKAN TABEL
// =========================================================

function renderTable(data) {
    const tbody = document.getElementById("table-izin-body");

    if (!tbody) return;

    if (!data.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-10 text-slate-400">
                    Tidak ada pengajuan izin pada hari ini
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
                </span>
            `;
        } else if (item.status === "disetujui") {
            badge = `
                <span class="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold">
                    Disetujui
                </span>
            `;
        } else if (item.status === "ditolak") {
            badge = `
                <span class="px-3 py-1 rounded-full bg-red-50 text-red-600 text-[11px] font-bold">
                    Ditolak
                </span>
            `;
        } else {
            badge = `
                <span class="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[11px] font-bold">
                    ${escapeHTML(item.status)}
                </span>
            `;
        }

        const nomor = (currentPage - 1) * dataPerPage + index + 1;

        return `
            <tr class="hover:bg-slate-50/80 transition-colors">

                <td class="py-4 px-6 text-slate-400 font-semibold">
                    ${nomor}
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
                    ${formatTanggalPengajuan(item.waktu_pengajuan)}
                </td>

                <td class="py-4 px-6 text-slate-600">
                    ${formatTanggal(item.tanggal_izin)}
                </td>

                <td class="py-4 px-6 max-w-xs">
                    <div class="font-bold text-slate-900 truncate">
                        ${escapeHTML(item.alasan)}
                    </div>

                    <div class="text-[10px] text-slate-400 mt-1">
                        ${item.bukti_file ? "Ada lampiran" : "Tidak ada lampiran"}
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
// PAGINATION
// =========================================================

function renderPagination(totalData) {
    const info = document.getElementById("pagination-info");
    const container = document.getElementById("pagination-buttons");

    if (!info || !container) return;

    const totalHalaman = Math.ceil(totalData / dataPerPage);

    if (totalData === 0) {
        info.textContent = "Menampilkan 0 dari 0 pengajuan";
        container.innerHTML = "";
        return;
    }

    const mulai = (currentPage - 1) * dataPerPage + 1;
    const selesai = Math.min(
        currentPage * dataPerPage,
        totalData
    );

    info.textContent =
        `Menampilkan ${mulai} - ${selesai} dari total ${totalData} pengajuan`;

    let tombol = "";

    tombol += `
        <button
            type="button"
            data-page="${currentPage - 1}"
            ${currentPage === 1 ? "disabled" : ""}
            class="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center
            ${currentPage === 1
                ? "text-slate-300 cursor-not-allowed"
                : "text-slate-600 hover:bg-slate-50"}">
            &lt;
        </button>
    `;

    for (let i = 1; i <= totalHalaman; i++) {
        tombol += `
            <button
                type="button"
                data-page="${i}"
                class="w-8 h-8 rounded-lg flex items-center justify-center
                ${i === currentPage
                    ? "bg-[#00b09b] text-white font-bold shadow-sm"
                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"}">
                ${i}
            </button>
        `;
    }

    tombol += `
        <button
            type="button"
            data-page="${currentPage + 1}"
            ${currentPage === totalHalaman ? "disabled" : ""}
            class="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center
            ${currentPage === totalHalaman
                ? "text-slate-300 cursor-not-allowed"
                : "text-slate-600 hover:bg-slate-50"}">
            &gt;
        </button>
    `;

    container.innerHTML = tombol;
}

// =========================================================
// TAMPILKAN DATA SESUAI FILTER DAN HALAMAN
// =========================================================

function applyFilter() {
    const filtered = getFilteredData();

    const totalHalaman = Math.ceil(filtered.length / dataPerPage);

    if (totalHalaman > 0 && currentPage > totalHalaman) {
        currentPage = totalHalaman;
    }

    if (totalHalaman === 0) {
        currentPage = 1;
    }

    const mulai = (currentPage - 1) * dataPerPage;

    const dataHalaman = filtered.slice(
        mulai,
        mulai + dataPerPage
    );

    renderTable(dataHalaman);
    renderPagination(filtered.length);
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
            headers: getAuthHeaders()
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Gagal mengambil data.");
        }

        izinData = Array.isArray(result.data) ? result.data : [];

        izinData.sort((a, b) => {
            const tanggalA = new Date(
                String(a.waktu_pengajuan || "").replace(" ", "T")
            ).getTime() || 0;

            const tanggalB = new Date(
                String(b.waktu_pengajuan || "").replace(" ", "T")
            ).getTime() || 0;

            return tanggalB - tanggalA;
        });

        renderStatistik();

        currentPage = 1;
        applyFilter();

    } catch (error) {
        console.error("Gagal memuat pengajuan izin:", error);

        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center py-8 text-red-500">
                        Gagal memuat data pengajuan izin.
                        <br>
                        <span class="text-xs text-slate-400">
                            ${escapeHTML(error.message)}
                        </span>
                    </td>
                </tr>
            `;
        }

        izinData = [];
        renderStatistik();

        const info = document.getElementById("pagination-info");
        const buttons = document.getElementById("pagination-buttons");

        if (info) info.textContent = "Menampilkan 0 dari 0 pengajuan";
        if (buttons) buttons.innerHTML = "";
    }
}

// =========================================================
// EVENT FILTER, PENCARIAN, DAN PAGINATION
// =========================================================

function setupEventListeners() {
    const searchInput = document.getElementById("search-input");
    const filterStatus = document.getElementById("filter-status");
    const inputTanggal = document.getElementById("input-tanggal-filter");
    const wrapperTanggal = document.getElementById("wrapper-tanggal-filter");

    const tbody = document.getElementById("table-izin-body");
    const paginationButtons = document.getElementById("pagination-buttons");

    if (inputTanggal) {
        inputTanggal.value = tanggalHariIni();
    }

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            currentPage = 1;
            applyFilter();
        });
    }

    if (filterStatus) {
        filterStatus.addEventListener("change", () => {
            currentPage = 1;
            applyFilter();
        });
    }

    if (inputTanggal) {
        inputTanggal.addEventListener("change", () => {
            currentPage = 1;
            renderStatistik();
            applyFilter();
        });
    }

    if (wrapperTanggal && inputTanggal) {
        wrapperTanggal.addEventListener("click", (event) => {
            if (event.target !== inputTanggal) {
                if (typeof inputTanggal.showPicker === "function") {
                    inputTanggal.showPicker();
                } else {
                    inputTanggal.focus();
                }
            }
        });
    }

    if (paginationButtons) {
        paginationButtons.addEventListener("click", (event) => {
            const tombol = event.target.closest("button[data-page]");

            if (!tombol || tombol.disabled) return;

            const halaman = Number(tombol.dataset.page);

            if (!Number.isInteger(halaman) || halaman < 1) return;

            const filtered = getFilteredData();
            const totalHalaman = Math.ceil(
                filtered.length / dataPerPage
            );

            if (halaman > totalHalaman) return;

            currentPage = halaman;
            applyFilter();
        });
    }

    if (tbody) {
        tbody.addEventListener("click", (event) => {
            const tombol = event.target.closest(".btn-detail-izin");

            if (!tombol) return;

            openModalDetail(tombol.dataset.izinId);
        });
    }
}

// =========================================================
// BUKA POP-UP DETAIL
// =========================================================

async function openModalDetail(id) {
    const item = izinData.find(
        data => Number(data.id) === Number(id)
    );

    if (!item) {
        alert("Data pengajuan tidak ditemukan.");
        return;
    }

    selectedIzinId = Number(id);

    const container = document.getElementById("izin-modal-container");

    if (!container) {
        alert("Tempat pop-up belum tersedia.");
        return;
    }

    if (!document.getElementById("modal-izin")) {
        try {
            const response = await fetch(MODAL_URL);

            if (!response.ok) {
                throw new Error(`Gagal memuat modal: ${response.status}`);
            }

            container.innerHTML = await response.text();

            if (!document.getElementById("modal-izin")) {
                throw new Error("Elemen modal-izin tidak ditemukan.");
            }

            setupModalEventListeners();

        } catch (error) {
            console.error("Gagal memuat pop-up:", error);
            alert("Pop-up gagal dimuat. Periksa file pop-up-izin.html.");
            return;
        }
    }

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

    isi("modal-tgl-pengajuan", formatTanggalPengajuan(item.waktu_pengajuan));
    isi("modal-tgl-izin", formatTanggal(item.tanggal_izin));
    isi("modal-alasan-teks", item.alasan);

    // =====================================================
    // LAMPIRAN
    // =====================================================

    const namaFileElement = document.getElementById("modal-lampiran-nama");
    const iconFileElement = document.getElementById("modal-lampiran-icon");
    const statusLampiran = document.getElementById("modal-lampiran-status");
    const btnLihatBukti = document.getElementById("btn-lihat-bukti");
    const btnDownloadBukti = document.getElementById("btn-download-bukti");

    if (item.bukti_file) {
        const namaFilePath = String(item.bukti_file).replace(/\\/g, "/");
        let namaFile = namaFilePath.split("/").pop().split("?")[0];

        try {
            namaFile = decodeURIComponent(namaFile);
        } catch (error) {
            console.warn("Nama file tidak dapat di-decode.");
        }

        if (namaFileElement) {
            namaFileElement.textContent = namaFile;
        }

        if (statusLampiran) {
            statusLampiran.textContent = "✓ Dokumen Terlampir";
            statusLampiran.className =
                "text-xs font-semibold text-emerald-600";
        }

        if (iconFileElement) {
            iconFileElement.textContent =
                namaFile.includes(".")
                    ? namaFile.split(".").pop().toUpperCase()
                    : "FILE";
        }

        // Tombol lihat bukti melalui API yang membutuhkan token
        if (btnLihatBukti) {
            btnLihatBukti.disabled = false;

            btnLihatBukti.onclick = async () => {
                try {
                    const urlDownload =
                        `${BACKEND_URL}/api/mentor/download_bukti_izin.php?id=${item.id}`;

                    const response = await fetch(urlDownload, {
                        method: "GET",
                        headers: getAuthHeaders()
                    });

                    if (!response.ok) {
                        throw new Error("Bukti izin gagal dibuka.");
                    }

                    const blob = await response.blob();

                    if (blob.size === 0) {
                        throw new Error("File yang diterima kosong.");
                    }

                    const blobUrl = URL.createObjectURL(blob);
                    const tab = window.open(blobUrl, "_blank");

                    if (!tab) {
                        URL.revokeObjectURL(blobUrl);
                        throw new Error("Browser memblokir tab baru.");
                    }

                    tab.opener = null;

                    setTimeout(() => {
                        URL.revokeObjectURL(blobUrl);
                    }, 60000);

                } catch (error) {
                    console.error("Gagal membuka bukti:", error);
                    alert(error.message);
                }
            };
        }

        // Tombol download bukti
        if (btnDownloadBukti) {
            btnDownloadBukti.disabled = false;

            btnDownloadBukti.onclick = async () => {
                try {
                    const urlDownload =
                        `${BACKEND_URL}/api/mentor/download_bukti_izin.php?id=${item.id}`;

                    const response = await fetch(urlDownload, {
                        method: "GET",
                        headers: getAuthHeaders()
                    });

                    if (!response.ok) {
                        throw new Error("File gagal diunduh.");
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

        if (btnLihatBukti) {
            btnLihatBukti.disabled = true;
            btnLihatBukti.onclick = null;
        }

        if (btnDownloadBukti) {
            btnDownloadBukti.disabled = true;
            btnDownloadBukti.onclick = null;
        }

        if (statusLampiran) {
            statusLampiran.textContent = "Tidak ada dokumen terlampir";
            statusLampiran.className =
                "text-xs font-semibold text-slate-400";
        }
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
    const sudahDiproses = item.status !== "menunggu";

    if (catatan) {
        catatan.value = item.catatan_mentor || "";
        catatan.disabled = sudahDiproses;
    }

    // =====================================================
    // TOMBOL SETUJUI DAN TOLAK
    // =====================================================

    const btnApprove = document.getElementById("btn-approve-modal");
    const btnReject = document.getElementById("btn-reject-modal");

    if (btnApprove) {
        btnApprove.disabled = sudahDiproses;
    }

    if (btnReject) {
        btnReject.disabled = sudahDiproses;
    }

    const modal = document.getElementById("modal-izin");

    if (modal) {
        modal.classList.remove("hidden");
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

    async function prosesIzin(aksi) {
        if (!selectedIzinId) {
            alert("Pengajuan belum dipilih.");
            return;
        }

        const item = izinData.find(
            data => Number(data.id) === selectedIzinId
        );

        if (!item || item.status !== "menunggu") {
            alert("Pengajuan ini sudah diproses.");
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
                    headers: getAuthHeaders({
                        "Content-Type": "application/json"
                    }),
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

            alert(result.message || "Pengajuan berhasil diproses.");

            tutupModal();

            await loadIzinData();

        } catch (error) {
            console.error("Proses pengajuan gagal:", error);
            alert(error.message);

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
