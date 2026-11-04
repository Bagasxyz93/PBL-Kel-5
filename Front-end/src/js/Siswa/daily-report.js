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

function renderRiwayatDaily() {
    const container = document.getElementById("riwayat-daily-container");
    if (!container) return;

    container.innerHTML = riwayatDailyData.map((item) => `
        <article class="rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:border-slate-200">
            <div class="flex items-center justify-between gap-2">
                <span class="text-[10px] font-semibold text-slate-400">${item.tanggal}</span>
                <span class="rounded-full px-2.5 py-0.5 text-[9px] font-bold ${item.statusBadge}">
                    ● ${item.status}
                </span>
            </div>

            <h3 class="mt-1 text-xs font-bold text-slate-800">${item.judul}</h3>

            ${item.status === "MENUNGGU" ? `
                <div class="mt-3 flex items-center justify-between rounded-lg bg-amber-50/60 p-2.5 text-[10px] text-amber-700">
                    <span>Menunggu verifikasi instruktur teknis</span>
                    <span>⏳</span>
                </div>
            ` : `
                <div class="mt-3 rounded-lg ${item.status === "REVISI" ? "bg-rose-50/60 border border-rose-100" : "bg-indigo-50/60"} p-2.5">
                    <div class="flex items-center justify-between mb-1">
                        <div class="flex items-center gap-1.5">
                            <span class="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-[9px] font-bold text-white">
                                ${item.initialMentor}
                            </span>
                            <span class="text-[10px] font-bold text-slate-800">${item.mentor}</span>
                        </div>
                        ${item.jamMentor ? `<span class="text-[9px] text-slate-400">${item.jamMentor}</span>` : ""}
                    </div>
                    <p class="text-[10px] text-slate-600 italic leading-snug">
                        "${item.feedback}"
                    </p>
                </div>
            `}
        </article>
    `).join("");
}

export function initDailyReport() {
    renderRiwayatDaily();
}