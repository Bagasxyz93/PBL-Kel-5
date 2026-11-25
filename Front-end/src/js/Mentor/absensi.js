import { API_BASE_URL } from "../api-config.js";


/* =========================================================
   LOGIKA HALAMAN REKAP ABSENSI MENTOR
   Terhubung dengan API PHP dan PostgreSQL

   FITUR:
   1. Menampilkan rekap absensi
   2. Statistik absensi dan Daily Report
   3. Filter program dan pencarian siswa
   4. Pagination 10 siswa per halaman
   5. Pop-up detail dan riwayat absensi
   6. Cetak rekap absensi ke PDF berdasarkan tanggal
========================================================= */

const API_URL =
    `${API_BASE_URL}/api/mentor/api_absensi_mentor.php`;

const DATA_PER_PAGE = 10;

let dataAbsensiSiswaList = [];
let filteredAbsensiList = [];
let currentPage = 1;


/* =========================================================
   FUNGSI BANTUAN
========================================================= */

function escapeHTML(value) {
    return String(value ?? '-').replace(/[&<>"']/g, (char) => {
        const entities = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };

        return entities[char];
    });
}



async function ambilDataAPI(url) {
    const token = sessionStorage.getItem('authToken');

    if (!token) {
        throw new Error('Token login tidak ditemukan. Silakan login kembali.');
    }

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    const result = await response.json();

    if (!response.ok || result.success === false) {
        throw new Error(
            result.message || 'Gagal mengambil data dari server.'
        );
    }

    return result;
}



function tanggalHariIni() {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(new Date());
}


function formatTanggalIndonesia(tanggal) {
    if (!tanggal) return '-';

    const date = new Date(`${tanggal}T00:00:00`);

    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
}


/* =========================================================
   TANGGAL HALAMAN
========================================================= */

