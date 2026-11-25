/* =========================================================
   LOGIKA HALAMAN KELOLA DAILY REPORT MENTOR
   DATA DIAMBIL DARI DATABASE MELALUI API
   PAGINATION: 10 DATA PER HALAMAN
========================================================= */

let dataDailyReports = [];

let statistikDailyReport = {
    total_peserta: 0,
    siswa_sudah_lapor: 0,
    siswa_belum_lapor: 0,
    persentase_masuk: 0
};

let activeNisSiswa = null;
let activeReportId = null;
let mentorDailyReportInitialized = false;

const API_DAILY_REPORT =
    `${API_BASE_URL}/api/mentor/api_daily_report.php`;

const API_REKAP_DAILY_REPORT =
    `${API_BASE_URL}/api/mentor/api_rekap_daily_report.php`;

const DATA_PER_PAGE = 10;


// =========================================================
// AUTENTIKASI TOKEN PER TAB
// =========================================================

function getAuthHeaders() {
    return {
        "Authorization": `Bearer ${sessionStorage.getItem("authToken")}`
    };
}


// =========================================================
// MENGAMBIL TANGGAL HARI INI BERDASARKAN WIB
// =========================================================

function getTanggalHariIniWIB() {
    const sekarang = new Date();

    const tahun = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Jakarta",
        year: "numeric"
    }).format(sekarang);

    const bulan = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Jakarta",
        month: "2-digit"
    }).format(sekarang);

    const hari = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Jakarta",
        day: "2-digit"
    }).format(sekarang);

    return `${tahun}-${bulan}-${hari}`;
}


/* =========================================================
   1. INISIALISASI HALAMAN
========================================================= */

