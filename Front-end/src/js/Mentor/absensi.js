/* =========================================================
LOGIKA HALAMAN REKAP ABSENSI MENTOR & POP-UP DETAIL
========================================================= */

// Database dummy lengkap dengan riwayat 5 hari terakhir untuk masing-masing siswa
const databaseAbsensiSiswa = {
    "1234567801": {
        nama: "Ahmad Fauzi",
        nisn: "1234567801",
        nis: "1234567801",
        sub: "Startup Tech",
        program: "Web Development",
        inisial: "AF",
        persentaseKehadiran: "92% | Batch 2 Inkubasi",
        tanggalTerbaru: "20 Oktober 2025",
        jamMasuk: "07:48 WIB",
        jamKeluar: "16:02 WIB",
        statusTerbaru: "● Hadir",
        riwayat: [
            { no: 1, tanggal: "20 Oktober 2025", jamMasuk: "07:48 WIB", jamKeluar: "16:02 WIB", status: "● Hadir", statusClass: "text-emerald-600 font-bold", keterangan: "Presensi berhasil." },
            { no: 2, tanggal: "21 Oktober 2025", jamMasuk: "-", jamKeluar: "-", status: "● Izin", statusClass: "text-blue-600 font-bold", keterangan: "Izin disetujui (Dispensasi)." },
            { no: 3, tanggal: "22 Oktober 2025", jamMasuk: "07:55 WIB", jamKeluar: "16:05 WIB", status: "● Hadir", statusClass: "text-emerald-600 font-bold", keterangan: "Presensi berhasil." },
            { no: 4, tanggal: "23 Oktober 2025", jamMasuk: "-", jamKeluar: "-", status: "● Sakit", statusClass: "text-rose-600 font-bold", keterangan: "Surat dokter terlampir." },
            { no: 5, tanggal: "24 Oktober 2025", jamMasuk: "07:50 WIB", jamKeluar: "16:00 WIB", status: "● Hadir", statusClass: "text-emerald-600 font-bold", keterangan: "Presensi berhasil." }
        ]
    },
    "1234567802": {
        nama: "Siti Aisyah",
        nisn: "1234567802",
        nis: "1234567802",
        sub: "Creative Media",
        program: "Web Development",
        inisial: "SA",
        persentaseKehadiran: "96% | Batch 2 Inkubasi",
        tanggalTerbaru: "20 Oktober 2025",
        jamMasuk: "07:55 WIB",
        jamKeluar: "16:10 WIB",
        statusTerbaru: "● Hadir",
        riwayat: [
            { no: 1, tanggal: "20 Oktober 2025", jamMasuk: "07:55 WIB", jamKeluar: "16:10 WIB", status: "● Hadir", statusClass: "text-emerald-600 font-bold", keterangan: "Presensi berhasil." },
            { no: 2, tanggal: "21 Oktober 2025", jamMasuk: "07:50 WIB", jamKeluar: "16:00 WIB", status: "● Hadir", statusClass: "text-emerald-600 font-bold", keterangan: "Presensi berhasil." },
            { no: 3, tanggal: "22 Oktober 2025", jamMasuk: "-", jamKeluar: "-", status: "● Izin", statusClass: "text-blue-600 font-bold", keterangan: "Izin keperluan keluarga." },
            { no: 4, tanggal: "23 Oktober 2025", jamMasuk: "07:45 WIB", jamKeluar: "16:05 WIB", status: "● Hadir", statusClass: "text-emerald-600 font-bold", keterangan: "Presensi berhasil." },
            { no: 5, tanggal: "24 Oktober 2025", jamMasuk: "07:42 WIB", jamKeluar: "16:00 WIB", status: "● Hadir", statusClass: "text-emerald-600 font-bold", keterangan: "Presensi berhasil." }
        ]
    },
    "1234567803": {
        nama: "Budi Santoso",
        nisn: "1234567803",
        nis: "1234567803",
        sub: "AgriTech",
        program: "Web Development",
        inisial: "BS",
        persentaseKehadiran: "80% | Batch 2 Inkubasi",
        tanggalTerbaru: "20 Oktober 2025",
        jamMasuk: "-",
        jamKeluar: "-",
        statusTerbaru: "● Sakit",
        riwayat: [
            { no: 1, tanggal: "20 Oktober 2025", jamMasuk: "-", jamKeluar: "-", status: "● Sakit", statusClass: "text-rose-600 font-bold", keterangan: "Surat dokter terlampir." },
            { no: 2, tanggal: "21 Oktober 2025", jamMasuk: "-", jamKeluar: "-", status: "● Sakit", statusClass: "text-rose-600 font-bold", keterangan: "Surat dokter terlampir." },
            { no: 3, tanggal: "22 Oktober 2025", jamMasuk: "08:10 WIB", jamKeluar: "16:00 WIB", status: "● Hadir", statusClass: "text-emerald-600 font-bold", keterangan: "Terlambat 10 menit." },
            { no: 4, tanggal: "23 Oktober 2025", jamMasuk: "07:55 WIB", jamKeluar: "16:00 WIB", status: "● Hadir", statusClass: "text-emerald-600 font-bold", keterangan: "Presensi berhasil." },
            { no: 5, tanggal: "24 Oktober 2025", jamMasuk: "07:50 WIB", jamKeluar: "16:00 WIB", status: "● Hadir", statusClass: "text-emerald-600 font-bold", keterangan: "Presensi berhasil." }
        ]
    },
    "1234567804": {
        nama: "Rina Febriani",
        nisn: "1234567804",
        nis: "1234567804",
        sub: "E-Commerce",
        program: "Web Development",
        inisial: "RF",
        persentaseKehadiran: "94% | Batch 2 Inkubasi",
        tanggalTerbaru: "20 Oktober 2025",
        jamMasuk: "08:02 WIB",
        jamKeluar: "16:05 WIB",
        statusTerbaru: "● Hadir",
        riwayat: [
            { no: 1, tanggal: "20 Oktober 2025", jamMasuk: "08:02 WIB", jamKeluar: "16:05 WIB", status: "● Hadir", statusClass: "text-emerald-600 font-bold", keterangan: "Presensi berhasil." },
            { no: 2, tanggal: "21 Oktober 2025", jamMasuk: "07:45 WIB", jamKeluar: "16:00 WIB", status: "● Hadir", statusClass: "text-emerald-600 font-bold", keterangan: "Presensi berhasil." },
            { no: 3, tanggal: "22 Oktober 2025", jamMasuk: "07:40 WIB", jamKeluar: "16:00 WIB", status: "● Hadir", statusClass: "text-emerald-600 font-bold", keterangan: "Presensi berhasil." },
            { no: 4, tanggal: "23 Oktober 2025", jamMasuk: "07:50 WIB", jamKeluar: "16:00 WIB", status: "● Hadir", statusClass: "text-emerald-600 font-bold", keterangan: "Presensi berhasil." },
            { no: 5, tanggal: "24 Oktober 2025", jamMasuk: "07:45 WIB", jamKeluar: "16:00 WIB", status: "● Hadir", statusClass: "text-emerald-600 font-bold", keterangan: "Presensi berhasil." }
        ]
    },
    "1234567805": {
        nama: "Andi Pratama",
        nisn: "1234567805",
        nis: "1234567805",
        sub: "IoT Solutions",
        program: "Web Development",
        inisial: "AP",
        persentaseKehadiran: "88% | Batch 2 Inkubasi",
        tanggalTerbaru: "20 Oktober 2025",
        jamMasuk: "-",
        jamKeluar: "-",
        statusTerbaru: "● Izin",
        riwayat: [
            { no: 1, tanggal: "20 Oktober 2025", jamMasuk: "-", jamKeluar: "-", status: "● Izin", statusClass: "text-blue-600 font-bold", keterangan: "Izin resmi lomba." },
            { no: 2, tanggal: "21 Oktober 2025", jamMasuk: "07:50 WIB", jamKeluar: "16:00 WIB", status: "● Hadir", statusClass: "text-emerald-600 font-bold", keterangan: "Presensi berhasil." },
            { no: 3, tanggal: "22 Oktober 2025", jamMasuk: "07:45 WIB", jamKeluar: "16:00 WIB", status: "● Hadir", statusClass: "text-emerald-600 font-bold", keterangan: "Presensi berhasil." },
            { no: 4, tanggal: "23 Oktober 2025", jamMasuk: "-", jamKeluar: "-", status: "● Sakit", statusClass: "text-rose-600 font-bold", keterangan: "Surat dokter." },
            { no: 5, tanggal: "24 Oktober 2025", jamMasuk: "07:50 WIB", jamKeluar: "16:00 WIB", status: "● Hadir", statusClass: "text-emerald-600 font-bold", keterangan: "Presensi berhasil." }
        ]
    }
};

