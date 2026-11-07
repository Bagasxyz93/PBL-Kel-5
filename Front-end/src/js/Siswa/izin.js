const riwayatIzinData = [
    {
        tanggal: "15 Mei 2026",
        durasi: "1 Hari Penuh",
        kegiatan: "Praktikum Inkubasi Web Dev",
        alasan: "Sakit demam tinggi disertai flu...",
        dokumen: "surat_dokter_15mei.pdf",
        tglPengajuan: "15 Mei 2026",
        jamPengajuan: "06:45 WIB",
        status: "Menunggu",
        statusBadge: "bg-amber-50 text-amber-600 border border-amber-200",
        mentor: "Dalam proses verifikasi oleh Bpk. Hendra S.Kom",
        initialMentor: "HS"
    },
    {
        tanggal: "02 Mei 2026",
        durasi: "1 Hari Penuh",
        kegiatan: "Mentoring UI/UX Sprint #3",
        alasan: "Menghadiri agenda...",
        dokumen: "undangan_bnsp_fauzan.pdf",
        tglPengajuan: "01 Mei 2026",
        jamPengajuan: "19:30 WIB",
        status: "Disetujui",
        statusBadge: "bg-emerald-50 text-emerald-600 border border-emerald-200",
        mentor: "Dispensasi diterima. Tetap submit progress tugas sprint via Figma.",
        initialMentor: "RS"
    },
    {
        tanggal: "18 Apr 2026",
        durasi: "1 Hari Penuh",
        kegiatan: "Praktikum Inkubasi Web Dev",
        alasan: "Pemeriksaan kesehatan rawat...",
        dokumen: "surat_keterangan_rsud.pdf",
        tglPengajuan: "17 Apr 2026",
        jamPengajuan: "21:10 WIB",
        status: "Disetujui",
        statusBadge: "bg-emerald-50 text-emerald-600 border border-emerald-200",
        mentor: "Valid. Rekaman rekaman materi praktikum telah dikirimkan ke portal.",
        initialMentor: "HS"
    },
    {
        tanggal: "10 Mar 2026",
        durasi: "1 Hari Penuh",
        kegiatan: "Review Prototype Micro-Enterprise",
        alasan: "Keperluan keluarga di luar...",
        dokumen: null,
        tglPengajuan: "10 Mar 2026",
        jamPengajuan: "08:15 WIB",
        status: "Ditolak",
        statusBadge: "bg-rose-50 text-rose-600 border border-rose-200",
        mentor: "Pengajuan terlambat (setelah jam mulai) dan surat izin wali belum diunggah.",
        initialMentor: "HS"
    }
];

function renderRiwayatIzin() {
    const container = document.getElementById("riwayat-izin-container");
    if (!container) return;

    container.innerHTML = riwayatIzinData.map((item) => `
        <tr class="hover:bg-slate-50/60 transition-colors">
            <td class="py-4 pl-2 font-bold text-slate-800 align-top">
                ${item.tanggal}
                <span class="block text-[10px] font-medium text-slate-400 mt-0.5">${item.durasi}</span>
            </td>
            <td class="py-4 align-top max-w-[200px]">
                <span class="inline-block rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-600 mb-1">
                    ${item.kegiatan}
                </span>
                <p class="text-xs text-slate-500 truncate">${item.alasan}</p>
            </td>
            <td class="py-4 align-top">
                ${item.dokumen ? `
                    <a href="#" class="inline-flex items-center gap-1.5 rounded-lg border border-rose-100 bg-rose-50/50 px-2.5 py-1 text-[11px] font-medium text-rose-600 hover:bg-rose-100 transition">
                        <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                        </svg>
                        ${item.dokumen}
                    </a>
                ` : `
                    <span class="inline-flex items-center gap-1 text-[11px] text-slate-400 italic">
                        Tidak ada dokumen
                    </span>
                `}
            </td>
            <td class="py-4 align-top">
                <span class="font-medium text-slate-700 block">${item.tglPengajuan}</span>
                <span class="text-[10px] text-slate-400 block">${item.jamPengajuan}</span>
            </td>
            <td class="py-4 align-top">
                <span class="inline-block rounded-full px-3 py-1 text-[10px] font-bold ${item.statusBadge}">
                    ● ${item.status}
                </span>
            </td>
            <td class="py-4 pr-2 align-top max-w-[220px]">
                <div class="flex items-start gap-2">
                    <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">
                        ${item.initialMentor}
                    </span>
                    <p class="text-[11px] text-slate-500 leading-snug">${item.mentor}</p>
                </div>
            </td>
        </tr>
    `).join("");
}

export function initIzin() {
    renderRiwayatIzin();
}