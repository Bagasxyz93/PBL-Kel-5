import { API_BASE_URL } from "../api-config.js";


/* =========================================================
    LOGIKA HALAMAN MATERI SISWA
========================================================= */

const API_MATERI_SISWA = `${API_BASE_URL}/api/siswa/api_materi_siswa.php`;
const BASE_BACKEND = `${API_BASE_URL}/`;

let daftarDataMateri = [];
let modalMateriLoaded = false;
let modalMateriEventsInitialized = false;
let filterBulanMateri = "";
let filterTahunMateri = "";

// =========================================================
// HELPER
// =========================================================

function escapeHTMLMateri(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => {
        const map = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return map[char];
    });
}

// =========================================================
// SANITASI HTML DESKRIPSI MATERI
// =========================================================

function sanitasiHTMLMateri(value) {
    if (!value) return "Tidak ada deskripsi materi.";

    const parser = new DOMParser();
    const doc = parser.parseFromString(String(value), "text/html");

    const TAG_DIIZINKAN = [
        "B",
        "STRONG",
        "I",
        "EM",
        "U",
        "BR",
        "P",
        "UL",
        "OL",
        "LI"
    ];

    function bersihkanNode(node) {
        // Node teks
        if (node.nodeType === Node.TEXT_NODE) {
            return document.createTextNode(node.textContent);
        }

        // Node selain teks dan elemen diabaikan
        if (node.nodeType !== Node.ELEMENT_NODE) {
            return document.createDocumentFragment();
        }

        // Tag yang tidak diizinkan tidak dipertahankan,
        // tetapi teks di dalamnya tetap diproses.
        if (!TAG_DIIZINKAN.includes(node.tagName)) {
            const fragment = document.createDocumentFragment();

            node.childNodes.forEach(child => {
                fragment.appendChild(bersihkanNode(child));
            });

            return fragment;
        }

        // Buat elemen baru tanpa atribut bawaan
        const elementBaru = document.createElement(
            node.tagName.toLowerCase()
        );

        node.childNodes.forEach(child => {
            elementBaru.appendChild(bersihkanNode(child));
        });

        return elementBaru;
    }

    const fragment = document.createDocumentFragment();

    doc.body.childNodes.forEach(node => {
        fragment.appendChild(bersihkanNode(node));
    });

    const container = document.createElement("div");
    container.appendChild(fragment);

    return container.innerHTML;
}

function getTokenMateri() {
    return sessionStorage.getItem("authToken");
}