function tampilkanTanggal(tanggal = tanggalHariIni()) {
    const buatTanggal = (nilai) => {
        const [tahun, bulan, hari] = nilai.split('-').map(Number);
        return new Date(tahun, bulan - 1, hari);
    };

    const tanggalSekarang = buatTanggal(tanggalHariIni());
    const tanggalDipilih = buatTanggal(tanggal);

    const tanggalHeader = document.getElementById(
        'tanggal-hari-ini'
    );

    const tanggalFilter = document.getElementById(
        'tanggal-filter-label'
    );

    if (tanggalHeader) {
        tanggalHeader.textContent =
            tanggalSekarang.toLocaleDateString('id-ID', {
                weekday: 'long',
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });
    }

    if (tanggalFilter) {
        tanggalFilter.textContent =
            tanggalDipilih.toLocaleDateString('id-ID', {
                weekday: 'short',
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
    }
}


/* =========================================================
   STATISTIK KARTU
========================================================= */

function updateStatistik(data) {
    const total = data.length;

    const hitungStatus = (status) => {
        return data.filter(item =>
            String(item.statusAbsen || '').toLowerCase() === status
        ).length;
    };

    const hadir = hitungStatus('hadir');
    const izin = hitungStatus('izin');
    const sakit = hitungStatus('sakit');

    const reportDiserahkan = data.filter(item => {
        const status = String(
            item.statusReport || ''
        ).toLowerCase();

        return !['belum ada', '-', ''].includes(status);
    }).length;

    const reportDiterima = data.filter(item =>
        String(item.statusReport || '').toLowerCase() === 'diterima'
    ).length;

    const persenHadir = total > 0
        ? Math.round((hadir / total) * 100)
        : 0;

    const persenReport = total > 0
        ? Math.round((reportDiserahkan / total) * 100)
        : 0;

    const setText = (id, value) => {
        const element = document.getElementById(id);

        if (element) {
            element.textContent = value;
        }
    };

    setText('stat-total-hadir', hadir);
    setText('stat-total-siswa', total);
    setText('stat-total-izin', izin);
    setText('stat-total-sakit', sakit);

    setText('stat-hadir-rate', `${persenHadir}% Rate`);

    const hadirBar = document.getElementById('stat-hadir-bar');

    if (hadirBar) {
        hadirBar.style.width = `${persenHadir}%`;
    }

    setText('stat-report-diserahkan', reportDiserahkan);
    setText('stat-report-total', total);

    setText(
        'stat-report-diterima',
        `✓ ${reportDiterima} Terverifikasi`
    );

    setText('stat-report-rate', `${persenReport}%`);
}


/* =========================================================
   FILTER PROGRAM OTOMATIS
========================================================= */

function isiFilterProgram(data) {
    const select = document.getElementById('filter-program');

    if (!select) return;

    const programTerpilih = select.value;

    const daftarProgram = [
        ...new Set(
            data
                .map(item => item.program)
                .filter(program => program && program !== '-')
        )
    ];

    select.innerHTML = `
        <option value="">Semua Program</option>
    `;

    daftarProgram.forEach(program => {
        const option = document.createElement('option');

        option.value = program;
        option.textContent = program;

        select.appendChild(option);
    });

    select.value = daftarProgram.includes(programTerpilih)
        ? programTerpilih
        : '';
}


/* =========================================================
   BADGE STATUS ABSENSI
========================================================= */

function buatBadgeAbsensi(status) {
    const statusLower = String(
        status || 'Belum ada'
    ).toLowerCase();

    if (statusLower === 'hadir') {
        return `
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Hadir
            </span>
        `;
    }

    if (statusLower === 'sakit') {
        return `
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-[11px] font-bold">
                Sakit
            </span>
        `;
    }

    if (statusLower === 'izin') {
        return `
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[11px] font-bold">
                Izin
            </span>
        `;
    }

    if (statusLower === 'alpha') {
        return `
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-[11px] font-bold">
                Alpha
            </span>
        `;
    }

    return `
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 text-slate-600 text-[11px] font-bold">
            ${escapeHTML(status)}
        </span>
    `;
}


/* =========================================================
   BADGE STATUS DAILY REPORT
========================================================= */

function buatBadgeReport(status) {
    const statusLower = String(
        status || 'Belum ada'
    ).toLowerCase();

    if (statusLower === 'diterima') {
        return `
            <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold">
                ✓ Diterima
            </span>
        `;
    }

    if (statusLower === 'ditolak') {
        return `
            <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-[11px] font-bold">
                ✕ Ditolak
            </span>
        `;
    }

    if (['belum ada', '-', ''].includes(statusLower)) {
        return `
            <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-50 text-slate-500 text-[11px] font-bold">
                Belum ada
            </span>
        `;
    }

    return `
        <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[11px] font-bold">
            ⏱ Menunggu
        </span>
    `;
}


/* =========================================================
   INISIALISASI HALAMAN ABSENSI MENTOR
========================================================= */

export function initMentorAbsensi() {
    console.log('Modul Rekap Absensi Mentor berhasil dimuat.');

    const tableBody = document.getElementById(
        'table-absensi-body'
    );

    const searchInput = document.getElementById(
        'input-search-absensi'
    );

    const filterProgram = document.getElementById(
        'filter-program'
    );

    const btnReset = document.getElementById(
        'btn-reset-filter'
    );

    const paginationButtons = document.getElementById(
        'pagination-buttons'
    );

    const paginationInfo = document.getElementById(
        'pagination-info'
    );

    const inputTanggalFilter = document.getElementById(
        'input-tanggal-filter'
    );
    
    let tanggalAbsensiTerpilih = tanggalHariIni();
    
    if (inputTanggalFilter) {
        inputTanggalFilter.addEventListener('change', () => {
            const tanggal = inputTanggalFilter.value;

            if (!tanggal) return;

            if (tanggal > tanggalHariIni()) {
                alert('Tanggal tidak boleh melebihi hari ini.');

                inputTanggalFilter.value = tanggalAbsensiTerpilih;
                return;
            }

            tanggalAbsensiTerpilih = tanggal;
            inputTanggalFilter.max = tanggalHariIni();

            loadDataAbsensi();
        });
    }

    const wrapperTanggalFilter = document.getElementById('wrapper-tanggal-filter');

    if (wrapperTanggalFilter && inputTanggalFilter) {
        wrapperTanggalFilter.addEventListener('click', (event) => {
            if (event.target !== inputTanggalFilter) {
                if (typeof inputTanggalFilter.showPicker === 'function') {
                    inputTanggalFilter.showPicker();
                } else {
                    inputTanggalFilter.focus();
                }
            }
        });
    }

    if (!tableBody) {
        console.error('Elemen table-absensi-body tidak ditemukan.');
        return;
    }


    /* =====================================================
       RENDER TABEL
    ===================================================== */

    function renderTable(data) {
        if (data.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="py-8 text-center text-slate-400">
                        Tidak ada data absensi yang ditemukan.
                    </td>
                </tr>
            `;

            return;
        }

        tableBody.innerHTML = data.map((item, idx) => {
            const nomor =
                (currentPage - 1) * DATA_PER_PAGE + idx + 1;

            return `
                <tr class="hover:bg-slate-50/80 transition align-top">

                    <td class="py-4 px-6 font-semibold text-slate-400">
                        ${nomor}
                    </td>

                    <td class="py-4 px-6">
                        <div>
                            <h4 class="font-bold text-slate-900">
                                ${escapeHTML(item.nama)}
                            </h4>

                            <p class="text-[10px] text-slate-400 font-medium">
                                NISN: ${escapeHTML(item.nis)}
                                • ${escapeHTML(item.sub)}
                            </p>
                        </div>
                    </td>

                    <td class="py-4 px-6">
                        <span class="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold">
                            ${escapeHTML(item.program)}
                        </span>
                    </td>

                    <td class="py-4 px-6 font-medium text-slate-600 text-xs">
                        ${escapeHTML(item.waktu)}
                    </td>

                    <td class="py-4 px-6">
                        ${buatBadgeAbsensi(item.statusAbsen)}
                    </td>

                    <td class="py-4 px-6">
                        ${buatBadgeReport(item.statusReport)}
                    </td>

                    <td class="py-4 px-6 text-center">
                        <button
                            type="button"
                            class="btn-buka-modal-absensi px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold text-xs transition inline-flex items-center gap-1.5 shadow-sm"
                            data-peserta-id="${escapeHTML(item.peserta_id)}">

                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>

                            Lihat
                        </button>
                    </td>

                </tr>
            `;
        }).join('');
    }


    /* =====================================================
       PAGINATION DINAMIS
       10 SISWA PER HALAMAN
    ===================================================== */

    function renderPagination() {
        if (!paginationButtons || !paginationInfo) return;

        const totalData = filteredAbsensiList.length;

        const totalHalaman = Math.ceil(
            totalData / DATA_PER_PAGE
        );

        if (totalData === 0) {
            paginationInfo.textContent = 'Tidak ada data siswa';
            paginationButtons.innerHTML = '';
            return;
        }

        const mulai =
            (currentPage - 1) * DATA_PER_PAGE + 1;

        const selesai = Math.min(
            currentPage * DATA_PER_PAGE,
            totalData
        );

        paginationInfo.textContent =
            `Menampilkan ${mulai} - ${selesai} dari ${totalData} siswa`;

        let html = '';

        // Tombol sebelumnya
        html += `
            <button
                type="button"
                data-page="${currentPage - 1}"
                ${currentPage === 1 ? 'disabled' : ''}
                class="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center transition
                ${currentPage === 1
                    ? 'text-slate-300 cursor-not-allowed'
                    : 'text-slate-600 hover:bg-slate-50'}">
                &lt;
            </button>
        `;

        // Nomor halaman
        for (let halaman = 1; halaman <= totalHalaman; halaman++) {
            html += `
                <button
                    type="button"
                    data-page="${halaman}"
                    class="w-8 h-8 rounded-lg flex items-center justify-center transition
                    ${currentPage === halaman
                        ? 'bg-[#00b09b] text-white font-bold shadow-sm shadow-emerald-500/20'
                        : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}">
                    ${halaman}
                </button>
            `;
        }

        // Tombol berikutnya
        html += `
            <button
                type="button"
                data-page="${currentPage + 1}"
                ${currentPage === totalHalaman ? 'disabled' : ''}
                class="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center transition
                ${currentPage === totalHalaman
                    ? 'text-slate-300 cursor-not-allowed'
                    : 'text-slate-600 hover:bg-slate-50'}">
                &gt;
            </button>
        `;

        paginationButtons.innerHTML = html;
    }


    function tampilkanHalaman() {
        const mulai =
            (currentPage - 1) * DATA_PER_PAGE;

        const dataHalaman = filteredAbsensiList.slice(
            mulai,
            mulai + DATA_PER_PAGE
        );

        renderTable(dataHalaman);
        renderPagination();
    }


    // Event pagination
    if (paginationButtons) {
        paginationButtons.addEventListener('click', (e) => {
            const tombol = e.target.closest(
                'button[data-page]'
            );

            if (!tombol || tombol.disabled) return;

            const halaman = Number(tombol.dataset.page);

            const totalHalaman = Math.ceil(
                filteredAbsensiList.length / DATA_PER_PAGE
            );

            if (
                halaman < 1 ||
                halaman > totalHalaman ||
                halaman === currentPage
            ) {
                return;
            }

            currentPage = halaman;

            tampilkanHalaman();
        });
    }


    /* =====================================================
       INDIKATOR FILTER AKTIF
    ===================================================== */

    function updateFilterAktif() {
        const container = document.getElementById(
            'active-filter-list'
        );

        if (!container) return;

        const keyword = searchInput?.value.trim() || '';
        const programValue = filterProgram?.value || '';

        let html = `
            <span class="font-semibold text-slate-600">
                Filter aktif:
            </span>
        `;

        if (!keyword && !programValue) {
            html += `
                <span class="text-slate-400">
                    Tidak ada filter tambahan
                </span>
            `;
        }

        if (keyword) {
            html += `
                <span class="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px]">
                    Pencarian: ${escapeHTML(keyword)}
                </span>
            `;
        }

        if (programValue) {
            html += `
                <span class="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px]">
                    Program: ${escapeHTML(programValue)}
                </span>
            `;
        }

        container.innerHTML = html;
    }


    /* =====================================================
       FILTER PENCARIAN DAN PROGRAM
    ===================================================== */

    function applyFilters() {
        const keyword = searchInput
            ? searchInput.value.toLowerCase().trim()
            : '';

        const progVal = filterProgram
            ? filterProgram.value.toLowerCase()
            : '';

        filteredAbsensiList = dataAbsensiSiswaList.filter(item => {
            const nama = String(item.nama || '').toLowerCase();
            const nis = String(item.nis || '').toLowerCase();
            const program = String(item.program || '').toLowerCase();

            const matchKeyword =
                nama.includes(keyword) ||
                nis.includes(keyword);

            const matchProgram =
                progVal === '' ||
                program === progVal;

            return matchKeyword && matchProgram;
        });

        // Filter selalu kembali ke halaman pertama
        currentPage = 1;

        tampilkanHalaman();
        updateFilterAktif();
    }


    /* =====================================================
       MENGAMBIL DATA REKAP DARI BACKEND
    ===================================================== */

    async function loadDataAbsensi() {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="py-8 text-center text-slate-400">
                    Memuat data absensi...
                </td>
            </tr>
        `;

        try {
            const result = await ambilDataAPI(
                `${API_URL}?aksi=rekap&tanggal=${encodeURIComponent(tanggalAbsensiTerpilih)}`
            );

            const data = result.data;

            dataAbsensiSiswaList = Array.isArray(data)
                ? data
                : [];

            updateStatistik(dataAbsensiSiswaList);
            isiFilterProgram(dataAbsensiSiswaList);
            tampilkanTanggal(tanggalAbsensiTerpilih);

            applyFilters();

            console.log(
                `Rekap absensi tanggal ${tanggalAbsensiTerpilih} berhasil dimuat.`
            );

        } catch (error) {
            console.error('Gagal mengambil data rekap:', error);

            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="py-8 text-center text-rose-500">
                        ${escapeHTML(error.message)}
                    </td>
                </tr>
            `;
        }
    }


    /* =====================================================
       EVENT FILTER
    ===================================================== */

    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }

    if (inputTanggalFilter) {
        inputTanggalFilter.addEventListener('change', () => {
            const tanggal = inputTanggalFilter.value;

            if (!tanggal) return;

            if (tanggal > tanggalHariIni()) {
                alert('Tanggal tidak boleh melebihi hari ini.');

                inputTanggalFilter.value = tanggalAbsensiTerpilih;
                return;
            }

            tanggalAbsensiTerpilih = tanggal;

            // Perbarui batas maksimal tanggal
            inputTanggalFilter.max = tanggalHariIni();

            // Muat ulang tabel sesuai tanggal pilihan
            loadDataAbsensi();
        });
    }

    if (filterProgram) {
        filterProgram.addEventListener('change', applyFilters);
    }

    if (btnReset) {
        btnReset.addEventListener('click', () => {
            if (searchInput) {
                searchInput.value = '';
            }

            if (filterProgram) {
                filterProgram.value = '';
            }

            // Reset tanggal kembali ke hari ini
            tanggalAbsensiTerpilih = tanggalHariIni();

            if (inputTanggalFilter) {
                inputTanggalFilter.value = tanggalAbsensiTerpilih;
                inputTanggalFilter.max = tanggalHariIni();
            }

            loadDataAbsensi();
        });
    }


    /* =====================================================
       MODAL CETAK REKAP ABSENSI
    ===================================================== */

    function buatModalCetak() {
        let modal = document.getElementById(
            'modal-pilih-tanggal-absensi'
        );

        if (modal) return modal;

        modal = document.createElement('div');

        modal.id = 'modal-pilih-tanggal-absensi';

        modal.className =
            'fixed inset-0 z-[100] hidden items-center justify-center bg-slate-900/50 p-4';

        modal.innerHTML = `
            <div class="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">

                <div class="flex items-center justify-between mb-5">
                    <div>
                        <h2 class="text-lg font-extrabold text-slate-900">
                            Cetak Rekap Absensi
                        </h2>

                        <p class="text-xs text-slate-500 mt-1">
                            Pilih tanggal rekap yang ingin dicetak.
                        </p>
                    </div>

                    <button
                        type="button"
                        id="btn-tutup-modal-cetak-absensi"
                        class="text-slate-400 hover:text-slate-700 text-2xl">
                        &times;
                    </button>
                </div>

                <div class="mb-5">
                    <label
                        for="input-tanggal-cetak-absensi"
                        class="block text-xs font-semibold text-slate-700 mb-2">
                        Tanggal Absensi
                    </label>

                    <input
                        type="date"
                        id="input-tanggal-cetak-absensi"
                        max="${tanggalHariIni()}"
                        value="${tanggalHariIni()}"
                        class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:border-[#00b09b]">
                </div>

                <div class="flex justify-end gap-3">
                    <button
                        type="button"
                        id="btn-batal-cetak-absensi"
                        class="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50">
                        Batal
                    </button>

                    <button
                        type="button"
                        id="btn-buat-pdf-absensi"
                        class="px-4 py-2.5 rounded-xl bg-[#00b09b] hover:bg-[#009b88] text-white text-xs font-semibold">
                        Buat PDF
                    </button>
                </div>

            </div>
        `;

        document.body.appendChild(modal);

        const tutupModal = () => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        };

        document.getElementById(
            'btn-tutup-modal-cetak-absensi'
        ).addEventListener('click', tutupModal);

        document.getElementById(
            'btn-batal-cetak-absensi'
        ).addEventListener('click', tutupModal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                tutupModal();
            }
        });

        document.getElementById(
            'btn-buat-pdf-absensi'
        ).addEventListener('click', async () => {
            const inputTanggal = document.getElementById(
                'input-tanggal-cetak-absensi'
            );

            const tanggal = inputTanggal.value;

            if (!tanggal) {
                alert('Silakan pilih tanggal terlebih dahulu.');
                return;
            }

            if (tanggal > tanggalHariIni()) {
                alert('Tanggal tidak boleh melebihi hari ini.');
                return;
            }

            const tombol = document.getElementById(
                'btn-buat-pdf-absensi'
            );

            tombol.disabled = true;
            tombol.textContent = 'Memproses...';

            try {
                await cetakRekapPDF(tanggal);
                tutupModal();

            } catch (error) {
                console.error('Gagal membuat PDF:', error);
                alert(error.message);

            } finally {
                tombol.disabled = false;
                tombol.textContent = 'Buat PDF';
            }
        });

        return modal;
    }


    // Event tombol Cetak Rekap
    const btnCetakRekap = document.getElementById(
        'btn-cetak-rekap'
    );

    if (btnCetakRekap) {
        btnCetakRekap.addEventListener('click', () => {
            const modal = buatModalCetak();

            const inputTanggal = document.getElementById(
                'input-tanggal-cetak-absensi'
            );

            inputTanggal.value = tanggalHariIni();
            inputTanggal.max = tanggalHariIni();

            modal.classList.remove('hidden');
            modal.classList.add('flex');
        });
    }


    /* =====================================================
       MEMBUAT PDF REKAP ABSENSI
    ===================================================== */

    async function cetakRekapPDF(tanggal) {
        if (!window.jspdf || !window.jspdf.jsPDF) {
            throw new Error(
                'Library jsPDF belum berhasil dimuat. Periksa koneksi internet.'
            );
        }

        const { jsPDF } = window.jspdf;

        // Ambil data berdasarkan tanggal
        const result = await ambilDataAPI(
            `${API_URL}?aksi=cetak&tanggal=${encodeURIComponent(tanggal)}`
        );

        const data = result.data || [];
        const statistik = result.statistik || {};

        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });

        const lebarHalaman = doc.internal.pageSize.getWidth();

        // Judul laporan
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);

        doc.text(
            'REKAPITULASI ABSENSI SISWA',
            lebarHalaman / 2,
            18,
            { align: 'center' }
        );

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');

        doc.text(
            'SISTEM INFORMASI INKUBASI (SI-IN)',
            lebarHalaman / 2,
            25,
            { align: 'center' }
        );

        // Garis pembatas
        doc.setLineWidth(0.5);
        doc.line(14, 30, lebarHalaman - 14, 30);

        // Identitas laporan
        doc.setFontSize(10);

        doc.text(
            `Nama Mentor : ${result.mentor || '-'}`,
            14,
            38
        );

        doc.text(
            `Tanggal : ${formatTanggalIndonesia(result.tanggal || tanggal)}`,
            14,
            44
        );

        // Ringkasan statistik
        const ringkasan = [
            ['Total Peserta', statistik.total_peserta ?? 0],
            ['Hadir', statistik.hadir ?? 0],
            ['Izin', statistik.izin ?? 0],
            ['Sakit', statistik.sakit ?? 0],
            ['Alpha', statistik.alpha ?? 0],
            ['Belum Ada', statistik.belum_ada ?? 0]
        ];

        doc.autoTable({
            startY: 51,

            head: [[
                'Ringkasan Absensi',
                'Jumlah'
            ]],

            body: ringkasan,

            theme: 'grid',

            styles: {
                font: 'helvetica',
                fontSize: 9,
                cellPadding: 2.5
            },

            headStyles: {
                fillColor: [0, 176, 155],
                textColor: 255,
                fontStyle: 'bold'
            },

            tableWidth: 85,

            margin: {
                left: 14,
                right: 14
            }
        });

        let posisiY = doc.lastAutoTable.finalY + 10;

        // Data setiap program
        if (data.length === 0) {
            doc.setFontSize(10);

            doc.text(
                'Tidak ada data peserta untuk tanggal tersebut.',
                14,
                posisiY
            );

        } else {
            data.forEach((program, index) => {
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(11);

                doc.text(
                    `Program ${index + 1}: ${program.nama_program || '-'}`,
                    14,
                    posisiY
                );

                posisiY += 4;

                const daftarPeserta = Array.isArray(program.peserta)
                    ? program.peserta
                    : [];

                const isiTabel = daftarPeserta.map((peserta, nomor) => [
                    nomor + 1,
                    peserta.nama || '-',
                    peserta.nisn || '-',
                    peserta.jam_masuk || '-',
                    peserta.jam_keluar || '-',
                    peserta.status || 'Belum ada',
                    peserta.keterangan || '-'
                ]);

                doc.autoTable({
                    startY: posisiY,

                    head: [[
                        'No',
                        'Nama Siswa',
                        'NISN',
                        'Jam Masuk',
                        'Jam Keluar',
                        'Status',
                        'Keterangan'
                    ]],

                    body: isiTabel,

                    theme: 'grid',

                    styles: {
                        font: 'helvetica',
                        fontSize: 8,
                        cellPadding: 2.5,
                        overflow: 'linebreak'
                    },

                    headStyles: {
                        fillColor: [0, 176, 155],
                        textColor: 255,
                        fontStyle: 'bold'
                    },

                    columnStyles: {
                        0: { cellWidth: 10 },
                        1: { cellWidth: 55 },
                        2: { cellWidth: 35 },
                        3: { cellWidth: 27 },
                        4: { cellWidth: 27 },
                        5: { cellWidth: 28 },
                        6: { cellWidth: 'auto' }
                    },

                    margin: {
                        left: 14,
                        right: 14
                    }
                });

                posisiY = doc.lastAutoTable.finalY + 5;

                // Ringkasan per program
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(8);

                doc.text(
                    `Total: ${program.total_peserta ?? 0} | ` +
                    `Hadir: ${program.hadir ?? 0} | ` +
                    `Izin: ${program.izin ?? 0} | ` +
                    `Sakit: ${program.sakit ?? 0} | ` +
                    `Alpha: ${program.alpha ?? 0} | ` +
                    `Belum Ada: ${program.belum_ada ?? 0}`,
                    14,
                    posisiY
                );

                posisiY += 10;
            });
        }

        // Nomor halaman dan tanggal cetak
        const jumlahHalaman = doc.internal.getNumberOfPages();

        for (let halaman = 1; halaman <= jumlahHalaman; halaman++) {
            doc.setPage(halaman);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);

            doc.text(
                `Dicetak pada: ${new Date().toLocaleString('id-ID')}`,
                14,
                doc.internal.pageSize.getHeight() - 8
            );

            doc.text(
                `Halaman ${halaman} dari ${jumlahHalaman}`,
                lebarHalaman - 14,
                doc.internal.pageSize.getHeight() - 8,
                { align: 'right' }
            );
        }

        // Simpan PDF
        const namaFile = `Rekap-Absensi-${tanggal}.pdf`;

        doc.save(namaFile);

        console.log('PDF rekap absensi berhasil dibuat.');
    }


    /* =====================================================
       MEMBUKA POP-UP DETAIL ABSENSI
    ===================================================== */

    window.openAbsensiModal = async (pesertaId) => {
        const container = document.getElementById(
            'absensi-modal-container'
        );

        if (!container) return;

        // Memuat HTML pop-up jika belum tersedia
        if (!container.innerHTML.trim()) {
            try {
                const response = await fetch(
                    '../../component/Mentor/pop-up-absensi.html'
                );

                if (!response.ok) {
                    throw new Error(
                        'Gagal memuat file pop-up absensi.'
                    );
                }

                container.innerHTML = await response.text();

            } catch (error) {
                console.error('Kesalahan memuat pop-up:', error);
                alert(error.message);
                return;
            }
        }

        setupAbsensiModalEvents();

        try {
            const result = await ambilDataAPI(
                `${API_URL}?aksi=detail&peserta_id=${encodeURIComponent(pesertaId)}`
            );

            const dataDetail = result.data;

            const dataSiswa =
                dataDetail.peserta ||
                dataDetail.siswa ||
                dataDetail;

            const riwayat = dataDetail.riwayat || [];


            // Profil siswa
            const elInitial = document.getElementById(
                'modal-absensi-initial'
            );

            const elNama = document.getElementById(
                'modal-absensi-nama'
            );

            const elInfo = document.getElementById(
                'modal-absensi-info'
            );

            const elPersentase = document.getElementById(
                'modal-absensi-persentase'
            );

            if (elInitial) {
                elInitial.textContent =
                    dataSiswa.inisial ||
                    String(dataSiswa.nama || '?')
                        .split(' ')
                        .map(kata => kata.charAt(0))
                        .join('')
                        .substring(0, 2)
                        .toUpperCase();
            }

            if (elNama) {
                elNama.textContent = dataSiswa.nama || '-';
            }

            if (elInfo) {
                elInfo.innerHTML = `
                    NISN: ${escapeHTML(
                        dataSiswa.nisn || dataSiswa.nis || '-'
                    )}
                    •
                    <span class="text-indigo-600 font-semibold">
                        ${escapeHTML(dataSiswa.program || '-')}
                    </span>
                `;
            }

            if (elPersentase) {
                const persentase =
                    dataSiswa.persentaseKehadiran ?? 0;

                elPersentase.textContent =
                    typeof persentase === 'string' &&
                    persentase.includes('%')
                        ? persentase
                        : `${persentase}%`;
            }


            // Ringkasan absensi terbaru
            const statTanggal = document.getElementById(
                'stat-absensi-tanggal'
            );

            const statMasuk = document.getElementById(
                'stat-absensi-masuk'
            );

            const statKeluar = document.getElementById(
                'stat-absensi-keluar'
            );

            const statStatus = document.getElementById(
                'stat-absensi-status'
            );

            if (statTanggal) {
                statTanggal.textContent =
                    dataSiswa.tanggalTerbaru || '-';
            }

            if (statMasuk) {
                statMasuk.textContent =
                    dataSiswa.jamMasuk || '-';
            }

            if (statKeluar) {
                statKeluar.textContent =
                    dataSiswa.jamKeluar || '-';
            }

            if (statStatus) {
                statStatus.textContent =
                    dataSiswa.statusTerbaru || '-';
            }


            // Riwayat absensi
            const tbody = document.getElementById(
                'modal-riwayat-absensi-tbody'
            );

            if (tbody) {
                if (riwayat.length === 0) {
                    tbody.innerHTML = `
                        <tr>
                            <td colspan="6" class="py-6 text-center text-slate-400">
                                Belum ada riwayat absensi.
                            </td>
                        </tr>
                    `;

                } else {
                    tbody.innerHTML = riwayat.map((item, index) => {
                        const status = String(item.status || '');
                        const statusLower = status.toLowerCase();

                        let statusClass =
                            'text-slate-600 font-bold';

                        if (statusLower === 'hadir') {
                            statusClass =
                                'text-emerald-600 font-bold';

                        } else if (statusLower === 'izin') {
                            statusClass =
                                'text-blue-600 font-bold';

                        } else if (
                            statusLower === 'sakit' ||
                            statusLower === 'alpha'
                        ) {
                            statusClass =
                                'text-rose-600 font-bold';
                        }

                        return `
                            <tr class="hover:bg-slate-50/50 transition">

                                <td class="py-3.5 px-4 font-bold text-slate-700">
                                    ${item.no || index + 1}
                                </td>

                                <td class="py-3.5 px-4 font-medium text-slate-800">
                                    ${escapeHTML(item.tanggal)}
                                </td>

                                <td class="py-3.5 px-4 text-slate-600">
                                    ${escapeHTML(item.jamMasuk)}
                                </td>

                                <td class="py-3.5 px-4 text-slate-600">
                                    ${escapeHTML(item.jamKeluar)}
                                </td>

                                <td class="py-3.5 px-4">
                                    <span class="${statusClass}">
                                        ${escapeHTML(status)}
                                    </span>
                                </td>

                                <td class="py-3.5 px-4 text-slate-500">
                                    ${escapeHTML(item.keterangan)}
                                </td>

                            </tr>
                        `;
                    }).join('');
                }
            }


            // Jumlah riwayat
            const infoCount = document.getElementById(
                'modal-riwayat-info-count'
            );

            if (infoCount) {
                infoCount.textContent =
                    `Menampilkan ${riwayat.length} catatan`;
            }


            // Tampilkan modal
            const modalEl = document.getElementById(
                'modal-absensi'
            );

            if (modalEl) {
                modalEl.classList.remove('hidden');
            }

        } catch (error) {
            console.error(
                'Gagal mengambil detail absensi:',
                error
            );

            alert(error.message);
        }
    };


    /* =====================================================
       EVENT POP-UP DETAIL ABSENSI
    ===================================================== */

    function setupAbsensiModalEvents() {
        const closeBtn = document.getElementById(
            'modal-absensi-close-btn'
        );

        const closeFooterBtn = document.getElementById(
            'modal-absensi-close-footer-btn'
        );

        const modalEl = document.getElementById(
            'modal-absensi'
        );

        if (closeBtn && modalEl) {
            closeBtn.onclick = (e) => {
                e.preventDefault();
                modalEl.classList.add('hidden');
            };
        }

        if (closeFooterBtn && modalEl) {
            closeFooterBtn.onclick = (e) => {
                e.preventDefault();
                modalEl.classList.add('hidden');
            };
        }

        if (modalEl) {
            modalEl.onclick = (e) => {
                if (e.target === modalEl) {
                    modalEl.classList.add('hidden');
                }
            };
        }
    }


    /* =====================================================
       EVENT TOMBOL LIHAT DETAIL
    ===================================================== */

    tableBody.addEventListener('click', (e) => {
        const targetBtn = e.target.closest(
            '.btn-buka-modal-absensi'
        );

        if (targetBtn) {
            e.preventDefault();

            const pesertaId = targetBtn.dataset.pesertaId;

            if (!pesertaId) {
                console.error('ID peserta tidak ditemukan.');
                return;
            }

            window.openAbsensiModal(pesertaId);
        }
    });


    /* =====================================================
       DATA AWAL
    ===================================================== */

    tampilkanTanggal();
    loadDataAbsensi();
}


/* =========================================================
   JALANKAN MODUL SETELAH HTML SELESAI DIMUAT
========================================================= */

if (document.readyState === 'loading') {
    document.addEventListener(
        'DOMContentLoaded',
        initMentorAbsensi
    );
} else {
    initMentorAbsensi();
}
