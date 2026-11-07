const semuaRiwayatData = [
    {
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

function renderSemuaRiwayat() {
    const container = document.getElementById("semua-riwayat-container");
    if (!container) return;

    container.innerHTML = semuaRiwayatData.map((item) => `
        <article class="rounded-2xl border ${item.status === 'REVISI' ? 'border-rose-200 bg-rose-50/10' : 'border-slate-100 bg-white'} p-6 shadow-sm">
            <!-- Header Card -->
            <div class="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div class="flex items-center gap-3">
                    <span class="text-xs font-bold text-slate-800">${item.tanggal}</span>
                    <span class="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600">${item.sesi}</span>
                </div>
                <span class="rounded-full px-3 py-1 text-[10px] font-bold ${item.statusBadge}">
                    ● ${item.status}
                </span>
            </div>

            <!-- Konten Utama -->
            <div class="py-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div class="lg:col-span-7 space-y-2">
                    <h2 class="text-sm font-extrabold text-slate-800">${item.judul}</h2>
                    <p class="text-xs text-slate-600 leading-relaxed">${item.deskripsi}</p>
                </div>

                <!-- Bagian Lampiran File -->
                <div class="lg:col-span-5">
                    <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">LAMPIRAN BUKTI</p>
                    <div class="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-3">
                        <div class="flex items-center gap-3">
                            <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                                </svg>
                            </div>
                            <div>
                                <p class="text-xs font-bold text-slate-800 truncate max-w-[180px]">${item.lampiranNama}</p>
                                <p class="text-[10px] text-slate-400">${item.lampiranUkuran}</p>
                            </div>
                        </div>
                        <a href="#" class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition shadow-sm">
                            Unduh
                        </a>
                    </div>
                </div>
            </div>

            <!-- Footer / Feedback Mentor -->
            <div class="rounded-xl ${item.status === 'REVISI' ? 'bg-rose-50/70 border border-rose-100' : 'bg-slate-50/70'} p-3.5 mt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div class="flex items-start gap-3">
                    <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                        ${item.mentorInisial}
                    </span>
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="text-xs font-bold text-slate-800">${item.mentorNama}</span>
                            <span class="text-[10px] text-slate-400">(${item.mentorJabatan})</span>
                            ${item.mentorWaktu ? `<span class="text-[10px] text-slate-400">• ${item.mentorWaktu}</span>` : ''}
                        </div>
                        <p class="text-[11px] text-slate-600 italic mt-0.5">"${item.feedback}"</p>
                    </div>
                </div>

                ${item.isRevisi ? `
                    <button class="shrink-0 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-700 transition">
                        Kirim Ulang Revisi
                    </button>
                ` : ''}
            </div>
        </article>
    `).join("");
}

document.addEventListener("DOMContentLoaded", () => {
    renderSemuaRiwayat();
});