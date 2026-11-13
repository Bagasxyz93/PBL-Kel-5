import { initFormUnggahMateri } from './form-tambah-materi.js';

export function initMentorMateri() {
    console.log("Modul Kelola Materi Mentor berhasil dimuat.");

    const viewList = document.getElementById("view-list-materi");
    const viewForm = document.getElementById("view-form-materi");
    const btnUnggahHeader = document.getElementById("btn-unggahl-materi");

    const tableBody = document.getElementById("table-materi-body");
    const searchInput = document.getElementById("input-search-materi");
    const filterFormat = document.getElementById("filter-format");
    const filterProgram = document.getElementById("filter-program");
    const btnReset = document.getElementById("btn-reset-filter");

    const paginationInfo = document.getElementById("pagination-info");
    const paginationButtons = document.getElementById("pagination-buttons");

    let currentPage = 1;
    const itemsPerPage = 5;
    let filteredMateri = [];

    let dataMateri = [];
    let dataProgram = [];

    // Menghitung statistik materi
    function updateStatistikMateri() {
        const totalMateri = dataMateri.length;

        const totalPDF = dataMateri.filter(
            item => item.format === "PDF"
        ).length;

        const totalVideo = dataMateri.filter(
            item => item.format === "Video"
        ).length;

        const totalPPTLink = dataMateri.filter(
            item => item.format === "PPT" || item.format === "Link"
        ).length;

        // Menghitung materi yang diunggah bulan ini
        const sekarang = new Date();

        const bulanSekarang =
            `${sekarang.getFullYear()}-${String(sekarang.getMonth() + 1).padStart(2, "0")}`;

        const materiBulanIni = dataMateri.filter(item =>
            String(item.tanggal_publikasi || "").startsWith(bulanSekarang)
        ).length;

        // Menghitung persentase PDF
        const persentasePDF = totalMateri > 0
            ? Math.round((totalPDF / totalMateri) * 100)
            : 0;

        document.getElementById("total-materi-rilis").textContent = totalMateri;
        document.getElementById("materi-bulan-ini").textContent =
            `${materiBulanIni} materi bulan ini`;

        document.getElementById("total-pdf").textContent = totalPDF;
        document.getElementById("persentase-pdf").textContent =
            `${persentasePDF}% dari total ajar`;

        document.getElementById("total-video").textContent = totalVideo;
        document.getElementById("total-ppt-link").textContent = totalPPTLink;
    }

    // Mencegah teks dari database dianggap sebagai HTML
    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[char]);
    }

    // Membersihkan HTML deskripsi dan mempertahankan format yang diizinkan
    function sanitizeDescription(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(String(html ?? ""), "text/html");

        const tagDiizinkan = [
            "P", "DIV", "BR",
            "B", "STRONG", "I", "EM", "U",
            "UL", "OL", "LI", "A"
        ];

        function bersihkan(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                return document.createTextNode(node.textContent);
            }

            if (node.nodeType !== Node.ELEMENT_NODE) {
                return document.createDocumentFragment();
            }

            const tag = node.tagName;

            // Hilangkan elemen yang berpotensi berbahaya
            if (["SCRIPT", "STYLE", "IFRAME", "OBJECT", "SVG"].includes(tag)) {
                return document.createDocumentFragment();
            }

            // Tag yang tidak diizinkan dibuang, tetapi teks anaknya dipertahankan
            if (!tagDiizinkan.includes(tag)) {
                const fragment = document.createDocumentFragment();

                node.childNodes.forEach(anak => {
                    fragment.appendChild(bersihkan(anak));
                });

                return fragment;
            }

            const elemenBaru = document.createElement(tag.toLowerCase());

            // Khusus link, hanya izinkan URL HTTP dan HTTPS
            if (tag === "A") {
                try {
                    const url = new URL(node.getAttribute("href") || "");

                    if (["http:", "https:"].includes(url.protocol)) {
                        elemenBaru.href = url.href;
                        elemenBaru.target = "_blank";
                        elemenBaru.rel = "noopener noreferrer";
                    }
                } catch (error) {
                    // Link tidak valid ditampilkan tanpa tautan
                }
            }

            node.childNodes.forEach(anak => {
                elemenBaru.appendChild(bersihkan(anak));
            });

            return elemenBaru;
        }

        const hasil = document.createElement("div");

        doc.body.childNodes.forEach(node => {
            hasil.appendChild(bersihkan(node));
        });

        return hasil.innerHTML;
    }

    // Mengenali format berdasarkan file atau tautan
    function getFormat(file, konten) {
        // Jika ada file yang diunggah, periksa format filenya
        if (file) {
            const value = String(file).trim().toLowerCase();

            if (/\.pdf(\?.*)?$/.test(value)) return "PDF";
            if (/\.(ppt|pptx)(\?.*)?$/.test(value)) return "PPT";
            if (/\.zip(\?.*)?$/.test(value)) return "ZIP";
            if (/\.(mp4|webm|mov)(\?.*)?$/.test(value)) return "Video";

            if (/^https?:\/\//.test(value)) return "Link";

            return "Lainnya";
        }

        // Jika tidak ada file, periksa URL di deskripsi materi
        if (konten) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(
                String(konten),
                "text/html"
            );

            // Periksa tautan dari tombol/link editor
            const linkHTML = Array.from(
                doc.querySelectorAll("a[href]")
            ).some(link => {
                try {
                    const url = new URL(link.getAttribute("href"));

                    return ["http:", "https:"].includes(url.protocol);
                } catch {
                    return false;
                }
            });

            // Periksa URL yang ditulis langsung sebagai teks
            const linkTeks = /https?:\/\/[^\s<>"']+/i.test(
                doc.body.textContent
            );

            if (linkHTML || linkTeks) {
                return "Link";
            }
        }

        return "-";
    }


    function formatTanggal(tanggal) {
        if (!tanggal) return "-";

        const date = new Date(tanggal + "T00:00:00");

        if (isNaN(date.getTime())) return "-";

        return date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    }

    // Mengambil materi dan program dari database
    async function loadDataMateri() {
        try {
            const response = await fetch(
                "http://localhost:8000/api/mentor/api_materi.php",
                { credentials: "include" }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Gagal mengambil data materi.");
            }

            dataMateri = result.data.materi.map(item => ({
                ...item,
                format: getFormat(item.file_materi, item.konten_materi),
                status: "Publik",
                date: formatTanggal(item.tanggal_publikasi)
            }));

            dataProgram = result.data.program;

            updateStatistikMateri();
            renderFilterProgram();
            applyFilters();

        } catch (error) {
            console.error("Gagal memuat materi:", error);

            if (tableBody) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="7" class="py-12 text-center text-red-500">
                            Gagal mengambil data materi. Periksa koneksi backend dan login mentor.
                        </td>
                    </tr>
                `;
            }

            if (paginationInfo) {
                paginationInfo.textContent = "Gagal memuat data materi";
            }

            if (paginationButtons) {
                paginationButtons.innerHTML = "";
            }
        }
    }

    // Mengisi pilihan program berdasarkan program mentor
    function renderFilterProgram() {
        if (!filterProgram) return;

        filterProgram.innerHTML = `
            <option value="">Semua Program</option>
            ${dataProgram.map(program => `
                <option value="${escapeHTML(program.id)}">
                    ${escapeHTML(program.nama_program)}
                </option>
            `).join("")}
        `;
    }

    // Berpindah antara halaman daftar dan form
    async function switchView(target) {
        if (!viewList || !viewForm) return;

        if (target === "form") {
            viewList.classList.add("hidden");
            viewForm.classList.remove("hidden");

            const container = document.getElementById("form-unggahl-container");

            if (container && !container.innerHTML.trim()) {
                try {
                    const response = await fetch(
                        "/component/Mentor/form-tambah-materi.html"
                    );

                    if (!response.ok) {
                        throw new Error("Gagal memuat form.");
                    }

                    container.innerHTML = await response.text();

                    initFormUnggahMateri(() => switchView("list"));

                } catch (error) {
                    console.error(error);

                    container.innerHTML = `
                        <p class="text-rose-500">
                            Gagal memuat komponen form tambah materi.
                        </p>
                    `;
                }
            }

            setupFormListeners();

        } else {
            viewForm.classList.add("hidden");
            viewList.classList.remove("hidden");
            await loadDataMateri();
        }

        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Mengatur tombol kembali ke daftar materi
    function setupFormListeners() {
        const btnBackToList = document.getElementById("btn-back-to-list");
        const breadcrumbBack = document.getElementById("breadcrumb-back-list");

        if (btnBackToList) {
            btnBackToList.onclick = () => switchView("list");
        }

        if (breadcrumbBack) {
            breadcrumbBack.onclick = () => switchView("list");
        }
    }

    // Tombol unggah materi
    if (btnUnggahHeader) {
        btnUnggahHeader.addEventListener("click", () => switchView("form"));
    }

    // Menampilkan daftar materi sesuai halaman aktif
    function renderTable(data) {
        if (!tableBody) return;

        const totalData = data.length;
        const totalPages = Math.ceil(totalData / itemsPerPage);

        if (totalPages === 0) {
            currentPage = 1;
        } else if (currentPage > totalPages) {
            currentPage = totalPages;
        }

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, totalData);
        const dataHalaman = data.slice(startIndex, endIndex);

        // Informasi jumlah data
        if (paginationInfo) {
            paginationInfo.textContent = totalData === 0
                ? "Menampilkan 0 dari 0 materi"
                : `Menampilkan ${startIndex + 1} - ${endIndex} dari ${totalData} materi`;
        }

        // Jika tidak ada data
        if (totalData === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="py-12 text-center text-slate-400">
                        Tidak ada materi yang ditemukan.
                    </td>
                </tr>
            `;

            renderPagination(0);
            return;
        }

        // Menampilkan data sesuai halaman
        tableBody.innerHTML = dataHalaman.map((item, index) => {
            let formatClass = "bg-slate-100 text-slate-600";

            if (item.format === "PDF") {
                formatClass = "bg-red-50 text-red-600";
            } else if (item.format === "Video") {
                formatClass = "bg-blue-50 text-blue-600";
            } else if (item.format === "PPT") {
                formatClass = "bg-purple-50 text-purple-600";
            } else if (item.format === "Link") {
                formatClass = "bg-sky-50 text-sky-600";
            }

            return `
                <tr class="hover:bg-slate-50/80 transition">
                    <td class="py-4 px-6 font-semibold text-slate-400">
                        ${startIndex + index + 1}
                    </td>

                    <td class="py-4 px-6">
                        <div>
                            <h4 class="font-bold text-slate-900">
                                ${escapeHTML(item.judul)}
                            </h4>

                            <div class="text-[11px] text-slate-400 mt-1 leading-relaxed
                                [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-1
                                [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-1
                                [&_li]:list-item
                                [&_b]:font-bold [&_strong]:font-bold
                                [&_i]:italic [&_em]:italic
                                [&_u]:underline">
                                ${sanitizeDescription(item.konten_materi || "-")}
                            </div>

                            ${item.file_materi ? `
                                <a
                                    href="http://localhost:8000/${escapeHTML(item.file_materi)}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold text-sky-600 hover:text-sky-700">
                                                        
                                    <i class="fas fa-external-link-alt"></i>
                                    Lihat File Materi
                                </a>
                            ` : ""}
                        </div>
                    </td>

                    <td class="py-4 px-6">
                        <span class="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">
                            ${escapeHTML(item.nama_program)}
                        </span>
                    </td>

                    <td class="py-4 px-6">
                        <span class="px-2.5 py-1 rounded-md ${formatClass} text-[10px] font-bold">
                            ${escapeHTML(item.format)}
                        </span>
                    </td>

                    <td class="py-4 px-6">
                        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold">
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Publik
                        </span>
                    </td>

                    <td class="py-4 px-6 font-medium text-slate-500 text-[11px]">
                        ${escapeHTML(item.date)}
                    </td>

                    <td class="py-4 px-6 text-center">
                        <button
                            type="button"
                            data-hapus-materi="${escapeHTML(item.id)}"
                            title="Hapus"
                            aria-label="Hapus materi"
                            class="w-8 h-8 inline-flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition">

                            <svg xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round">
                                <path d="M3 6h18"/>
                                <path d="M8 6V4h8v2"/>
                                <path d="M19 6l-1 14H6L5 6"/>
                                <path d="M10 11v6"/>
                                <path d="M14 11v6"/>
                            </svg>
                        </button>
                    </td>
                </tr>
            `;
        }).join("");

        renderPagination(totalPages);
    }

    // Membuat tombol pagination
    function renderPagination(totalPages) {
        if (!paginationButtons) return;

        if (totalPages === 0) {
            paginationButtons.innerHTML = "";
            return;
        }

        let buttons = `
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

        for (let page = 1; page <= totalPages; page++) {
            buttons += `
                <button
                    type="button"
                    data-page="${page}"
                    class="w-8 h-8 rounded-lg border flex items-center justify-center
                    ${page === currentPage
                        ? "bg-[#00b09b] text-white border-[#00b09b] font-bold"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"}">
                    ${page}
                </button>
            `;
        }

        buttons += `
            <button
                type="button"
                data-page="${currentPage + 1}"
                ${currentPage === totalPages ? "disabled" : ""}
                class="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center
                ${currentPage === totalPages
                    ? "text-slate-300 cursor-not-allowed"
                    : "text-slate-600 hover:bg-slate-50"}">
                &gt;
            </button>
        `;

        paginationButtons.innerHTML = buttons;
    }

    // Event tombol pagination
    if (paginationButtons) {
        paginationButtons.addEventListener("click", (event) => {
            const tombol = event.target.closest("[data-page]");

            if (!tombol || tombol.disabled) return;

            const halaman = Number(tombol.dataset.page);

            if (halaman < 1 || halaman > Math.ceil(filteredMateri.length / itemsPerPage)) {
                return;
            }

            currentPage = halaman;
            renderTable(filteredMateri);
        });
    }

    // Menghapus materi dari database
    async function hapusMateri(id) {
        const konfirmasi = confirm(
            "Apakah kamu yakin ingin menghapus materi ini?"
        );

        if (!konfirmasi) return;

        try {
            const response = await fetch(
                "http://localhost:8000/api/mentor/api_materi.php",
                {
                    method: "DELETE",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ id: id })
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Gagal menghapus materi."
                );
            }

            alert("Materi berhasil dihapus.");

            // Memuat ulang daftar materi
            await loadDataMateri();

        } catch (error) {
            console.error("Gagal menghapus materi:", error);

            alert(error.message || "Terjadi kesalahan saat menghapus materi.");
        }
    }

    // Event tombol hapus materi
    if (tableBody) {
        tableBody.addEventListener("click", async (event) => {
            const tombolHapus = event.target.closest("[data-hapus-materi]");

            if (!tombolHapus) return;

            const id = tombolHapus.dataset.hapusMateri;

            await hapusMateri(id);
        });
    }

    // Pencarian dan filter
    function applyFilters() {
        const keyword = searchInput?.value.toLowerCase() || "";
        const formatValue = filterFormat?.value.toLowerCase() || "";
        const programValue = filterProgram?.value || "";

        const filtered = dataMateri.filter(item => {
            const cocokKeyword =
                (item.judul || "").toLowerCase().includes(keyword) ||
                (item.konten_materi || "").toLowerCase().includes(keyword);

            const cocokFormat =
                !formatValue || item.format.toLowerCase() === formatValue;

            const cocokProgram =
                !programValue || String(item.program_id) === programValue;

            return cocokKeyword && cocokFormat && cocokProgram;
        });

        currentPage = 1;
        filteredMateri = filtered;

        renderTable(filteredMateri);
    }

    // Event pencarian
    if (searchInput) {
        searchInput.addEventListener("input", applyFilters);
    }

    // Event filter format
    if (filterFormat) {
        filterFormat.addEventListener("change", applyFilters);
    }

    // Event filter program
    if (filterProgram) {
        filterProgram.addEventListener("change", applyFilters);
    }

    // Reset filter
    if (btnReset) {
        btnReset.addEventListener("click", () => {
            if (searchInput) searchInput.value = "";
            if (filterFormat) filterFormat.value = "";
            if (filterProgram) filterProgram.value = "";

            currentPage = 1;
            applyFilters();
        });
    }

    loadDataMateri();
}

document.addEventListener("DOMContentLoaded", () => {
    initMentorMateri();
});