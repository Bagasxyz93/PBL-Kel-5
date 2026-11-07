// Data riwayat singkat untuk tampilan form utama (4 riwayat sesuai Figma)
const riwayatDailyData = [
    {
        tanggal: "13 / 05 / 26 • 16:30 WIB",
        judul: "Slicing UI Dashboard Tailwind CSS",
        status: "DITERIMA",
        statusBadge: "bg-emerald-50 text-emerald-600 border border-emerald-200",
        mentor: "Bpk. Rendi Kurniawan, S.Kom",
        initialMentor: "RK",
        jamMentor: "17:15 WIB",
        feedback: "Struktur flexbox rapi, pastikan responsive breakpoint di mobile sudah dicek kembali."
    },
    {
        tanggal: "12 / 05 / 26 • 17:05 WIB",
        judul: "Setup Supabase Database & Migrasi Skema",
        status: "MENUNGGU",
        statusBadge: "bg-amber-50 text-amber-600 border border-amber-200",
        mentor: null,
        feedback: null
    },
    {
        tanggal: "11 / 05 / 26 • 16:15 WIB",
        judul: "Dokumentasi Flow Autentikasi JWT",
        status: "REVISI",
        statusBadge: "bg-rose-50 text-rose-600 border border-rose-200",
        mentor: "Bpk. Rendi Kurniawan, S.Kom",
        initialMentor: "RK",
        jamMentor: null,
        feedback: "Diagram sequence belum mencakup refresh token expired. Mohon lengkapi sebelum lanjut ke backend."
    },
    {
        tanggal: "10 / 05 / 26 • 15:45 WIB",
        judul: "Wireframing Desain SI-IN Figma & Usability Testing",
        status: "DITERIMA",
        statusBadge: "bg-emerald-50 text-emerald-600 border border-emerald-200",
        mentor: "Bpk. Rendi Kurniawan, S.Kom",
        initialMentor: "RK",
        jamMentor: null,
        feedback: "Komposisi wireframe sangat komprehensif. Siap masuk tahap coding!"
    }
];

// Data lengkap arsip riwayat untuk halaman "Semua Riwayat Laporan"
const semuaRiwayatDataLengkap = [
    {
        no: "#28",
        tanggal: "13 Mei 2026 • 16:30 WIB",
        sesi: "Sesi Penuh",
        status: "DITERIMA",
        statusBadge: "bg-emerald-50 text-emerald-600 border border-emerald-200",
        judul: "Slicing UI Dashboard Tailwind CSS & Refactor Responsive",
        deskripsi: "Mengimplementasikan desain Figma ke struktur HTML dengan utilitas Tailwind CSS. Mengatur breakpoint grid untuk tampilan mobile dan desktop agar rapi serta optimal.",
        lampiranNama: "FRAME_Dashboard_Slicing.zip",
        lampiranUkuran: "2.4 MB • File zip repository",
        mentorNama: "Bpk. Rendi Kurniawan, S.Kom",
        mentorJabatan: "Senior Web Developer",
        mentorInisial: "RK",
        mentorWaktu: "17:15 WIB",
        feedback: "Struktur flexbox rapi, pastikan responsive breakpoint di mobile sudah dicek kembali."
    },
    {
        no: "#27",
        tanggal: "12 Mei 2026 • 17:05 WIB",
        sesi: "Sesi Penuh",
        status: "MENUNGGU",
        statusBadge: "bg-amber-50 text-amber-600 border border-amber-200",
        judul: "Setup Supabase Database, Skema Auth & RLS Policy",
        deskripsi: "Konfigurasi tabel akun siswa, migrasi relasi database PostgreSQL, serta pembuatan Row Level Security (RLS) policy agar data aman dari akses tidak sah.",
        lampiranNama: "db_supabase_migration_v2.sql",
        lampiranUkuran: "480 KB • File sql script",
        mentorNama: "Menunggu Verifikasi Instruktur",
        mentorJabatan: "Instruktur Teknis",
        mentorInisial: "⏳",
        mentorWaktu: null,
        feedback: "Laporan masuk, antrian verifikasi mentor dijadwalkan selesai malam ini."
    },
    {
        no: "#26",
        tanggal: "11 Mei 2026 • 16:15 WIB",
        sesi: "Sesi Penuh",
        status: "REVISI",
        statusBadge: "bg-rose-50 text-rose-600 border border-rose-200",
        judul: "Dokumentasi & Flow Autentikasi JWT Refresh Token",
        deskripsi: "Menyusun diagram sequence alur login pengguna hingga penyimpanan token di local storage. Menguji endpoint API backend menggunakan Postman.",
        lampiranNama: "Auth_Flow_Sequence_Diagram.png",
        lampiranUkuran: "1.2 MB • Gambar diagram",
        mentorNama: "Bpk. Rendi Kurniawan, S.Kom",
        mentorJabatan: "TIM REVISI / PENGUJI MENTOR",
        mentorInisial: "RK",
        mentorWaktu: "18:00 WIB",
        feedback: "Diagram sequence belum mencakup refresh token expired. Mohon lengkapi sebelum lanjut ke backend.",
        isRevisi: true
    },
    {
        no: "#25",
        tanggal: "10 Mei 2026 • 15:45 WIB",
        sesi: "Sesi Siang",
        status: "DITERIMA",
        statusBadge: "bg-emerald-50 text-emerald-600 border border-emerald-200",
        judul: "Wireframing Desain SI-IN Figma & Usability Testing Awal",
        deskripsi: "Membuat low-fi dan hi-fi wireframe halaman absensi, izin, serta daily report siswa menggunakan Figma. Menguji alur navigasi menu dengan rekan sekelompok.",
        lampiranNama: "Wireframe_SI_IN_Figma_v1.pdf",
        lampiranUkuran: "3.5 MB • Dokumen PDF",
        mentorNama: "Bpk. Rendi Kurniawan, S.Kom",
        mentorJabatan: "Senior Web Developer",
        mentorInisial: "RK",
        mentorWaktu: null,
        feedback: "Komposisi wireframe sangat komprehensif. Siap masuk tahap coding!"
    },
    {
        no: "#24",
        tanggal: "09 Mei 2026 • 16:00 WIB",
        sesi: "Sesi Penuh",
        status: "DITERIMA",
        statusBadge: "bg-emerald-50 text-emerald-600 border border-emerald-200",
        judul: "Inisialisasi Project Repo & Setup CI/CD GitHub Actions",
        deskripsi: "Membuat struktur folder modular berbasis Vite, konfigurasi Tailwind CSS, serta menghubungkan repository publik dengan pipeline GitHub Actions otomatis.",
        lampiranNama: "GitHub_Repo_Inisialisasi_Bukti.png",
        lampiranUkuran: "950 KB • Screenshot log",
        mentorNama: "Bpk. Rendi Kurniawan, S.Kom",
        mentorJabatan: "Senior Web Developer",
        mentorInisial: "RK",
        mentorWaktu: null,
        feedback: "Inisialisasi repository sudah sesuai standar industri inkubasi."
    }
];