function formatTanggalMateri(tanggal) {
    if (!tanggal) return "-";

    const date = new Date(tanggal + "T00:00:00");

    if (isNaN(date.getTime())) return tanggal;

    return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

function getNamaFileMateri(path) {
    if (!path) return "Tidak ada file";

    return path.split("/").pop().split("\\").pop();
}

function getUrlFileMateri(path) {
    if (!path) return null;

    // Jika file berupa URL
    if (/^https?:\/\//i.test(path)) {
        return path;
    }

    // Normalisasi path file
    const cleanPath = String(path)
        .replace(/\\/g, "/")
        .replace(/^\/+/, "");

    const encodedPath = cleanPath
        .split("/")
        .map(segment => encodeURIComponent(segment))
        .join("/");

    return BASE_BACKEND + encodedPath;
}

function getFormatFileMateri(path) {
    if (!path) return "Tidak ada file";

    const extension = path.split(".").pop().toUpperCase();

    return extension || "FILE";
}

function getInisialMentor(nama) {
    if (!nama) return "M";

    return nama
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(kata => kata.charAt(0))
        .join("")
        .toUpperCase();
}

// =========================================================
// FILTER BULAN & TAHUN MATERI
// =========================================================

function getTanggalSekarangMateri() {
    return new Date().toLocaleDateString("en-CA", {
        timeZone: "Asia/Jakarta"
    });
}

function getTahunSekarangMateri() {
    return Number(getTanggalSekarangMateri().substring(0, 4));
}

function setupFilterMateri() {
    const container = document.getElementById("daftar-materi");

    if (!container) return;

    let filterContainer = document.getElementById("filter-materi-periode");

    if (!filterContainer) {
        filterContainer = document.createElement("div");
        filterContainer.id = "filter-materi-periode";

        container.parentNode.insertBefore(filterContainer, container);
    }

    const tahunSekarang = getTahunSekarangMateri();

    // Default filter selalu mengikuti bulan dan tahun sekarang
    if (!filterBulanMateri || !filterTahunMateri) {
        const tanggalSekarang = getTanggalSekarangMateri();

        filterBulanMateri = tanggalSekarang.substring(5, 7);
        filterTahunMateri = tanggalSekarang.substring(0, 4);
    }

    // Ambil tahun dari materi yang tersedia
    const tahunMateriTersedia = daftarDataMateri
        .map(materi => {
            const tanggal = String(materi.tanggal_publikasi || "");
            return Number(tanggal.substring(0, 4));
        })
        .filter(tahun => Number.isInteger(tahun) && tahun > 0);

    const tahunTerpilih = Number(filterTahunMateri);

    const tahunAwal = Math.min(
        tahunSekarang - 5,
        tahunTerpilih,
        ...tahunMateriTersedia
    );

    const tahunAkhir = Math.max(
        tahunSekarang + 5,
        tahunTerpilih,
        ...tahunMateriTersedia
    );

    const daftarTahun = [];

    for (let tahun = tahunAkhir; tahun >= tahunAwal; tahun--) {
        daftarTahun.push(tahun);
    }

    const daftarBulan = [
        { value: "01", label: "Januari" },
        { value: "02", label: "Februari" },
        { value: "03", label: "Maret" },
        { value: "04", label: "April" },
        { value: "05", label: "Mei" },
        { value: "06", label: "Juni" },
        { value: "07", label: "Juli" },
        { value: "08", label: "Agustus" },
        { value: "09", label: "September" },
        { value: "10", label: "Oktober" },
        { value: "11", label: "November" },
        { value: "12", label: "Desember" }
    ];

    filterContainer.innerHTML = `
        <div class="mb-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">

            <div class="mb-3 flex items-center gap-2">
                <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f0edff] text-[#4027bd]">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor"
                        stroke-width="1.8" viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="17" rx="2"></rect>
                        <path d="M16 2v4M8 2v4M3 10h18"></path>
                    </svg>
                </div>

                <div>
                    <h3 class="text-sm font-bold text-slate-800">
                        Arsip Materi Pembelajaran
                    </h3>

                    <p class="text-[11px] text-slate-500">
                        Pilih periode untuk melihat materi
                    </p>
                </div>
            </div>

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">

                <div>
                    <label for="filter-bulan-materi"
                        class="mb-1.5 block text-xs font-semibold text-slate-600">
                        Bulan
                    </label>

                    <select
                        id="filter-bulan-materi"
                        class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-[#4027bd] focus:ring-2 focus:ring-[#4027bd]/10">
                        ${daftarBulan.map(bulan => `
                            <option value="${bulan.value}">
                                ${bulan.label}
                            </option>
                        `).join("")}
                    </select>
                </div>

                <div>
                    <label for="filter-tahun-materi"
                        class="mb-1.5 block text-xs font-semibold text-slate-600">
                        Tahun
                    </label>

                    <select
                        id="filter-tahun-materi"
                        class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-[#4027bd] focus:ring-2 focus:ring-[#4027bd]/10">
                        ${daftarTahun.map(tahun => `
                            <option value="${tahun}">
                                ${tahun}
                            </option>
                        `).join("")}
                    </select>
                </div>

            </div>

            <div class="mt-3 flex items-center justify-between gap-2">

                <p id="label-periode-materi"
                    class="text-[11px] font-medium text-slate-500">
                </p>

                <button
                    type="button"
                    id="btn-reset-filter-materi"
                    class="shrink-0 rounded-lg border border-[#4027bd]/20 bg-[#f5f3ff] px-3 py-2 text-[11px] font-semibold text-[#4027bd] transition hover:bg-[#ebe6ff]">
                    Reset Periode
                </button>

            </div>

        </div>
    `;

    const selectBulan = document.getElementById("filter-bulan-materi");
    const selectTahun = document.getElementById("filter-tahun-materi");
    const btnReset = document.getElementById("btn-reset-filter-materi");

    selectBulan.value = filterBulanMateri;
    selectTahun.value = filterTahunMateri;

    selectBulan.onchange = () => {
        filterBulanMateri = selectBulan.value;
        filterMateri();
    };

    selectTahun.onchange = () => {
        filterTahunMateri = selectTahun.value;
        filterMateri();
    };

    btnReset.onclick = () => {
        const tanggalSekarang = getTanggalSekarangMateri();

        filterBulanMateri = tanggalSekarang.substring(5, 7);
        filterTahunMateri = tanggalSekarang.substring(0, 4);

        setupFilterMateri();
        filterMateri();
    };

    updateLabelPeriodeMateri();
}

function updateLabelPeriodeMateri() {
    const label = document.getElementById("label-periode-materi");

    if (!label) return;

    const namaBulan = [
        "Januari", "Februari", "Maret", "April",
        "Mei", "Juni", "Juli", "Agustus",
        "September", "Oktober", "November", "Desember"
    ];

    label.textContent =
        `Periode: ${namaBulan[Number(filterBulanMateri) - 1]} ${filterTahunMateri}`;
}

// =========================================================
// INIT HALAMAN MATERI
// =========================================================

export async function initMateri() {
    console.log("Modul Materi Siswa berhasil dimuat.");

    const searchInput = document.getElementById("search-materi");

    if (searchInput) {
        searchInput.oninput = filterMateri;
    }

    await ambilDataMateriSiswa();
    await setupDetailMateriModal();
}

// =========================================================
// MENGAMBIL DATA MATERI DARI API
// =========================================================

async function ambilDataMateriSiswa() {
    const container = document.getElementById("daftar-materi");
    const emptyMessage = document.getElementById("materi-kosong");

    if (!container) return;

    container.className =
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch w-full";

    container.innerHTML = `
        <div class="col-span-full py-10 text-center text-sm text-slate-500">
            Memuat materi...
        </div>
    `;

    try {
        const token = getTokenMateri();

        if (!token) {
            throw new Error("Token sesi siswa tidak ditemukan.");
        }

        const response = await fetch(API_MATERI_SISWA, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Gagal mengambil data materi.");
        }

        daftarDataMateri = result.data?.materi || [];

        renderCardsMateri();

    } catch (error) {
        console.error("Gagal mengambil materi siswa:", error);

        container.innerHTML = `
            <div class="col-span-full rounded-xl border border-red-100 bg-red-50 p-5 text-center">
                <p class="text-sm font-semibold text-red-600">
                    Gagal memuat materi
                </p>

                <p class="mt-1 text-xs text-red-500">
                    ${escapeHTMLMateri(error.message)}
                </p>

                <button
                    type="button"
                    id="btn-ulangi-materi"
                    class="mt-3 rounded-lg bg-[#4027bd] px-4 py-2 text-xs font-semibold text-white hover:bg-[#30209b]"
                >
                    Coba Lagi
                </button>
            </div>
        `;

        if (emptyMessage) {
            emptyMessage.classList.add("hidden");
        }

        const retryBtn = document.getElementById("btn-ulangi-materi");

        if (retryBtn) {
            retryBtn.onclick = ambilDataMateriSiswa;
        }
    }
}

// =========================================================
// FILTER PENCARIAN + BULAN + TAHUN
// =========================================================

function filterMateri() {
    const searchInput = document.getElementById("search-materi");
    const emptyMessage = document.getElementById("materi-kosong");
    const cards = document.querySelectorAll(".kartu-materi");

    const keyword = searchInput?.value.trim().toLowerCase() || "";

    let totalVisible = 0;

    cards.forEach(card => {
        const searchableText = card.textContent.toLowerCase();

        const tanggalMateri = String(card.dataset.tanggal || "");

        const bulanMateri = tanggalMateri.substring(5, 7);
        const tahunMateri = tanggalMateri.substring(0, 4);

        const cocokPencarian = searchableText.includes(keyword);

        const cocokPeriode =
            bulanMateri === filterBulanMateri &&
            tahunMateri === filterTahunMateri;

        const matched = cocokPencarian && cocokPeriode;

        card.classList.toggle("hidden", !matched);

        if (matched) {
            totalVisible++;
        }
    });

    if (emptyMessage) {
        emptyMessage.classList.toggle("hidden", totalVisible > 0);
    }

    updateLabelPeriodeMateri();
}

// =========================================================
// RENDER KARTU MATERI
// =========================================================

function renderCardsMateri() {
    const container = document.getElementById("daftar-materi");
    const emptyMessage = document.getElementById("materi-kosong");

    if (!container) return;

    container.className =
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch w-full";

    // Siapkan filter periode
    setupFilterMateri();

    container.innerHTML = "";

    if (daftarDataMateri.length === 0) {
        if (emptyMessage) {
            emptyMessage.classList.remove("hidden");
        }

        return;
    }

    if (emptyMessage) {
        emptyMessage.classList.add("hidden");
    }

    daftarDataMateri.forEach(materi => {
        const article = document.createElement("article");

        const namaMentor = materi.nama_mentor || "Mentor";
        const namaProgram = materi.nama_program || "Program Inkubasi";
        const judul = materi.judul || "Materi";
        const tanggalRaw = String(materi.tanggal_publikasi || "");
        const tanggal = formatTanggalMateri(materi.tanggal_publikasi);
        const filePath = materi.file_materi;
        const namaFile = getNamaFileMateri(filePath);
        const formatFile = getFormatFileMateri(filePath);

        article.dataset.tanggal = tanggalRaw;

        article.className =
            "kartu-materi flex flex-col justify-between h-full rounded-xl border border-slate-100 bg-[#f5f4ff] p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md";

        article.innerHTML = `
            <div>
                <div class="mb-2 flex flex-wrap items-center gap-1.5">
                    <span class="rounded bg-[#3922b9] px-2 py-1 text-[10px] font-semibold text-white">
                        ${escapeHTMLMateri(namaProgram)}
                    </span>

                    <span class="flex items-center gap-1 text-[10px] text-slate-500">
                        ${escapeHTMLMateri(tanggal)}
                    </span>
                </div>

                <h3 class="text-sm font-bold leading-5 text-slate-800">
                    ${escapeHTMLMateri(judul)}
                </h3>

                <div class="mt-2 text-[10px] text-slate-500 line-clamp-3">
                    ${sanitasiHTMLMateri(materi.konten_materi)}
                </div>
            </div>

            <div>
                <div class="mt-3 flex items-center gap-2">
                    <div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#3922b9] text-[9px] font-bold text-white">
                        ${escapeHTMLMateri(getInisialMentor(namaMentor))}
                    </div>

                    <div class="min-w-0">
                        <p class="text-[11px] font-semibold text-slate-700">
                            ${escapeHTMLMateri(namaMentor)}
                        </p>

                        <p class="text-[10px] text-slate-500">
                            Mentor ${escapeHTMLMateri(namaProgram)}
                        </p>
                    </div>
                </div>

                <div class="mt-3 flex items-center justify-between gap-2 rounded-md border border-slate-100 bg-white px-2 py-2">
                    <span class="flex min-w-0 items-center gap-1.5">
                        <svg class="h-3.5 w-3.5 shrink-0 text-red-500" fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <path d="M14 2v6h6"></path>
                            <path d="M8 15h8M8 18h6"></path>
                        </svg>

                        <span class="truncate text-[10px] text-red-500">
                            ${escapeHTMLMateri(namaFile)}
                        </span>
                    </span>

                    <span class="shrink-0 font-semibold text-blue-600 text-[10px]">
                        ${escapeHTMLMateri(formatFile)}
                    </span>
                </div>

                <button
                    type="button"
                    data-id="${escapeHTMLMateri(materi.id)}"
                    class="btn-akses-materi mt-2.5 flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-[#4027bd] px-2 text-[11px] font-semibold text-white transition hover:bg-[#30209b] active:scale-[0.98]"
                >
                    Akses & Pelajari Modul

                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M5 12h14"></path>
                        <path d="m13 6 6 6-6 6"></path>
                    </svg>
                </button>
            </div>
        `;

        container.appendChild(article);
    });

    filterMateri();
}

// =========================================================
// LOGIKA POP-UP DETAIL MATERI
// =========================================================

async function setupDetailMateriModal() {
    let modalContainer = document.getElementById("materi-modal-container");

    if (!modalContainer) {
        modalContainer = document.createElement("div");
        modalContainer.id = "materi-modal-container";
        document.body.appendChild(modalContainer);
    }

    async function loadModalHtml() {
        if (modalMateriLoaded) return true;

        try {
            const response = await fetch(
                "/component/Siswa/pop-up-detail-materi.html"
            );

            if (!response.ok) {
                throw new Error("Gagal memuat pop-up detail materi.");
            }

            modalContainer.innerHTML = await response.text();

            modalMateriLoaded = true;

            initModalEvents();

            return true;

        } catch (error) {
            console.error(error);
            return false;
        }
    }

    // =================================================
    // MENGISI DETAIL MODAL
    // =================================================

    function populateModalData(materiId) {
        const data = daftarDataMateri.find(
            materi => String(materi.id) === String(materiId)
        );

        if (!data) return;

        const namaMentor = data.nama_mentor || "Mentor";
        const namaProgram = data.nama_program || "Program Inkubasi";
        const judul = data.judul || "Materi";
        const tanggal = formatTanggalMateri(data.tanggal_publikasi);
        const namaFile = getNamaFileMateri(data.file_materi);
        const formatFile = getFormatFileMateri(data.file_materi);
        const fileUrl = getUrlFileMateri(data.file_materi);

        const elJudul = document.getElementById("modal-materi-judul");
        const elBadgeContainer = document.getElementById("modal-materi-badges");
        const elPengajarNama = document.getElementById("modal-pengajar-nama");
        const elPengajarPeran = document.getElementById("modal-pengajar-peran");
        const elPengajarInisial = document.getElementById("modal-pengajar-inisial");
        const elTanggal = document.getElementById("modal-tanggal");
        const elKelas = document.getElementById("modal-kelas");
        const elDeskripsi = document.getElementById("modal-deskripsi");
        const elBerkasNama = document.getElementById("modal-berkas-nama");
        const elBerkasInfo = document.getElementById("modal-berkas-info");
        const elPetunjuk = document.getElementById("modal-petunjuk");

        if (elJudul) {
            elJudul.textContent = judul;
        }

        if (elPengajarNama) {
            elPengajarNama.textContent = namaMentor;
        }

        if (elPengajarPeran) {
            elPengajarPeran.textContent = `Mentor ${namaProgram}`;
        }

        if (elPengajarInisial) {
            elPengajarInisial.textContent = getInisialMentor(namaMentor);
        }

        if (elTanggal) {
            elTanggal.textContent = `📅 ${tanggal}`;
        }

        if (elKelas) {
            elKelas.textContent = namaProgram;
        }

        if (elBerkasNama) {
            elBerkasNama.textContent = namaFile;
        }

        if (elBerkasInfo) {
            elBerkasInfo.textContent = `Format: ${formatFile} • Diunggah ${tanggal}`;
        }

        if (elPetunjuk) {
            elPetunjuk.textContent =
                "Silakan baca dan pelajari materi yang telah diberikan mentor. Materi ini dapat digunakan sebagai acuan dalam mengerjakan Daily Report.";
        }

        // DESKRIPSI HTML
        if (elDeskripsi) {
            elDeskripsi.innerHTML = sanitasiHTMLMateri(data.konten_materi);
        }

        if (elBadgeContainer) {
            elBadgeContainer.innerHTML = `
                <span class="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 font-bold text-[10px]">
                    ${escapeHTMLMateri(namaProgram)}
                </span>

                <span class="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-semibold text-[10px]">
                    ${escapeHTMLMateri(formatFile)}
                </span>

                <span class="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 font-bold text-[10px] flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Tersedia
                </span>
            `;
        }

        // =================================================
        // MENGATUR TOMBOL LIHAT FILE DAN UNDUH
        // =================================================

        if (fileUrl) {
            const modal = document.getElementById("modal-detail-materi");

            if (modal) {
                const buttons = modal.querySelectorAll("button, a");

                buttons.forEach(button => {
                    const text = button.textContent.trim().toLowerCase();

                    if (
                        text.includes("lihat file") ||
                        text.includes("unduh")
                    ) {
                        button.dataset.fileMateriUrl = fileUrl;
                        button.dataset.fileMateriNama = namaFile;
                    }
                });
            }
        } else {
            const modal = document.getElementById("modal-detail-materi");

            if (modal) {
                modal.querySelectorAll("button, a").forEach(button => {
                    const text = button.textContent.trim().toLowerCase();

                    if (
                        text.includes("lihat file") ||
                        text.includes("unduh")
                    ) {
                        button.dataset.fileMateriUrl = "";
                    }
                });
            }
        }
    }

    // =================================================
    // EVENT MODAL
    // =================================================

    function initModalEvents() {
        if (modalMateriEventsInitialized) return;

        const modal = document.getElementById("modal-detail-materi");
        const closeBtn = document.getElementById("modal-materi-close-btn");
        const okBtn = document.getElementById("modal-materi-ok-btn");

        if (!modal) return;

        const closeModal = () => modal.classList.add("hidden");

        if (closeBtn) {
            closeBtn.onclick = closeModal;
        }

        if (okBtn) {
            okBtn.onclick = closeModal;
        }

        modal.onclick = (e) => {
            if (e.target === modal) {
                closeModal();
            }
        };

        modalMateriEventsInitialized = true;
    }

    // =================================================
    // EVENT KLIK GLOBAL
    // =================================================

    if (!window._eventMateriSiswaTerpasang) {
        document.addEventListener("click", async (e) => {

            // Tombol akses materi
            const btnMateri = e.target.closest(".btn-akses-materi");

            if (btnMateri) {
                e.preventDefault();

                const materiId = btnMateri.dataset.id;

                const berhasil = await loadModalHtml();

                if (!berhasil) return;

                populateModalData(materiId);

                const modal = document.getElementById("modal-detail-materi");

                if (modal) {
                    modal.classList.remove("hidden");
                }

                return;
            }

            // Tombol lihat file / unduh di modal
            const btnFile = e.target.closest("[data-file-materi-url]");

            if (btnFile) {
                e.preventDefault();

                const fileUrl = btnFile.dataset.fileMateriUrl;

                if (!fileUrl) {
                    alert("File materi belum tersedia.");
                    return;
                }

                const textButton = btnFile.textContent.trim().toLowerCase();

                if (textButton.includes("unduh")) {
                    const link = document.createElement("a");

                    link.href = fileUrl;
                    link.download = btnFile.dataset.fileMateriNama || "";
                    link.target = "_blank";

                    document.body.appendChild(link);
                    link.click();
                    link.remove();

                } else {
                    window.open(fileUrl, "_blank");
                }
            }
        });

        window._eventMateriSiswaTerpasang = true;
    }

    // =================================================
    // ESCAPE UNTUK MENUTUP MODAL
    // =================================================

    if (!window._eventEscapeMateriTerpasang) {
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                const modal = document.getElementById("modal-detail-materi");

                if (modal && !modal.classList.contains("hidden")) {
                    modal.classList.add("hidden");
                }
            }
        });

        window._eventEscapeMateriTerpasang = true;
    }
}
