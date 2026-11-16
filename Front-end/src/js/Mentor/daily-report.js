/* =========================================================
LOGIKA HALAMAN KELOLA DAILY REPORT MENTOR (SINGLE POP-UP TOGGLE)
========================================================= */

const databaseSiswaReport = {
    "1234567801": {
        nama: "Ahmad Fauzi",
        nis: "1234567801",
        program: "Web Development",
        inisial: "AF",
        keaktifan: "96% Sangat Rajin",
        totalLaporan: 15,
        diterima: 10,
        menunggu: 4,
        revisi: 1,
        riwayat: [
            { 
                id: "rep-01",
                no: 1, 
                tanggal: "17 Okt 2026", 
                waktu: "17:15 WIB", 
                judul: "Mengerjakan rancangan prototype dan alur checkout", 
                deskripsi: "Hari ini saya mengerjakan bagian UI pada project MVP inkubasi. Modul katalog sudah selesai, namun kendala masih bingung dengan integrasi payment gateway sandbox.", 
                lampiranTipe: "📎 1 File", 
                lampiranNama: "Dokumentasi_Progress_Checkout.pdf",
                lampiranUkuran: "Format Dokumen PDF • 2.4 MB",
                status: "Menunggu Tinjauan Mentor", 
                statusBadgeClass: "bg-amber-50 text-amber-600 border border-amber-200" 
            },
            { 
                id: "rep-02",
                no: 2, 
                tanggal: "16 Okt 2026", 
                waktu: "16:40 WIB", 
                judul: "Riset 15 Pelanggan Potensial (Customer Validation)", 
                deskripsi: "Telah melakukan wawancara langsung ke 10 mahasiswa terkait kebutuhan aplikasi.", 
                lampiranTipe: "📊 Sheet", 
                lampiranNama: "Sheet_Validasi_Customer.xlsx",
                lampiranUkuran: "Microsoft Excel • 1.1 MB",
                status: "Diterima", 
                statusBadgeClass: "bg-emerald-50 text-emerald-600 border border-emerald-200" 
            }
        ]
    }
};

const dataDailyReports = [
    { no: 1, nama: "Ahmad Fauzi", nis: "1234567801", program: "Web Development", waktu: "17:15 WIB", judul: "Mengerjakan rancangan prototype dan alur checkout", deskripsi: "Modul katalog sudah selesai.", lampiran: "Dokumentasi_Progress_Checkout.pdf", status: "Menunggu" }
];

