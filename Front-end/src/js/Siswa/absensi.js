const riwayatAbsenData = [
    {
        periode: "BULAN 1",
        bulanTahun: "(MEI 2026)",
        program: "DASAR PEMROGRAMAN WEB & HTML/CSS",
        id: 1
    },
    {
        periode: "BULAN 2",
        bulanTahun: "(APRIL 2026)",
        program: "RESPONSIVE LAYOUT & TAILWIND CSS",
        id: 2
    },
    {
        periode: "BULAN 3",
        bulanTahun: "(MARET 2026)",
        program: "JAVASCRIPT & DOM MANIPULATION",
        id: 3
    },
    {
        periode: "BULAN 4",
        bulanTahun: "(FEBRUARI 2026)",
        program: "INTEGRASI API & INKUBASI PROYEK",
        id: 4
    }
];

function renderRiwayatAbsen() {
    const container = document.getElementById("riwayat-absen-container");
    if (!container) return;

    container.innerHTML = riwayatAbsenData.map((item) => `
        <tr class="hover:bg-slate-50/60 transition-colors">
            <td class="py-4 pl-2 font-bold text-slate-800">
                ${item.periode} <span class="font-normal text-slate-400 ml-1">${item.bulanTahun}</span>
            </td>
            <td class="py-4 font-bold text-slate-700 uppercase">
                ${item.program}
            </td>
            <td class="py-4 text-right pr-2">
                <button 
                    type="button" 
                    onclick="alert('Melihat detail ${item.periode}')"
                    class="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#5865ff] to-[#8050ff] px-4 py-2 text-[11px] font-bold text-white shadow-md shadow-indigo-500/20 hover:opacity-95 transition-all"
                >
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    VIEW
                </button>
            </td>
        </tr>
    `).join("");
}

export function initAbsensi() {
    renderRiwayatAbsen();
}