export function initMentorDailyReport() {

    if (mentorDailyReportInitialized) return;

    mentorDailyReportInitialized = true;

    console.log("Modul Daily Report Mentor berhasil dimuat.");

    const btnExportRekap =
        document.getElementById("btn-export-rekap");

    if (btnExportRekap) {
        btnExportRekap.addEventListener(
            "click",
            exportRekapDailyReport
        );
    }

    const tableBody =
        document.getElementById("table-report-body");

    const searchInput =
        document.getElementById("input-search-report");

    const filterProgram =
        document.getElementById("filter-program");

    const filterTanggal =
        document.getElementById("filter-tanggal");

    const tabButtons =
        document.querySelectorAll(".tab-btn");

    const tanggalHariIni =
        document.getElementById("tanggal-hari-ini");

    if (filterTanggal) {
        filterTanggal.value = getTanggalHariIniWIB();
    }

    if (tanggalHariIni) {
        tanggalHariIni.textContent = new Date().toLocaleDateString(
            "id-ID",
            {
                timeZone: "Asia/Jakarta",
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    }

    let activeTab = "semua";
    let currentPage = 1;
    let filteredDailyReports = [];


    /* =====================================================
       2. FUNGSI ESCAPE HTML
    ===================================================== */

    function escapeHTML(value) {

        return String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[char]);

    }


    /* =====================================================
       3. FORMAT TANGGAL DAN WAKTU
    ===================================================== */

    function formatTanggal(tanggal) {

        if (!tanggal) return "-";

        const date = new Date(tanggal);

        if (isNaN(date.getTime())) return tanggal;

        return date.toLocaleDateString("id-ID", {
            timeZone: "Asia/Jakarta",
            day: "2-digit",
            month: "short",
            year: "numeric"
        });

    }


    function formatWaktu(tanggal) {

        if (!tanggal) return "-";

        const date = new Date(tanggal);

        if (isNaN(date.getTime())) return "-";

        return date.toLocaleTimeString("id-ID", {
            timeZone: "Asia/Jakarta",
            hour: "2-digit",
            minute: "2-digit"
        }) + " WIB";

    }


    /* =====================================================
       4. BADGE STATUS
    ===================================================== */

    function renderStatus(status) {

        if (status === "menunggu") {
            return `
                <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full
                bg-amber-50 text-amber-600 text-[11px] font-bold">
                    Menunggu
                </span>
            `;
        }

        if (status === "diterima") {
            return `
                <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full
                bg-emerald-50 text-emerald-600 text-[11px] font-bold">
                    Diterima
                </span>
            `;
        }

        if (status === "ditolak") {
            return `
                <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full
                bg-rose-50 text-rose-600 text-[11px] font-bold">
                    Ditolak
                </span>
            `;
        }

        return "-";

    }


    /* =====================================================
       5. MENAMPILKAN LAMPIRAN
    ===================================================== */

    function renderLampiran(namaFile) {

        if (!namaFile) {
            return `
                <span class="text-slate-400 text-xs">
                    Tidak ada lampiran
                </span>
            `;
        }

        return `
            <span class="inline-flex items-center gap-1 px-2.5 py-1
            rounded-lg bg-blue-50 text-blue-600 border border-blue-200
            text-[10px] font-bold">
                📄 ${escapeHTML(namaFile)}
            </span>
        `;

    }


    /* =====================================================
       6. MENGHITUNG STATISTIK
    ===================================================== */

    function updateStatistik() {

        const totalPeserta = Number(
            statistikDailyReport.total_peserta || 0
        );

        const siswaSudahLapor = Number(
            statistikDailyReport.siswa_sudah_lapor || 0
        );

        const persentaseMasuk = Number(
            statistikDailyReport.persentase_masuk || 0
        );

        const total = dataDailyReports.length;

        const menunggu = dataDailyReports.filter(
            item => item.status === "menunggu"
        ).length;

        const diterima = dataDailyReports.filter(
            item => item.status === "diterima"
        ).length;

        const ditolak = dataDailyReports.filter(
            item => item.status === "ditolak"
        ).length;

        const statTotal =
            document.getElementById("stat-total-masuk");

        const statPersentase =
            document.getElementById("stat-persentase-masuk");

        const statMenunggu =
            document.getElementById("stat-perlu-diperiksa");

        const statDiterima =
            document.getElementById("stat-diterima");

        const statDitolak =
            document.getElementById("stat-ditolak");

        if (statTotal) {
            statTotal.textContent =
                `${siswaSudahLapor} / ${totalPeserta}`;
        }

        if (statPersentase) {
            statPersentase.textContent =
                `${persentaseMasuk}%`;
        }

        if (statMenunggu) {
            statMenunggu.textContent = menunggu;
        }

        if (statDiterima) {
            statDiterima.textContent = diterima;
        }

        if (statDitolak) {
            statDitolak.textContent = ditolak;
        }

        tabButtons.forEach(btn => {

            const tab = btn.dataset.tab;

            if (tab === "semua") {
                btn.textContent = `Semua (${total})`;
            }

            else if (tab === "belum-dinilai") {
                btn.textContent =
                    `Belum Dinilai (${menunggu + ditolak})`;
            }

            else if (tab === "selesai") {
                btn.textContent =
                    `Selesai Diperiksa (${diterima})`;
            }

        });

    }


    /* =====================================================
       7. FILTER PROGRAM
    ===================================================== */

    function updateFilterProgram() {

        if (!filterProgram) return;

        const programTerdaftar = [
            ...new Set(
                dataDailyReports
                    .map(item => item.program)
                    .filter(Boolean)
            )
        ];

        const programSebelumnya = filterProgram.value;

        filterProgram.innerHTML = `
            <option value="">Semua Program</option>

            ${programTerdaftar.map(program => `
                <option value="${escapeHTML(program)}">
                    ${escapeHTML(program)}
                </option>
            `).join("")}
        `;

        if (programTerdaftar.includes(programSebelumnya)) {
            filterProgram.value = programSebelumnya;
        }

    }


    /* =====================================================
       8. MENGAMBIL DATA DAILY REPORT DARI DATABASE
    ===================================================== */

    async function loadDailyReports() {

        if (tableBody) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="8" class="py-8 text-center text-slate-400">
                        Memuat data Daily Report...
                    </td>
                </tr>
            `;
        }

        try {

            const tanggalDipilih = filterTanggal
                ? filterTanggal.value
                : getTanggalHariIniWIB();

            const url = `${API_DAILY_REPORT}?tanggal=${
                encodeURIComponent(tanggalDipilih)
            }`;

            console.log("Mengambil Daily Report:", url);

            const response = await fetch(url, {
                method: "GET",
                headers: getAuthHeaders()
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message ||
                    "Gagal mengambil data Daily Report."
                );
            }

            statistikDailyReport = result.statistik || {
                total_peserta: 0,
                siswa_sudah_lapor: 0,
                siswa_belum_lapor: 0,
                persentase_masuk: 0
            };

            dataDailyReports = (result.data || []).map(item => ({

                id: item.id,
                peserta_id: item.peserta_id,

                nama: item.nama,
                nis: item.nisn,

                program_id: item.program_id,
                program: item.nama_program,

                nama_materi: item.nama_materi,

                tanggal: item.tanggal,
                created_at: item.created_at,

                judul: item.judul,
                deskripsi: item.isi_laporan,

                lampiran: item.bukti_file,
                link_bukti: item.link_bukti,

                status: item.status,
                catatan_mentor: item.catatan_mentor

            }));

            console.log(
                "Tanggal yang dipilih:",
                tanggalDipilih
            );

            console.log(
                "Data Daily Report:",
                dataDailyReports
            );

            console.log(
                "Statistik Daily Report:",
                statistikDailyReport
            );

            updateStatistik();
            updateFilterProgram();

            currentPage = 1;

            applyFilters();

            const urlParams = new URLSearchParams(
                window.location.search
            );

            const reportId = urlParams.get("id");

            if (reportId) {
                await window.openDetailLaporanModal(reportId);
            }

        } catch (error) {

            console.error(
                "Kesalahan mengambil Daily Report:",
                error
            );

            if (tableBody) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="8" class="py-8 text-center text-rose-500">
                            ${escapeHTML(error.message)}
                        </td>
                    </tr>
                `;
            }

        }

    }


    /* =====================================================
       9. MENAMPILKAN TABEL DAILY REPORT
    ===================================================== */

    function renderTable(data) {

        if (!tableBody) return;

        const totalData = data.length;

        const totalPages = Math.ceil(
            totalData / DATA_PER_PAGE
        );

        if (totalPages === 0) {
            currentPage = 1;
        } else if (currentPage > totalPages) {
            currentPage = totalPages;
        }

        const startIndex =
            (currentPage - 1) * DATA_PER_PAGE;

        const endIndex = Math.min(
            startIndex + DATA_PER_PAGE,
            totalData
        );

        const dataHalaman = data.slice(
            startIndex,
            endIndex
        );

        if (totalData === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="8" class="py-8 text-center text-slate-400">
                        Tidak ada laporan harian pada tanggal ini.
                    </td>
                </tr>
            `;

            renderPagination(
                totalData,
                totalPages,
                startIndex,
                endIndex
            );

            return;

        }

        tableBody.innerHTML = dataHalaman.map((item, index) => {

            return `
                <tr class="hover:bg-slate-50/80 transition align-top
                border-b border-slate-100 last:border-none">

                    <td class="py-4 px-6 font-bold text-indigo-600">
                        ${startIndex + index + 1}
                    </td>

                    <td class="py-4 px-6">
                        <div>
                            <h4 class="font-bold text-slate-900 text-xs">
                                ${escapeHTML(item.nama)}
                            </h4>

                            <p class="text-[10px] text-slate-400 font-medium">
                                NIS: ${escapeHTML(item.nis || "-")}
                            </p>
                        </div>
                    </td>

                    <td class="py-4 px-6">
                        <span class="text-slate-700 font-medium text-xs">
                            ${escapeHTML(item.program)}
                        </span>
                    </td>

                    <td class="py-4 px-6 font-medium text-slate-600 text-xs">
                        ${formatWaktu(item.created_at)}
                        <br>
                        <span class="text-[10px] text-slate-400">
                            ${formatTanggal(item.tanggal)}
                        </span>
                    </td>

                    <td class="py-4 px-6 max-w-xs">
                        <p class="font-bold text-slate-900 text-xs">
                            ${escapeHTML(item.judul)}
                        </p>

                        <p class="text-[11px] text-slate-400 mt-0.5 truncate">
                            ${escapeHTML(item.deskripsi || "-")}
                        </p>
                    </td>

                    <td class="py-4 px-6">
                        ${renderLampiran(item.lampiran)}
                    </td>

                    <td class="py-4 px-6">
                        ${renderStatus(item.status)}
                    </td>

                    <td class="py-4 px-6 text-center">
                        <button
                            type="button"
                            class="btn-buka-modal px-3.5 py-1.5 rounded-xl
                            bg-slate-100 hover:bg-slate-200 text-slate-700
                            font-bold text-xs transition"
                            data-nis="${escapeHTML(item.nis)}">
                            Detail ↗
                        </button>
                    </td>

                </tr>
            `;

        }).join("");

        renderPagination(
            totalData,
            totalPages,
            startIndex,
            endIndex
        );

    }


    /* =====================================================
       10. KOMPONEN PAGINATION
    ===================================================== */

    function renderPagination(
        totalData,
        totalPages,
        startIndex,
        endIndex
    ) {

        const container = document.getElementById(
            "pagination-report"
        );

        if (!container) return;

        let buttons = "";

        if (totalData === 0) {

            container.innerHTML = `
                <div class="flex flex-col sm:flex-row items-center
                justify-between gap-4 w-full">

                    <p class="text-xs text-slate-500">
                        Menampilkan 0 - 0 dari 0 laporan harian siswa
                    </p>

                    <div class="flex items-center gap-1.5">
                        <button type="button" disabled
                            class="w-8 h-8 rounded-lg border border-slate-200
                            flex items-center justify-center text-slate-400">
                            &lt;
                        </button>

                        <button type="button" disabled
                            class="w-8 h-8 rounded-lg border border-slate-200
                            flex items-center justify-center text-slate-400">
                            &gt;
                        </button>
                    </div>

                </div>
            `;

            return;

        }

        for (let i = 1; i <= totalPages; i++) {

            buttons += `
                <button
                    type="button"
                    data-page="${i}"
                    class="w-8 h-8 rounded-lg flex items-center
                    justify-center transition
                    ${currentPage === i
                        ? "bg-[#00b09b] text-white font-bold shadow-sm"
                        : "border border-slate-200 font-medium text-slate-600 hover:bg-slate-50"}">
                    ${i}
                </button>
            `;

        }

        container.innerHTML = `
            <div class="flex flex-col sm:flex-row items-center
            justify-between gap-4 w-full">

                <span class="text-xs text-slate-500">
                    Menampilkan ${startIndex + 1} - ${endIndex}
                    dari ${totalData} laporan harian siswa
                </span>

                <div class="flex items-center gap-2">

                    <button
                        type="button"
                        id="pagination-prev"
                        ${currentPage === 1 ? "disabled" : ""}
                        class="w-11 h-11 rounded-xl border border-slate-200
                        flex items-center justify-center text-indigo-600
                        hover:bg-slate-50 transition
                        disabled:opacity-40 disabled:cursor-not-allowed">
                        &lt;
                    </button>

                    ${buttons}

                    <button
                        type="button"
                        id="pagination-next"
                        ${currentPage === totalPages ? "disabled" : ""}
                        class="w-11 h-11 rounded-xl border border-slate-200
                        flex items-center justify-center text-indigo-600
                        hover:bg-slate-50 transition
                        disabled:opacity-40 disabled:cursor-not-allowed">
                        &gt;
                    </button>

                </div>

            </div>
        `;

        container.querySelectorAll("[data-page]").forEach(button => {

            button.addEventListener("click", () => {

                currentPage = Number(button.dataset.page);

                renderTable(filteredDailyReports);

            });

        });

        const prevButton =
            document.getElementById("pagination-prev");

        if (prevButton) {

            prevButton.addEventListener("click", () => {

                if (currentPage > 1) {
                    currentPage--;
                    renderTable(filteredDailyReports);
                }

            });

        }

        const nextButton =
            document.getElementById("pagination-next");

        if (nextButton) {

            nextButton.addEventListener("click", () => {

                if (currentPage < totalPages) {
                    currentPage++;
                    renderTable(filteredDailyReports);
                }

            });

        }

    }


    /* =====================================================
       11. PENCARIAN DAN FILTER
    ===================================================== */

    function applyFilters() {

        const keyword = (
            searchInput ? searchInput.value : ""
        ).toLowerCase().trim();

        const progVal = (
            filterProgram ? filterProgram.value : ""
        ).toLowerCase().trim();

        const tanggalVal = filterTanggal
            ? filterTanggal.value
            : "";

        const filtered = dataDailyReports.filter(item => {

            const matchKeyword =
                (item.nama || "").toLowerCase().includes(keyword) ||
                String(item.nis || "").toLowerCase().includes(keyword);

            const matchProgram =
                progVal === "" ||
                (item.program || "").toLowerCase().trim() === progVal;

            const tanggalLaporan =
                String(item.tanggal || "").slice(0, 10);

            const matchTanggal =
                tanggalVal === "" ||
                tanggalLaporan === tanggalVal;

            let matchTab = true;

            if (activeTab === "belum-dinilai") {

                matchTab =
                    item.status === "menunggu" ||
                    item.status === "ditolak";

            } else if (activeTab === "selesai") {

                matchTab = item.status === "diterima";

            }

            return (
                matchKeyword &&
                matchProgram &&
                matchTanggal &&
                matchTab
            );

        });

        filteredDailyReports = filtered;
        currentPage = 1;

        renderTable(filteredDailyReports);

    }


    if (searchInput) {
        searchInput.addEventListener("input", applyFilters);
    }

    if (filterProgram) {
        filterProgram.addEventListener("change", applyFilters);
    }

    if (filterTanggal) {
        filterTanggal.addEventListener("change", () => {
            loadDailyReports();
        });
    }


    /* =====================================================
       12. TAB FILTER
    ===================================================== */

    tabButtons.forEach(btn => {

        btn.addEventListener("click", () => {

            tabButtons.forEach(button => {

                button.classList.remove(
                    "bg-white",
                    "shadow-sm",
                    "text-slate-900"
                );

                button.classList.add("hover:text-slate-900");

            });

            btn.classList.add(
                "bg-white",
                "shadow-sm",
                "text-slate-900"
            );

            btn.classList.remove("hover:text-slate-900");

            activeTab = btn.dataset.tab;

            applyFilters();

        });

    });


    /* =====================================================
       13. MEMUAT KOMPONEN MODAL
    ===================================================== */

    async function ensureModalLoaded() {

        const container = document.getElementById(
            "daily-report-modal-container"
        );

        if (!container) {

            console.error("Container modal tidak ditemukan.");

            return false;

        }

        if (!container.innerHTML.trim()) {

            try {

                const response = await fetch(
                    "../../component/Mentor/pop-up-detail-daily-report.html"
                );

                if (!response.ok) {
                    throw new Error("File modal tidak ditemukan.");
                }

                container.innerHTML = await response.text();

                setupModalEvents();

            } catch (error) {

                console.error("Kesalahan memuat modal:", error);

                alert(
                    "Modal Daily Report gagal dimuat. Periksa lokasi file HTML modal."
                );

                return false;

            }

        }

        return true;

    }


    /* =====================================================
       MENGHITUNG TINGKAT KEAKTIFAN SISWA
    ===================================================== */

    function hitungTingkatKeaktifan(riwayat) {

        const totalDiterima = riwayat.filter(
            item => item.status === "diterima"
        ).length;

        if (totalDiterima >= 15) return "Sangat Aktif";

        if (totalDiterima >= 10) return "Aktif";

        if (totalDiterima >= 5) return "Cukup Aktif";

        return "Kurang Aktif";

    }


    /* =====================================================
       14. MODAL RIWAYAT DAILY REPORT SISWA
    ===================================================== */

    window.openDailyReportModal = async (nisSiswa) => {

        const loaded = await ensureModalLoaded();

        if (!loaded) return;

        activeNisSiswa = nisSiswa;

        const riwayat = dataDailyReports.filter(
            item => String(item.nis) === String(nisSiswa)
        );

        if (riwayat.length === 0) {

            console.warn("Riwayat laporan siswa tidak ditemukan.");

            return;

        }

        const dataSiswa = riwayat[0];

        const totalLaporan = riwayat.length;

        const diterima = riwayat.filter(
            item => item.status === "diterima"
        ).length;

        const menunggu = riwayat.filter(
            item => item.status === "menunggu"
        ).length;

        const ditolak = riwayat.filter(
            item => item.status === "ditolak"
        ).length;

        document.getElementById(
            "modal-view-riwayat"
        ).classList.remove("hidden");

        document.getElementById(
            "modal-view-detail"
        ).classList.add("hidden");

        const initial = (dataSiswa.nama || "?")
            .split(" ")
            .map(kata => kata[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();

        document.getElementById(
            "modal-siswa-initial"
        ).textContent = initial;

        document.getElementById(
            "modal-siswa-nama"
        ).textContent = dataSiswa.nama;

        document.getElementById(
            "modal-siswa-info"
        ).innerHTML = `
            NIS: ${escapeHTML(dataSiswa.nis || "-")}
            •
            <span class="text-indigo-600 font-semibold">
                ${escapeHTML(dataSiswa.program)}
            </span>
        `;

        const keaktifan = document.getElementById(
            "modal-siswa-keaktifan"
        );

        if (keaktifan) {
            keaktifan.textContent =
                hitungTingkatKeaktifan(riwayat);
        }

        document.getElementById(
            "modal-stat-total-laporan"
        ).textContent = totalLaporan;

        document.getElementById(
            "modal-stat-diterima"
        ).textContent = diterima;

        document.getElementById(
            "modal-stat-menunggu"
        ).textContent = menunggu;

        document.getElementById(
            "modal-stat-revisi"
        ).textContent = ditolak;

        renderRiwayatTable(riwayat);

        document.getElementById(
            "modal-detail-daily-report"
        ).classList.remove("hidden");

    };


    /* =====================================================
       15. TABEL RIWAYAT SISWA
    ===================================================== */

    function renderRiwayatTable(riwayat) {

        const tbody = document.getElementById(
            "modal-riwayat-tbody"
        );

        if (!tbody) return;

        if (riwayat.length === 0) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="py-6 text-center text-slate-400">
                        Belum ada riwayat laporan.
                    </td>
                </tr>
            `;

            return;

        }

        tbody.innerHTML = riwayat.map((item, index) => {

            return `
                <tr class="hover:bg-slate-50/50 transition">

                    <td class="py-3.5 px-4 font-bold text-slate-700">
                        ${index + 1}
                    </td>

                    <td class="py-3.5 px-4">
                        <span class="font-bold text-slate-800 block">
                            ${formatTanggal(item.tanggal)}
                        </span>

                        <span class="text-[10px] text-slate-400">
                            ${formatWaktu(item.created_at)}
                        </span>
                    </td>

                    <td class="py-3.5 px-4">
                        <span class="font-bold text-slate-800 block">
                            ${escapeHTML(item.judul)}
                        </span>

                        <span class="text-[11px] text-slate-500">
                            ${escapeHTML(item.deskripsi || "-")}
                        </span>
                    </td>

                    <td class="py-3.5 px-4">
                        ${renderLampiran(item.lampiran)}
                    </td>

                    <td class="py-3.5 px-4">
                        ${renderStatus(item.status)}
                    </td>

                    <td class="py-3.5 px-4 text-center">
                        <button
                            type="button"
                            class="btn-buka-detail-laporan px-3.5 py-1.5
                            rounded-xl text-[11px] font-bold
                            bg-slate-100 hover:bg-slate-200
                            text-slate-700 transition"
                            data-id="${item.id}">
                            Detail ↗
                        </button>
                    </td>

                </tr>
            `;

        }).join("");

    }


    /* =====================================================
       16. MENGAMBIL DETAIL LAPORAN DARI API
    ===================================================== */

    window.openDetailLaporanModal = async (reportId) => {

        const loaded = await ensureModalLoaded();

        if (!loaded) return;

        try {

            const response = await fetch(
                `${API_DAILY_REPORT}?id=${encodeURIComponent(reportId)}`,
                {
                    method: "GET",
                    headers: getAuthHeaders()
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {

                throw new Error(
                    result.message ||
                    "Gagal mengambil detail laporan."
                );

            }

            const item = result.data;

            const report = {

                id: item.id,
                peserta_id: item.peserta_id,

                nama: item.nama,
                nis: item.nisn,

                program_id: item.program_id,
                program: item.nama_program,

                nama_materi: item.nama_materi,

                tanggal: item.tanggal,
                created_at: item.created_at,

                judul: item.judul,
                deskripsi: item.isi_laporan,

                lampiran: item.bukti_file,
                link_bukti: item.link_bukti,

                status: item.status,
                catatan_mentor: item.catatan_mentor

            };

            activeNisSiswa = report.nis;
            activeReportId = report.id;

            const index = dataDailyReports.findIndex(
                data => String(data.id) === String(report.id)
            );

            if (index !== -1) {
                dataDailyReports[index] = report;
            }

            document.getElementById(
                "modal-view-riwayat"
            ).classList.add("hidden");

            document.getElementById(
                "modal-view-detail"
            ).classList.remove("hidden");

            document.getElementById(
                "detail-nama-siswa"
            ).textContent = report.nama;

            document.getElementById(
                "detail-info-siswa"
            ).innerHTML = `
                ${escapeHTML(report.program)}
                •
                NIS: ${escapeHTML(report.nis || "-")}
            `;

            document.getElementById(
                "detail-tanggal"
            ).textContent = formatTanggal(report.tanggal);

            document.getElementById(
                "detail-status"
            ).innerHTML = renderStatus(report.status);

            document.getElementById(
                "detail-judul"
            ).textContent = report.judul || "-";

            document.getElementById(
                "detail-deskripsi"
            ).textContent = report.deskripsi || "-";

            const lampiranNama = document.getElementById(
                "detail-lampiran-nama"
            );

            const lampiranInfo = document.getElementById(
                "detail-lampiran-info"
            );

            if (lampiranNama) {
                lampiranNama.textContent =
                    report.lampiran || "Tidak ada lampiran";
            }

            if (lampiranInfo) {
                lampiranInfo.textContent = report.lampiran
                    ? "File lampiran Daily Report"
                    : "Tidak ada file yang dilampirkan";
            }

            const textarea = document.getElementById(
                "evaluasi-textarea"
            );

            if (textarea) {
                textarea.value = report.catatan_mentor || "";
            }

            const btnTerima = document.getElementById(
                "btn-terima-laporan"
            );

            const btnTolak = document.getElementById(
                "btn-tolak-laporan"
            );

            const sudahDinilai = report.status !== "menunggu";

            if (btnTerima) {
                btnTerima.classList.toggle(
                    "hidden",
                    sudahDinilai
                );
            }

            if (btnTolak) {
                btnTolak.classList.toggle(
                    "hidden",
                    sudahDinilai
                );
            }

            document.getElementById(
                "modal-detail-daily-report"
            ).classList.remove("hidden");

        } catch (error) {

            console.error(
                "Kesalahan detail laporan:",
                error
            );

            alert(error.message);

        }

    };


    /* =====================================================
       17. UPDATE STATUS DAILY REPORT MELALUI API PUT
    ===================================================== */

    async function updateLaporanStatus(statusBaru) {

        if (!activeReportId) {

            alert("ID laporan tidak ditemukan.");

            return;

        }

        const textarea = document.getElementById(
            "evaluasi-textarea"
        );

        const catatan = textarea
            ? textarea.value.trim()
            : "";

        if (statusBaru === "ditolak" && catatan === "") {

            alert(
                "Silakan isi catatan evaluasi sebelum menolak laporan."
            );

            if (textarea) textarea.focus();

            return;

        }

        const btnTerima = document.getElementById(
            "btn-terima-laporan"
        );

        const btnTolak = document.getElementById(
            "btn-tolak-laporan"
        );

        if (btnTerima) btnTerima.disabled = true;

        if (btnTolak) btnTolak.disabled = true;

        try {

            const response = await fetch(API_DAILY_REPORT, {

                method: "PUT",

                headers: {
                    ...getAuthHeaders(),
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    id: activeReportId,
                    status: statusBaru,
                    catatan_mentor: catatan

                })

            });

            const result = await response.json();

            if (!response.ok || !result.success) {

                throw new Error(
                    result.message ||
                    "Gagal menyimpan penilaian."
                );

            }

            alert(
                result.message ||
                "Penilaian berhasil disimpan."
            );

            const idLaporan = activeReportId;

            await loadDailyReports();

            await window.openDetailLaporanModal(idLaporan);

        } catch (error) {

            console.error(
                "Kesalahan update laporan:",
                error
            );

            alert(error.message);

        } finally {

            if (btnTerima) btnTerima.disabled = false;

            if (btnTolak) btnTolak.disabled = false;

        }

    }


    /* =====================================================
       18. EVENT MODAL
    ===================================================== */

    function setupModalEvents() {

        const modalEl = document.getElementById(
            "modal-detail-daily-report"
        );

        const closeBtn = document.getElementById(
            "modal-close-btn"
        );

        const closeFooterBtn = document.getElementById(
            "modal-close-footer-btn"
        );

        if (closeBtn) {

            closeBtn.onclick = (e) => {

                e.preventDefault();

                modalEl.classList.add("hidden");

            };

        }

        if (closeFooterBtn) {

            closeFooterBtn.onclick = (e) => {

                e.preventDefault();

                modalEl.classList.add("hidden");

            };

        }

        if (modalEl) {

            modalEl.onclick = (e) => {

                if (e.target === modalEl) {
                    modalEl.classList.add("hidden");
                }

            };

        }

        const btnTerima = document.getElementById(
            "btn-terima-laporan"
        );

        const btnTolak = document.getElementById(
            "btn-tolak-laporan"
        );

        if (btnTerima) {

            btnTerima.onclick = (e) => {

                e.preventDefault();

                updateLaporanStatus("diterima");

            };

        }

        if (btnTolak) {

            btnTolak.onclick = (e) => {

                e.preventDefault();

                updateLaporanStatus("ditolak");

            };

        }

    }


    /* =====================================================
       19. EVENT KLIK DETAIL DAN KEMBALI
    ===================================================== */

    document.addEventListener("click", (e) => {

        const targetMainBtn = e.target.closest(
            ".btn-buka-modal"
        );

        if (targetMainBtn) {

            e.preventDefault();

            const nisSiswa = targetMainBtn.dataset.nis;

            if (nisSiswa) {
                window.openDailyReportModal(nisSiswa);
            }

            return;

        }

        const targetDetailBtn = e.target.closest(
            ".btn-buka-detail-laporan"
        );

        if (targetDetailBtn) {

            e.preventDefault();

            const reportId = targetDetailBtn.dataset.id;

            if (reportId) {
                window.openDetailLaporanModal(reportId);
            }

            return;

        }

        const targetBackBtn = e.target.closest(
            ".btn-kembali-ke-riwayat"
        );

        if (targetBackBtn) {

            e.preventDefault();

            if (activeNisSiswa) {
                window.openDailyReportModal(activeNisSiswa);
            }

        }

    });


    /* =====================================================
       20. JALANKAN PENGAMBILAN DATA
    ===================================================== */

    loadDailyReports();

}