// Fungsi merender tampilan halaman "Semua Riwayat Laporan" (SPA View)
function renderSemuaRiwayatView() {
    const mainContainer = document.getElementById("main-content-area");
    if (!mainContainer) return;

    mainContainer.innerHTML = `
        <!-- Breadcrumb & Title -->
        <div class="flex flex-wrap items-center justify-between gap-4">
            <div>
                <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <span>INKUBASI SISWA</span>
                    <span>•</span>
                    <span>DAILY REPORT</span>
                    <span>•</span>
                    <span class="text-indigo-600">SEMUA RIWAYAT</span>
                </div>
                <h1 class="mt-1 text-2xl font-bold tracking-tight text-slate-800">
                    Semua Riwayat Laporan Harian
                </h1>
                <p class="mt-1 text-xs text-slate-400">
                    Pusat arsip laporan harian, rekapitulasi status verifikasi mentor, serta dokumen unduhan project inkubasi v2.
                </p>
            </div>

            <!-- Tombol Kembali ke Form -->
            <button id="btn-kembali-form" class="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition">
                <svg class="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                </svg>
                Kembali ke Form
            </button>
        </div>

        <!-- Statistik Grid (5 Card Ringkasan) -->
        <div class="grid grid-cols-2 gap-4 md:grid-cols-5">
            <div class="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <p class="text-[10px] font-bold tracking-wider text-slate-400 uppercase">TOTAL DILAPORKAN</p>
                <p class="mt-1 text-lg font-extrabold text-slate-800">28 <span class="text-xs font-normal text-slate-400">Hari</span></p>
                <span class="mt-2 inline-block rounded-md bg-indigo-50 px-2 py-0.5 text-[9px] font-bold text-indigo-600">📊 100% On-Time</span>
            </div>
            <div class="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <p class="text-[10px] font-bold tracking-wider text-slate-400 uppercase">STATUS DITERIMA</p>
                <p class="mt-1 text-lg font-extrabold text-emerald-600">24 <span class="text-xs font-normal text-slate-400">Laporan</span></p>
                <span class="mt-2 inline-block rounded-md bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-600">✔ 85.7% Disetujui</span>
            </div>
            <div class="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <p class="text-[10px] font-bold tracking-wider text-slate-400 uppercase">MENUNGGU</p>
                <p class="mt-1 text-lg font-extrabold text-amber-500">2 <span class="text-xs font-normal text-slate-400">Laporan</span></p>
                <span class="mt-2 inline-block rounded-md bg-amber-50 px-2 py-0.5 text-[9px] font-bold text-amber-600">⏳ Terjadwal Review</span>
            </div>
            <div class="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <p class="text-[10px] font-bold tracking-wider text-slate-400 uppercase">PERLU REVISI</p>
                <p class="mt-1 text-lg font-extrabold text-rose-500">2 <span class="text-xs font-normal text-slate-400">Laporan</span></p>
                <span class="mt-2 inline-block rounded-md bg-rose-50 px-2 py-0.5 text-[9px] font-bold text-rose-600">⚠️ Butuh Koreksi</span>
            </div>
            <div class="col-span-2 md:col-span-1 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <p class="text-[10px] font-bold tracking-wider text-slate-400 uppercase">DISIPLIN WAKTU</p>
                <p class="mt-1 text-lg font-extrabold text-indigo-600">96% <span class="text-xs font-normal text-slate-400">On-Time</span></p>
                <span class="mt-2 inline-block rounded-md bg-indigo-50 px-2 py-0.5 text-[9px] font-bold text-indigo-600">⭐ Grade A+</span>
            </div>
        </div>

        <!-- Filter & Search Bar -->
        <div class="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <div class="relative flex-1 min-w-[240px]">
                <input type="text" placeholder="Cari laporan, ringkasan modul, atau..." class="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-4 pr-4 text-xs font-medium text-slate-700 outline-none focus:border-indigo-400 focus:bg-white transition">
            </div>
            <div class="flex flex-wrap items-center gap-2">
                <span class="text-[10px] font-bold text-slate-400 uppercase">Filter:</span>
                <button class="rounded-xl bg-indigo-600 px-3 py-2 text-xs font-bold text-white shadow-sm">Semua (28)</button>
                <button class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition">Diterima (24)</button>
                <button class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition">Menunggu (2)</button>
                <button class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition">Revisi (2)</button>
            </div>
        </div>

        <!-- Container Daftar Semua Riwayat -->
        <div class="space-y-4">
            ${semuaRiwayatDataLengkap.map((item) => `
                <article class="rounded-2xl border ${item.status === 'REVISI' ? 'border-rose-200 bg-rose-50/10' : item.status === 'MENUNGGU' ? 'border-amber-200 bg-amber-50/10' : 'border-slate-100 bg-white'} p-6 shadow-sm">
                    <div class="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
                        <div class="flex items-center gap-3">
                            <span class="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-extrabold text-indigo-600">${item.no}</span>
                            <span class="text-xs font-bold text-slate-800">${item.tanggal}</span>
                            <span class="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600">${item.sesi}</span>
                        </div>
                        <span class="rounded-full px-3 py-1 text-[10px] font-bold ${item.statusBadge}">● ${item.status}</span>
                    </div>

                    <div class="py-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        <div class="lg:col-span-7 space-y-2">
                            <h2 class="text-sm font-extrabold text-slate-800">${item.judul}</h2>
                            <p class="text-xs text-slate-600 leading-relaxed">${item.deskripsi}</p>
                        </div>
                        <div class="lg:col-span-5">
                            <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">LAMPIRAN BUKTI</p>
                            <div class="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-3">
                                <div class="flex items-center gap-3 truncate">
                                    <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">📎</div>
                                    <div class="truncate">
                                        <p class="text-xs font-bold text-slate-800 truncate">${item.lampiranNama}</p>
                                        <p class="text-[10px] text-slate-400">${item.lampiranUkuran}</p>
                                    </div>
                                </div>
                                <a href="#" class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-700 hover:bg-slate-50 shadow-sm shrink-0">Unduh</a>
                            </div>
                        </div>
                    </div>

                    <div class="rounded-xl ${item.status === 'REVISI' ? 'bg-rose-50/70 border border-rose-100' : item.status === 'MENUNGGU' ? 'bg-amber-50/70 border border-amber-100' : 'bg-slate-50/70'} p-3.5 mt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div class="flex items-start gap-3">
                            <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">${item.mentorInisial}</span>
                            <div>
                                <div class="flex items-center gap-2">
                                    <span class="text-xs font-bold text-slate-800">${item.mentorNama}</span>
                                    <span class="text-[10px] text-slate-400">(${item.mentorJabatan})</span>
                                    ${item.mentorWaktu ? `<span class="text-[10px] text-slate-400">• ${item.mentorWaktu}</span>` : ''}
                                </div>
                                <p class="text-[11px] text-slate-600 italic mt-0.5">"${item.feedback}"</p>
                            </div>
                        </div>
                    </div>
                </article>
            `).join("")}
        </div>
    `;

    document.getElementById("btn-kembali-form").addEventListener("click", () => {
        initDailyReport();
    });
}

