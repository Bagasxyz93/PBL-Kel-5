/* =========================================================
LOGIKA HALAMAN KELOLA MATERI MENTOR
========================================================= */

const dataMateri = [
    {
        no: 1,
        title: "Pengantar Inkubasi Dasar",
        desc: "Orientasi awal ekosistem, target milestone, dan kontrak belajar santri incubator.",
        program: "Web Development",
        format: "PDF",
        status: "Publik",
        date: "12-10-2026",
        iconType: "pdf"
    },
    {
        no: 2,
        title: "Modul Perancangan MVP & Prototype",
        desc: "Metode perumusan Minimum Viable Product, user flow, dan wireframing kilat.",
        program: "Web Development",
        format: "Video",
        status: "Publik",
        date: "10-10-2026",
        iconType: "video"
    },
    {
        no: 3,
        title: "Slide Pitching Investor",
        desc: "Framework 10-slide presentasi startup untuk demo day dan kurasi funding.",
        program: "Web Development",
        format: "PPT",
        status: "Publik",
        date: "08-10-2026",
        iconType: "ppt"
    },
    {
        no: 4,
        title: "Video Panduan Financial Model",
        desc: "Simulasi cashflow, COGS, dan perhitungan runway bisnis bagi pemula.",
        program: "Web Development",
        format: "Link",
        status: "Draft",
        date: "06-10-2026",
        iconType: "link"
    },
    {
        no: 5,
        title: "Modul 1 - Riset Validasi Masalah",
        desc: "Kuesioner wawancara pelanggan, pemetaan pain-points, dan empathy map.",
        program: "Web Development",
        format: "PDF",
        status: "Publik",
        date: "02-10-2026",
        iconType: "pdf"
    }
];

export function initMentorMateri() {
    console.log("Modul Kelola Materi Mentor berhasil dimuat.");

    const tableBody = document.getElementById("table-materi-body");
    const searchInput = document.getElementById("input-search-materi");
    const filterFormat = document.getElementById("filter-format");
    const btnReset = document.getElementById("btn-reset-filter");

    // Fungsi render baris tabel
    function renderTable(data) {
        if (!tableBody) return;

        if (data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" class="py-6 text-center text-slate-400">Tidak ada materi yang ditemukan.</td></tr>`;
            return;
        }

        tableBody.innerHTML = data.map(item => {
            // Tentukan warna badge format & status
            let formatBadgeClass = "bg-slate-100 text-slate-600";
            if (item.format === "PDF") formatBadgeClass = "bg-red-50 text-red-600";
            else if (item.format === "Video") formatBadgeClass = "bg-blue-50 text-blue-600";
            else if (item.format === "PPT") formatBadgeClass = "bg-purple-50 text-purple-600";
            else if (item.format === "Link") formatBadgeClass = "bg-amber-50 text-amber-600";

            let statusBadgeClass = item.status === "Publik" 
                ? "bg-emerald-50 text-emerald-600 font-semibold" 
                : "bg-slate-100 text-slate-500 font-medium";

            let iconSvg = `<svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;
            if (item.iconType === "video") {
                iconSvg = `<svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>`;
            } else if (item.iconType === "ppt") {
                iconSvg = `<svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`;
            } else if (item.iconType === "link") {
                iconSvg = `<svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`;
            }

            return `
                <tr class="hover:bg-slate-50/80 transition">
                    <td class="py-4 px-6 font-semibold text-slate-500">${item.no}</td>
                    <td class="py-4 px-6">
                        <div class="flex items-start gap-3">
                            <div class="p-2 rounded-xl bg-slate-100 mt-0.5 shrink-0">
                                ${iconSvg}
                            </div>
                            <div>
                                <h4 class="font-bold text-slate-900">${item.title}</h4>
                                <p class="text-[11px] text-slate-400 mt-0.5 leading-relaxed">${item.desc}</p>
                            </div>
                        </div>
                    </td>
                    <td class="py-4 px-6">
                        <span class="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium">${item.program}</span>
                    </td>
                    <td class="py-4 px-6">
                        <span class="px-2.5 py-1 rounded-full ${formatBadgeClass} text-[10px] font-bold">${item.format}</span>
                    </td>
                    <td class="py-4 px-6">
                        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${statusBadgeClass} text-[11px]">
                            ${item.status === "Publik" ? '<span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>' : ''}
                            ${item.status}
                        </span>
                    </td>
                    <td class="py-4 px-6 font-medium text-slate-500 text-[11px]">${item.date}</td>
                </tr>
            `;
        }).join("");
    }

    // Render awal
    renderTable(dataMateri);

    // Filter Interaktif Pencarian & Format
    function applyFilters() {
        const keyword = (searchInput ? searchInput.value : "").toLowerCase();
        const formatVal = (filterFormat ? filterFormat.value : "").toLowerCase();

        const filtered = dataMateri.filter(item => {
            const matchKeyword = item.title.toLowerCase().includes(keyword) || item.desc.toLowerCase().includes(keyword);
            const matchFormat = formatVal === "" || item.format.toLowerCase() === formatVal;
            return matchKeyword && matchFormat;
        });

        renderTable(filtered);
    }

    if (searchInput) searchInput.addEventListener("input", applyFilters);
    if (filterFormat) filterFormat.addEventListener("change", applyFilters);

    if (btnReset) {
        btnReset.addEventListener("click", () => {
            if (searchInput) searchInput.value = "";
            if (filterFormat) filterFormat.value = "";
            renderTable(dataMateri);
        });
    }
}