const dataAbsensiSiswaList = Object.values(databaseAbsensiSiswa);

export function initMentorAbsensi() {
    console.log("Modul Rekap Absensi Mentor berhasil dimuat.");

    const tableBody = document.getElementById("table-absensi-body");
    const searchInput = document.getElementById("input-search-absensi");
    const filterProgram = document.getElementById("filter-program");
    const btnTerapkan = document.getElementById("btn-terapkan-filter");
    const btnReset = document.getElementById("btn-reset-filter");

    // Fungsi render tabel absensi utama
    function renderTable(data) {
        if (!tableBody) return;

        if (data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="7" class="py-8 text-center text-slate-400">Tidak ada data absensi yang ditemukan.</td></tr>`;
            return;
        }

        tableBody.innerHTML = data.map((item, idx) => {
            // Badge Status Absensi
            let absenBadge = "";
            if (item.statusAbsen === "Hadir" || item.statusTerbaru?.includes("Hadir")) {
                absenBadge = `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Hadir</span>`;
            } else if (item.statusAbsen === "Sakit" || item.statusTerbaru?.includes("Sakit")) {
                absenBadge = `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-[11px] font-bold"><span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Sakit</span>`;
            } else if (item.statusAbsen === "Izin" || item.statusTerbaru?.includes("Izin")) {
                absenBadge = `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[11px] font-bold"><span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Izin</span>`;
            } else {
                absenBadge = `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 text-slate-600 text-[11px] font-bold">${item.statusAbsen || "Hadir"}</span>`;
            }

            // Badge Status Daily Report
            let reportBadge = "";
            const repStatus = item.statusReport || "Menunggu";
            if (repStatus === "Diterima") {
                reportBadge = `<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold">✓ Diterima</span>`;
            } else if (repStatus === "Ditolak") {
                reportBadge = `<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-[11px] font-bold">✕ Ditolak</span>`;
            } else {
                reportBadge = `<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[11px] font-bold">⏱ Menunggu</span>`;
            }

            return `
                <tr class="hover:bg-slate-50/80 transition align-top">
                    <td class="py-4 px-6 font-semibold text-slate-400">${idx + 1}</td>
                    <td class="py-4 px-6">
                        <div>
                            <h4 class="font-bold text-slate-900">${item.nama}</h4>
                            <p class="text-[10px] text-slate-400 font-medium">NIS: ${item.nis} • ${item.sub}</p>
                        </div>
                    </td>
                    <td class="py-4 px-6">
                        <span class="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">${item.program}</span>
                    </td>
                    <td class="py-4 px-6 font-medium text-slate-600 text-xs">${item.waktu}</td>
                    <td class="py-4 px-6">${absenBadge}</td>
                    <td class="py-4 px-6">${reportBadge}</td>
                    <td class="py-4 px-6 text-center">
                        <button type="button" class="btn-buka-modal-absensi px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold text-xs transition inline-flex items-center gap-1.5 shadow-sm" data-nisn="${item.nis}">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            Lihat
                        </button>
                    </td>
                </tr>
            `;
        }).join("");
    }

    renderTable(dataAbsensiSiswaList);

    // Fungsi Filter Pencarian & Program
    function applyFilters() {
        const keyword = (searchInput ? searchInput.value : "").toLowerCase();
        const progVal = (filterProgram ? filterProgram.value : "").toLowerCase();

        const filtered = dataAbsensiSiswaList.filter(item => {
            const matchKeyword = item.nama.toLowerCase().includes(keyword) || item.nis.toLowerCase().includes(keyword);
            const matchProgram = progVal === "" || item.program.toLowerCase().includes(progVal);
            return matchKeyword && matchProgram;
        });

        renderTable(filtered);
    }

    if (searchInput) searchInput.addEventListener("input", applyFilters);
    if (filterProgram) filterProgram.addEventListener("change", applyFilters);
    if (btnTerapkan) btnTerapkan.addEventListener("click", applyFilters);

    if (btnReset) {
        btnReset.addEventListener("click", () => {
            if (searchInput) searchInput.value = "";
            if (filterProgram) filterProgram.value = "";
            renderTable(dataAbsensiSiswaList);
        });
    }

    // Fungsi Global Membuka Pop-up Absensi via Fetch File HTML Terpisah
    window.openAbsensiModal = async (nisnSiswa) => {
        const container = document.getElementById("absensi-modal-container");
        if (!container) return;

        // Fetch file HTML pop-up jika kontainer masih kosong
        if (!container.innerHTML.trim()) {
            try {
                // Jalur relatif dari Front-end/pages/Mentor/ ke Front-end/component/Mentor/
                const response = await fetch('../../component/Mentor/pop-up-absensi.html');
                if (response.ok) {
                    container.innerHTML = await response.text();
                    setupAbsensiModalEvents();
                } else {
                    console.error("Gagal memuat file pop-up absensi. Status:", response.status);
                    return;
                }
            } catch (err) {
                console.error("Kesalahan jaringan saat memuat pop-up absensi:", err);
                return;
            }
        } else {
            setupAbsensiModalEvents();
        }

        // Ambil data berdasarkan NISN siswa (fallback ke Ahmad Fauzi jika tidak ditemukan)
        const dataSiswa = databaseAbsensiSiswa[nisnSiswa] || databaseAbsensiSiswa["1234567801"];

        // 1. Isi Header Profil Siswa
        const elInitial = document.getElementById("modal-absensi-initial");
        const elNama = document.getElementById("modal-absensi-nama");
        const elInfo = document.getElementById("modal-absensi-info");
        const elPersentase = document.getElementById("modal-absensi-persentase");

        if (elInitial) elInitial.textContent = dataSiswa.inisial;
        if (elNama) elNama.textContent = dataSiswa.nama;
        if (elInfo) elInfo.innerHTML = `NISN: ${dataSiswa.nisn} • <span class="text-indigo-600 font-semibold">${dataSiswa.program}</span>`;
        if (elPersentase) elPersentase.textContent = dataSiswa.persentaseKehadiran;

        // 2. Isi Kartu Ringkasan (Atas)
        const statTanggal = document.getElementById("stat-absensi-tanggal");
        const statMasuk = document.getElementById("stat-absensi-masuk");
        const statKeluar = document.getElementById("stat-absensi-keluar");
        const statStatus = document.getElementById("stat-absensi-status");

        if (statTanggal) statTanggal.textContent = dataSiswa.tanggalTerbaru;
        if (statMasuk) statMasuk.textContent = dataSiswa.jamMasuk;
        if (statKeluar) statKeluar.textContent = dataSiswa.jamKeluar;
        if (statStatus) statStatus.textContent = dataSiswa.statusTerbaru;

        // 3. Render Tabel Riwayat Kehadiran (5 Hari Terakhir)
        const tbody = document.getElementById("modal-riwayat-absensi-tbody");
        if (tbody) {
            tbody.innerHTML = dataSiswa.riwayat.map(item => `
                <tr class="hover:bg-slate-50/50 transition">
                    <td class="py-3.5 px-4 font-bold text-slate-700">${item.no}</td>
                    <td class="py-3.5 px-4 font-medium text-slate-800">${item.tanggal}</td>
                    <td class="py-3.5 px-4 text-slate-600">${item.jamMasuk}</td>
                    <td class="py-3.5 px-4 text-slate-600">${item.jamKeluar}</td>
                    <td class="py-3.5 px-4"><span class="${item.statusClass}">${item.status}</span></td>
                    <td class="py-3.5 px-4 text-slate-500">${item.keterangan}</td>
                </tr>
            `).join("");
        }

        const infoCount = document.getElementById("modal-riwayat-info-count");
        if (infoCount) {
            infoCount.textContent = `Menampilkan ${dataSiswa.riwayat.length} catatan`;
        }

        // Tampilkan Modal
        const modalEl = document.getElementById("modal-absensi");
        if (modalEl) modalEl.classList.remove("hidden");
    };

    function setupAbsensiModalEvents() {
        const closeBtn = document.getElementById("modal-absensi-close-btn");
        const closeFooterBtn = document.getElementById("modal-absensi-close-footer-btn");
        const modalEl = document.getElementById("modal-absensi");

        if (closeBtn && modalEl) {
            closeBtn.onclick = (e) => {
                e.preventDefault();
                modalEl.classList.add("hidden");
            };
        }

        if (closeFooterBtn && modalEl) {
            closeFooterBtn.onclick = (e) => {
                e.preventDefault();
                modalEl.classList.add("hidden");
            };
        }

        if (modalEl) {
            modalEl.onclick = (e) => {
                if (e.target === modalEl) modalEl.classList.add("hidden");
            };
        }
    }

    // Event listener global untuk menangkap klik tombol "Lihat" / "Detail" pada tabel absensi utama
    document.addEventListener("click", (e) => {
        const targetBtn = e.target.closest(".btn-buka-modal-absensi");
        if (targetBtn) {
            e.preventDefault();
            const nisnSiswa = targetBtn.dataset.nisn || "1234567801";
            window.openAbsensiModal(nisnSiswa);
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initMentorAbsensi();
});