// Fungsi utama render tampilan Form Daily Report & Riwayat Sesuai Figma
export function initDailyReport() {
    const mainContainer = document.getElementById("main-content-area");
    if (!mainContainer) return;

    mainContainer.innerHTML = `
        <!-- Header Title & Stats Card -->
        <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
                <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <span>INKUBASI SISWA</span>
                    <span>•</span>
                    <span class="text-indigo-600">DAILY REPORT PAGE</span>
                </div>
                <div class="mt-1 flex items-center gap-3">
                    <h1 class="text-2xl font-bold tracking-tight text-slate-800">
                        Form &amp; Riwayat Laporan Harian
                    </h1>
                    <span class="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[10px] font-bold text-indigo-600">
                        • Fase 2: Sprint Web App
                    </span>
                </div>
            </div>

            <!-- Total Dilaporkan Card -->
            <div class="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                </div>
                <div>
                    <p class="text-[10px] font-bold tracking-wider text-slate-400 uppercase">TOTAL DILAPORKAN</p>
                    <p class="text-lg font-extrabold text-slate-800">28 Hari</p>
                </div>
            </div>
        </div>

        <!-- Grid Form Laporan & Sidebar Riwayat -->
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">

            <!-- Kolom Kiri: Form Input Laporan -->
            <div class="lg:col-span-7">
                <article class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                    <div class="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
                        <div class="flex items-center gap-3">
                            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-white shadow-md shadow-indigo-500/20">
                                📝
                            </div>
                            <div>
                                <div class="flex items-center gap-1.5">
                                    <h2 class="text-sm font-bold text-slate-800">DAILY REPORT</h2>
                                    <span class="h-2 w-2 rounded-full bg-emerald-400"></span>
                                </div>
                                <p class="text-[11px] text-slate-400">Dokumentasikan progres kegiatan inkubasi harian Anda</p>
                            </div>
                        </div>
                        <span class="flex items-center gap-1.5 rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-[10px] font-bold text-amber-600">
                            Wajib Submit ≤ 17:00 WIB
                        </span>
                    </div>

                    <form id="form-daily-report" class="space-y-5">
                        <div>
                            <label class="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                TANGGAL PELAKSANAAN <span class="text-rose-500">*</span>
                            </label>
                            <input type="date" value="2026-05-14" required class="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs font-semibold text-slate-700 outline-none focus:border-indigo-400 focus:bg-white">
                        </div>
                        <div>
                            <label class="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                KEGIATAN UTAMA <span class="text-rose-500">*</span>
                            </label>
                            <input type="text" placeholder="Contoh: Implementasi REST API & State Management Pinia" required class="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs font-semibold text-slate-700 outline-none focus:border-indigo-400 focus:bg-white">
                        </div>
                        <div>
                            <label class="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                YANG DIDAPATKAN / HASIL <span class="text-rose-500">*</span>
                            </label>
                            <textarea rows="3" minlength="30" required placeholder="Jelaskan fitur apa saja yang berhasil dibuat..." class="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs font-medium text-slate-700 outline-none focus:border-indigo-400 focus:bg-white"></textarea>
                        </div>
                        <div>
                            <label class="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                UPLOAD DOKUMEN / BUKTI PEKERJAAN <span class="text-rose-500">*</span>
                            </label>
                            <div class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/20 p-6 text-center">
                                <p class="text-xs font-bold text-slate-700">
                                    Tarik file bukti ke sini atau klik 
                                    <label class="cursor-pointer text-indigo-600 underline">
                                        PILIH FILE
                                        <input type="file" name="bukti_pekerjaan" accept=".png,.jpg,.jpeg,.pdf,.zip" required class="hidden">
                                    </label>
                                </p>
                                <p class="mt-1 text-[10px] text-slate-400">PNG, JPG, PDF, atau ZIP repository (Maks. 10MB)</p>
                            </div>
                        </div>

                        <!-- Tombol Submit dengan Paksaan Inline Style Gradient -->
                        <button type="submit" class="flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:opacity-95" style="background: linear-gradient(135deg, #5865ff 0%, #8050ff 100%) !important;">
                            KIRIM DAILY REPORT
                        </button>
                    </form>
                </article>
            </div>

            <!-- Kolom Kanan: Riwayat & Progres -->
            <div class="space-y-6 lg:col-span-5">
                <article class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                    <div class="mb-5 flex items-center justify-between">
                        <div>
                            <h2 class="text-sm font-bold text-slate-800">RIWAYAT</h2>
                            <p class="text-[10px] text-slate-400">Aktivitas 5 hari terakhir</p>
                        </div>
                        <span class="rounded-lg bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-600">Bulan Ini: Mei 2024</span>
                    </div>

                    <!-- List 4 Riwayat Sesuai Figma -->
                    <div class="space-y-3.5 mb-5">
                        ${riwayatDailyData.map((item) => `
                            <div class="rounded-xl border ${item.status === 'REVISI' ? 'border-rose-100 bg-rose-50/40' : item.status === 'MENUNGGU' ? 'border-amber-100 bg-amber-50/40' : 'border-slate-100 bg-slate-50/50'} p-3.5 transition-all hover:border-slate-200">
                                <div class="flex items-center justify-between gap-2">
                                    <span class="text-[10px] font-semibold text-slate-400">${item.tanggal}</span>
                                    <span class="rounded-full px-2.5 py-0.5 text-[9px] font-bold ${item.statusBadge}">● ${item.status}</span>
                                </div>
                                <h3 class="mt-1 text-xs font-bold text-slate-800">${item.judul}</h3>

                                ${item.status === "MENUNGGU" ? `
                                    <div class="mt-2.5 flex items-center justify-between rounded-lg bg-amber-50/80 p-2 text-[10px] text-amber-700">
                                        <span>Menunggu verifikasi instruktur teknis</span>
                                        <span>⏳</span>
                                    </div>
                                ` : `
                                    <div class="mt-2.5 rounded-lg ${item.status === 'REVISI' ? 'bg-rose-50/80 border border-rose-100' : 'bg-indigo-50/70'} p-2">
                                        <div class="flex items-center justify-between mb-0.5">
                                            <div class="flex items-center gap-1.5">
                                                <span class="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-[8px] font-bold text-white">${item.initialMentor}</span>
                                                <span class="text-[10px] font-bold text-slate-800">${item.mentor}</span>
                                            </div>
                                            ${item.jamMentor ? `<span class="text-[9px] text-slate-400">${item.jamMentor}</span>` : ""}
                                        </div>
                                        <p class="text-[10px] text-slate-600 italic leading-snug">"${item.feedback}"</p>
                                    </div>
                                `}
                            </div>
                        `).join("")}
                    </div>

                    <!-- Tombol Pemicu SPA Dynamic Switch ke Halaman Semua Riwayat -->
                    <button
                        id="btn-lihat-semua"
                        type="button"
                        class="w-full rounded-xl bg-slate-50 py-2.5 text-center text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                    >
                        LIHAT SEMUA RIWAYAT (28 LAPORAN) →
                    </button>
                </article>

                <!-- Card Progres Sprint Mingguan -->
                <article class="rounded-2xl p-6 text-white shadow-lg shadow-indigo-500/20" style="background: linear-gradient(135deg, #5865ff 0%, #8050ff 100%) !important;">
                    <div class="mb-4 flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="h-2 w-2 rounded-full bg-emerald-400"></span>
                            <span class="text-[10px] font-bold uppercase tracking-wider text-indigo-100">PROGRES SPRINT MINGGUAN</span>
                        </div>
                        <span class="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-medium text-white">Pekan Ke-4</span>
                    </div>
                    <div class="flex items-baseline gap-2">
                        <span class="text-4xl font-extrabold tracking-tight text-white">92%</span>
                        <span class="text-xs text-indigo-100">Target Laporan Terpenuhi</span>
                    </div>
                    <div class="mt-3 h-2 w-full overflow-hidden rounded-full bg-black/20">
                        <div class="h-full rounded-full bg-emerald-400 transition-all duration-500" style="width: 92%"></div>
                    </div>
                    <p class="mt-4 text-[11px] leading-relaxed text-indigo-100">
                        Pertahankan kedisiplinan pelaporan untuk menjaga kuota sertifikasi industri Anda.
                    </p>
                </article>
            </div>

        </div>
    `;

    // Pasang Event Listener ke tombol "LIHAT SEMUA RIWAYAT"
    const btnLihatSemua = document.getElementById("btn-lihat-semua");
    if (btnLihatSemua) {
        btnLihatSemua.addEventListener("click", () => {
            renderSemuaRiwayatView();
        });
    }
}