export function initMentorDailyReport() {
    console.log("Modul Kelola Daily Report Mentor berhasil dimuat.");

    const tableBody = document.getElementById("table-report-body");
    let activeNisSiswa = "1234567801";

    function renderTable(data) {
        if (!tableBody) return;
        tableBody.innerHTML = data.map((item, idx) => `
            <tr class="hover:bg-slate-50/80 transition align-top">
                <td class="py-4 px-6 font-semibold text-slate-400">${idx + 1}</td>
                <td class="py-4 px-6 font-bold text-slate-900">${item.nama}</td>
                <td class="py-4 px-6"><span class="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">${item.program}</span></td>
                <td class="py-4 px-6 font-medium text-slate-700 text-xs">${item.waktu}</td>
                <td class="py-4 px-6"><p class="font-bold text-slate-900 text-xs">${item.judul}</p></td>
                <td class="py-4 px-6"><span class="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px]">📄 ${item.lampiran}</span></td>
                <td class="py-4 px-6"><span class="px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[11px] font-bold">${item.status}</span></td>
                <td class="py-4 px-6 text-center">
                    <button type="button" class="btn-buka-modal px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs transition" data-nis="${item.nis}">Detail ↗</button>
                </td>
            </tr>
        `).join("");
    }

    renderTable(dataDailyReports);

    // Fungsi Utama Memuat File Pop-up Sekali Saja
    async function ensureModalLoaded() {
        const container = document.getElementById("daily-report-modal-container");
        if (!container) return false;

        if (!container.innerHTML.trim()) {
            try {
                // Cukup fetch satu file pop-up gabungan yang memiliki id="modal-detail-daily-report"
                const response = await fetch('../../component/Mentor/pop-up-detail-daily-report.html');
                if (response.ok) {
                    container.innerHTML = await response.text();
                    setupModalEvents();
                } else {
                    console.error("Gagal memuat file pop-up.");
                    return false;
                }
            } catch (err) {
                console.error("Kesalahan jaringan:", err);
                return false;
            }
        }
        return true;
    }

    // 1. Buka Pop-up Tampilkan Daftar Riwayat
    window.openDailyReportModal = async (nisSiswa) => {
        const loaded = await ensureModalLoaded();
        if (!loaded) return;

        activeNisSiswa = nisSiswa;
        const dataSiswa = databaseSiswaReport[nisSiswa] || databaseSiswaReport["1234567801"];

        // Atur Tampilan: Tampilkan Riwayat, Sembunyikan Detail
        document.getElementById("modal-view-riwayat").classList.remove("hidden");
        document.getElementById("modal-view-detail").classList.add("hidden");

        // Isi Data Profil & Statistik
        document.getElementById("modal-siswa-initial").textContent = dataSiswa.inisial;
        document.getElementById("modal-siswa-nama").textContent = dataSiswa.nama;
        document.getElementById("modal-siswa-info").innerHTML = `NIS: ${dataSiswa.nis} • <span class="text-indigo-600 font-semibold">${dataSiswa.program}</span>`;
        document.getElementById("modal-siswa-keaktifan").textContent = dataSiswa.keaktifan;
        document.getElementById("stat-total-laporan").textContent = dataSiswa.totalLaporan;
        document.getElementById("stat-diterima").textContent = dataSiswa.diterima;
        document.getElementById("stat-menunggu").textContent = dataSiswa.menunggu;
        document.getElementById("stat-revisi").textContent = dataSiswa.revisi;

        // Render Baris Tabel Riwayat di dalam Pop-up
        const tbody = document.getElementById("modal-riwayat-tbody");
        if (tbody) {
            tbody.innerHTML = dataSiswa.riwayat.map(item => `
                <tr class="hover:bg-slate-50/50 transition">
                    <td class="py-3.5 px-4 font-bold text-slate-700">${item.no}</td>
                    <td class="py-3.5 px-4"><span class="font-bold text-slate-800 block">${item.tanggal}</span><span class="text-[10px] text-slate-400">${item.waktu}</span></td>
                    <td class="py-3.5 px-4"><span class="font-bold text-slate-800 block">${item.judul}</span><span class="text-[11px] text-slate-500">${item.deskripsi}</span></td>
                    <td class="py-3.5 px-4"><span class="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-bold">${item.lampiranTipe}</span></td>
                    <td class="py-3.5 px-4"><span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${item.statusBadgeClass}">${item.status}</span></td>
                    <td class="py-3.5 px-4 text-center">
                        <button type="button" class="btn-buka-detail-laporan px-3.5 py-1.5 rounded-xl text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 transition" data-nis="${dataSiswa.nis}" data-id="${item.id}">
                            Detail
                        </button>
                    </td>
                </tr>
            `).join("");
        }

        // Tampilkan Modal Utama
        document.getElementById("modal-detail-daily-report").classList.remove("hidden");
    };

    // 2. Buka Tampilan Detail Per Laporan (Tanpa Fetch Ulang, Cukup Toggle View)
    window.openDetailLaporanModal = async (nisSiswa, reportId) => {
        const loaded = await ensureModalLoaded();
        if (!loaded) return;

        const dataSiswa = databaseSiswaReport[nisSiswa] || databaseSiswaReport["1234567801"];
        const report = dataSiswa.riwayat.find(r => r.id === reportId) || dataSiswa.riwayat[0];

        // Atur Tampilan: Sembunyikan Riwayat, Tampilkan View Detail
        document.getElementById("modal-view-riwayat").classList.add("hidden");
        document.getElementById("modal-view-detail").classList.remove("hidden");

        // Isi Data ke Form Detail Laporan
        document.getElementById("detail-nama-siswa").textContent = dataSiswa.nama;
        document.getElementById("detail-info-siswa").innerHTML = `${dataSiswa.program} • NIS: ${dataSiswa.nis} • Pembimbing: Ibu Sari Lestari`;
        document.getElementById("detail-tanggal").textContent = report.tanggal;
        document.getElementById("detail-status").innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-500 mr-1.5 inline-block"></span>${report.status}`;
        document.getElementById("detail-judul").textContent = report.judul;
        document.getElementById("detail-deskripsi").textContent = report.deskripsi;
        document.getElementById("detail-lampiran-nama").textContent = report.lampiranNama;
        document.getElementById("detail-lampiran-info").textContent = report.lampiranUkuran;

        document.getElementById("modal-detail-daily-report").classList.remove("hidden");
    };

    function setupModalEvents() {
        const modalEl = document.getElementById("modal-detail-daily-report");
        const closeBtn = document.getElementById("modal-close-btn");
        const closeFooterBtn = document.getElementById("modal-close-footer-btn");

        if (closeBtn && modalEl) {
            closeBtn.onclick = (e) => { e.preventDefault(); modalEl.classList.add("hidden"); };
        }
        if (closeFooterBtn && modalEl) {
            closeFooterBtn.onclick = (e) => { e.preventDefault(); modalEl.classList.add("hidden"); };
        }
        if (modalEl) {
            modalEl.onclick = (e) => { if (e.target === modalEl) modalEl.classList.add("hidden"); };
        }
    }

    // Event Listener Global Interaksi Klik
    document.addEventListener("click", (e) => {
        const targetMainBtn = e.target.closest(".btn-buka-modal");
        if (targetMainBtn) {
            e.preventDefault();
            const nisSiswa = targetMainBtn.dataset.nis;
            if (nisSiswa) window.openDailyReportModal(nisSiswa);
        }

        const targetDetailBtn = e.target.closest(".btn-buka-detail-laporan");
        if (targetDetailBtn) {
            e.preventDefault();
            const nisSiswa = targetDetailBtn.dataset.nis;
            const reportId = targetDetailBtn.dataset.id;
            if (nisSiswa && reportId) {
                window.openDetailLaporanModal(nisSiswa, reportId);
            }
        }

        const targetBackBtn = e.target.closest(".btn-kembali-ke-riwayat");
        if (targetBackBtn) {
            e.preventDefault();
            window.openDailyReportModal(activeNisSiswa);
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initMentorDailyReport();
});