/* =========================================================
   21. PEMILIHAN TANGGAL REKAP
========================================================= */

function exportRekapDailyReport() {

    const modalLama = document.getElementById(
        "modal-pilih-tanggal-rekap"
    );

    if (modalLama) {
        modalLama.remove();
    }

    const tanggalHariIni = getTanggalHariIniWIB();

    const modal = document.createElement("div");

    modal.id = "modal-pilih-tanggal-rekap";

    modal.className =
        "fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 p-4";

    modal.innerHTML = `
        <div class="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">

            <div class="flex items-center justify-between mb-5">

                <div>
                    <h2 class="text-lg font-bold text-slate-800">
                        Export Rekap Daily Report
                    </h2>

                    <p class="text-sm text-slate-500 mt-1">
                        Pilih tanggal laporan yang ingin direkap.
                    </p>
                </div>

                <button
                    type="button"
                    id="btn-tutup-pilih-tanggal"
                    class="w-9 h-9 rounded-full hover:bg-slate-100
                    text-slate-500 text-xl">
                    &times;
                </button>

            </div>

            <label
                for="input-tanggal-rekap"
                class="block text-sm font-semibold text-slate-700 mb-2">
                Tanggal Rekap
            </label>

            <input
                type="date"
                id="input-tanggal-rekap"
                max="${tanggalHariIni}"
                value="${tanggalHariIni}"
                class="w-full border border-slate-200 rounded-xl px-4 py-3
                text-sm text-slate-700 outline-none
                focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">

            <p class="text-xs text-slate-400 mt-2">
                Kamu dapat memilih tanggal hari ini maupun tanggal sebelumnya.
            </p>

            <div class="flex justify-end gap-3 mt-6">

                <button
                    type="button"
                    id="btn-batal-rekap"
                    class="px-4 py-2.5 rounded-xl border border-slate-200
                    text-sm font-semibold text-slate-600 hover:bg-slate-50">
                    Batal
                </button>

                <button
                    type="button"
                    id="btn-generate-rekap"
                    class="px-5 py-2.5 rounded-xl bg-indigo-600
                    text-white text-sm font-bold hover:bg-indigo-700
                    disabled:opacity-50">
                    Buat PDF
                </button>

            </div>

        </div>
    `;

    document.body.appendChild(modal);

    const inputTanggal = document.getElementById(
        "input-tanggal-rekap"
    );

    const btnGenerate = document.getElementById(
        "btn-generate-rekap"
    );

    function tutupModal() {
        modal.remove();
    }

    document.getElementById(
        "btn-tutup-pilih-tanggal"
    ).addEventListener("click", tutupModal);

    document.getElementById(
        "btn-batal-rekap"
    ).addEventListener("click", tutupModal);

    modal.addEventListener("click", (event) => {

        if (event.target === modal) {
            tutupModal();
        }

    });

    btnGenerate.addEventListener("click", async () => {

        const tanggal = inputTanggal.value;

        if (!tanggal) {

            alert("Silakan pilih tanggal terlebih dahulu.");

            return;

        }

        btnGenerate.disabled = true;
        btnGenerate.textContent = "Memproses...";

        try {

            const response = await fetch(
                `${API_REKAP_DAILY_REPORT}?tanggal=${encodeURIComponent(tanggal)}`,
                {
                    method: "GET",
                    headers: getAuthHeaders()
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {

                throw new Error(
                    result.message ||
                    "Gagal mengambil data rekap."
                );

            }

            if (!result.data || result.data.length === 0) {

                alert("Belum ada program yang dapat direkap.");

                return;

            }

            buatPDFRekapDailyReport(result);

            tutupModal();

        } catch (error) {

            console.error("Export PDF gagal:", error);

            alert(
                error.message ||
                "Terjadi kesalahan saat membuat PDF."
            );

        } finally {

            if (btnGenerate.isConnected) {
                btnGenerate.disabled = false;
                btnGenerate.textContent = "Buat PDF";
            }

        }

    });

}


/* =========================================================
   22. FUNGSI TANGGAL LOKAL
========================================================= */

function getTanggalLokal() {
    return getTanggalHariIniWIB();
}


function formatTanggalPDF(tanggal) {

    if (!tanggal) return "-";

    const date = new Date(`${tanggal}T00:00:00`);

    if (isNaN(date.getTime())) return tanggal;

    return date.toLocaleDateString("id-ID", {
        timeZone: "Asia/Jakarta",
        day: "2-digit",
        month: "long",
        year: "numeric"
    });

}


/* =========================================================
   23. MEMBUAT PDF REKAP DAILY REPORT
========================================================= */

function buatPDFRekapDailyReport(result) {

    if (!window.jspdf || !window.jspdf.jsPDF) {

        alert(
            "Library jsPDF belum dimuat. Periksa script CDN pada HTML."
        );

        return;

    }

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4"
    });

    if (typeof doc.autoTable !== "function") {

        alert(
            "Plugin jsPDF AutoTable belum dimuat. Periksa script CDN pada HTML."
        );

        return;

    }

    const lebarHalaman = doc.internal.pageSize.getWidth();
    const tinggiHalaman = doc.internal.pageSize.getHeight();

    const marginKiri = 14;
    const marginKanan = 14;

    const tanggal = formatTanggalPDF(result.tanggal);

    const warnaUtama = [37, 55, 90];
    const warnaHeader = [45, 85, 125];
    const warnaAbu = [100, 116, 139];

    let halamanPertama = true;


    function buatJudulBagian(teks, posisiY) {

        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(...warnaUtama);

        doc.text(teks, marginKiri, posisiY);

        doc.setDrawColor(220, 226, 235);

        doc.line(
            marginKiri,
            posisiY + 2,
            lebarHalaman - marginKanan,
            posisiY + 2
        );

        return posisiY + 7;

    }


    function hitungStatusLaporan(program) {

        let diterima = 0;
        let ditolak = 0;
        let menunggu = 0;

        program.peserta.forEach(peserta => {

            peserta.laporan.forEach(laporan => {

                const status = String(
                    laporan.status || ""
                ).toLowerCase();

                if (status === "diterima") {
                    diterima++;
                } else if (status === "ditolak") {
                    ditolak++;
                } else if (status === "menunggu") {
                    menunggu++;
                }

            });

        });

        return {
            diterima,
            ditolak,
            menunggu
        };

    }


    function buatHeaderProgram(program) {

        let posisiY = 17;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(19);
        doc.setTextColor(...warnaUtama);

        doc.text(
            "REKAP DAILY REPORT",
            lebarHalaman / 2,
            posisiY,
            { align: "center" }
        );

        posisiY += 7;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...warnaAbu);

        doc.text(
            "SISTEM INFORMASI INKUBASI",
            lebarHalaman / 2,
            posisiY,
            { align: "center" }
        );

        posisiY += 8;

        doc.setDrawColor(45, 85, 125);
        doc.setLineWidth(0.7);

        doc.line(
            marginKiri,
            posisiY,
            lebarHalaman - marginKanan,
            posisiY
        );

        posisiY += 9;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(50, 60, 75);

        doc.text("Nama Mentor", marginKiri, posisiY);

        doc.setFont("helvetica", "normal");

        doc.text(
            `: ${String(result.mentor || "-")}`,
            marginKiri + 28,
            posisiY
        );

        posisiY += 6;

        doc.setFont("helvetica", "bold");

        doc.text("Program", marginKiri, posisiY);

        doc.setFont("helvetica", "normal");

        doc.text(
            `: ${String(program.nama_program || "-")}`,
            marginKiri + 28,
            posisiY
        );

        posisiY += 6;

        doc.setFont("helvetica", "bold");

        doc.text("Tanggal Rekap", marginKiri, posisiY);

        doc.setFont("helvetica", "normal");

        doc.text(
            `: ${tanggal}`,
            marginKiri + 28,
            posisiY
        );

        return posisiY + 8;

    }


    function buatFooter() {

        const jumlahHalaman =
            doc.internal.getNumberOfPages();

        for (let i = 1; i <= jumlahHalaman; i++) {

            doc.setPage(i);

            doc.setDrawColor(220, 226, 235);
            doc.setLineWidth(0.3);

            doc.line(
                marginKiri,
                tinggiHalaman - 12,
                lebarHalaman - marginKanan,
                tinggiHalaman - 12
            );

            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.setTextColor(120, 130, 145);

            doc.text(
                "Sistem Informasi Inkubasi",
                marginKiri,
                tinggiHalaman - 7
            );

            doc.text(
                `Halaman ${i} dari ${jumlahHalaman}`,
                lebarHalaman - marginKanan,
                tinggiHalaman - 7,
                { align: "right" }
            );

        }

    }


    /* =====================================================
       LOOP SETIAP PROGRAM MENTOR
    ===================================================== */

    result.data.forEach(program => {

        if (!halamanPertama) {
            doc.addPage();
        }

        halamanPertama = false;

        let posisiY = buatHeaderProgram(program);


        // A. RINGKASAN PESERTA

        posisiY = buatJudulBagian(
            "A. RINGKASAN PESERTA",
            posisiY
        );

        doc.autoTable({

            startY: posisiY,

            head: [[
                "Total Peserta Aktif",
                "Sudah Melapor",
                "Belum Melapor",
                "Persentase Laporan"
            ]],

            body: [[
                program.total_peserta ?? 0,
                program.sudah_lapor ?? 0,
                program.belum_lapor ?? 0,
                `${program.persentase_masuk ?? 0}%`
            ]],

            theme: "grid",

            margin: {
                left: marginKiri,
                right: marginKanan
            },

            styles: {
                font: "helvetica",
                fontSize: 9,
                cellPadding: 4,
                halign: "center",
                valign: "middle",
                textColor: [55, 65, 81],
                lineColor: [220, 226, 235],
                lineWidth: 0.2
            },

            headStyles: {
                fillColor: warnaHeader,
                textColor: 255,
                fontStyle: "bold",
                halign: "center"
            },

            bodyStyles: {
                fontStyle: "bold",
                fontSize: 11
            }

        });

        posisiY = doc.lastAutoTable.finalY + 9;


        // B. RINGKASAN STATUS LAPORAN

        posisiY = buatJudulBagian(
            "B. RINGKASAN STATUS LAPORAN",
            posisiY
        );

        const status = hitungStatusLaporan(program);

        doc.autoTable({

            startY: posisiY,

            head: [[
                "Diterima",
                "Ditolak",
                "Menunggu Penilaian"
            ]],

            body: [[
                status.diterima,
                status.ditolak,
                status.menunggu
            ]],

            theme: "grid",

            margin: {
                left: marginKiri,
                right: marginKanan
            },

            styles: {
                font: "helvetica",
                fontSize: 10,
                cellPadding: 4,
                halign: "center",
                valign: "middle",
                textColor: [55, 65, 81],
                lineColor: [220, 226, 235],
                lineWidth: 0.2
            },

            headStyles: {
                fillColor: warnaHeader,
                textColor: 255,
                fontStyle: "bold"
            },

            bodyStyles: {
                fontStyle: "bold",
                fontSize: 11
            }

        });

        posisiY = doc.lastAutoTable.finalY + 9;


        // C. RINCIAN DAILY REPORT

        posisiY = buatJudulBagian(
            "C. RINCIAN DAILY REPORT PESERTA",
            posisiY
        );

        const barisLaporan = [];

        program.peserta.forEach(peserta => {

            peserta.laporan.forEach(laporan => {

                barisLaporan.push([

                    peserta.nama || "-",
                    peserta.nisn || "-",
                    laporan.nama_materi || "-",
                    laporan.judul || "-",
                    laporan.isi_laporan || "-",
                    String(laporan.status || "-").toUpperCase(),
                    laporan.catatan_mentor || "-"

                ]);

            });

        });

        doc.autoTable({

            startY: posisiY,

            head: [[
                "Nama Peserta",
                "NISN",
                "Materi",
                "Judul Laporan",
                "Isi Laporan",
                "Status",
                "Catatan Mentor"
            ]],

            body: barisLaporan.length > 0
                ? barisLaporan
                : [[
                    "-",
                    "-",
                    "-",
                    "-",
                    "Belum ada laporan pada tanggal ini.",
                    "-",
                    "-"
                ]],

            theme: "grid",

            margin: {
                left: marginKiri,
                right: marginKanan,
                bottom: 17
            },

            showHead: "everyPage",

            rowPageBreak: "auto",

            styles: {
                font: "helvetica",
                fontSize: 7.5,
                cellPadding: 3,
                overflow: "linebreak",
                valign: "top",
                textColor: [55, 65, 81],
                lineColor: [220, 226, 235],
                lineWidth: 0.2
            },

            headStyles: {
                fillColor: warnaHeader,
                textColor: 255,
                fontStyle: "bold",
                halign: "center",
                valign: "middle"
            },

            alternateRowStyles: {
                fillColor: [246, 248, 251]
            },

            columnStyles: {
                0: { cellWidth: 32 },
                1: { cellWidth: 27 },
                2: { cellWidth: 31 },
                3: { cellWidth: 34 },
                4: { cellWidth: 58 },
                5: { cellWidth: 24 },
                6: { cellWidth: 53 }
            }

        });

        posisiY = doc.lastAutoTable.finalY + 10;


        // D. PESERTA BELUM MELAPOR

        const belumLapor = program.peserta.filter(
            peserta =>
                !peserta.laporan ||
                peserta.laporan.length === 0
        );

        if (posisiY + 20 > tinggiHalaman - 17) {

            doc.addPage();

            posisiY = 20;

        }

        posisiY = buatJudulBagian(
            "D. DAFTAR PESERTA BELUM MELAPOR",
            posisiY
        );

        const barisBelumLapor = belumLapor.length > 0

            ? belumLapor.map((peserta, index) => [

                index + 1,
                peserta.nama || "-",
                peserta.nisn || "-",
                "Belum mengirim Daily Report"

            ])

            : [[
                "-",
                "-",
                "-",
                "Semua peserta sudah melapor"
            ]];

        doc.autoTable({

            startY: posisiY,

            head: [[
                "No",
                "Nama Peserta",
                "NISN",
                "Keterangan"
            ]],

            body: barisBelumLapor,

            theme: "grid",

            margin: {
                left: marginKiri,
                right: marginKanan,
                bottom: 17
            },

            styles: {
                font: "helvetica",
                fontSize: 8.5,
                cellPadding: 3,
                overflow: "linebreak",
                valign: "middle",
                textColor: [55, 65, 81],
                lineColor: [220, 226, 235],
                lineWidth: 0.2
            },

            headStyles: {
                fillColor: warnaHeader,
                textColor: 255,
                fontStyle: "bold",
                halign: "center"
            },

            alternateRowStyles: {
                fillColor: [246, 248, 251]
            },

            columnStyles: {
                0: { cellWidth: 15, halign: "center" },
                1: { cellWidth: 75 },
                2: { cellWidth: 45 },
                3: { cellWidth: "auto" }
            }

        });

    });


    buatFooter();

    const namaFile =
        `Rekap-Daily-Report-${result.tanggal}.pdf`;

    doc.save(namaFile);

}


/* =========================================================
   24. JALANKAN INISIALISASI MODUL
========================================================= */

initMentorDailyReport();